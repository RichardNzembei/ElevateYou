import getFirebaseAdmin from "../firebase";
import { FieldValue } from "firebase-admin/firestore";

export default defineEventHandler(async (event) => {
  // Set CORS headers
  setResponseHeaders(event, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  // Handle preflight OPTIONS request
  if (event.node.req.method === "OPTIONS") {
    return { message: "CORS preflight passed" };
  }

  try {
    const {firestore} = getFirebaseAdmin();
    if (!firestore) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to initialize Firestore",
      });
    }

    if (event.node.req.method === "POST") {
      const body = await readBody(event);

      // Validate required fields
      if (!body.projectId) {
        throw createError({
          statusCode: 400,
          statusMessage: "Missing projectId",
        });
      }
      if (
        !body.date ||
        !body.landPrepLabor ||
        !body.prepDescription ||  // corrected spelling
        !body.prepPrice
      ) {
        throw createError({
          statusCode: 400,
          statusMessage: "Missing required fields for land prep record",
        });
      }

      // Create a new labor record with consistent naming
      const newRecord = {
        id: Date.now(),
        date: body.date,
        landPrepLabor: body.landPrepLabor,
        prepDescription: body.prepDescription,
        prepPrice: body.prepPrice,
        createdAt: new Date(),
      };

      console.log("New land prep record:", newRecord);

      // Get the project document from Firestore
      const projectRef = firestore.collection("projects").doc(body.projectId);
      const projectSnap = await projectRef.get();
      if (!projectSnap.exists) {
        throw createError({
          statusCode: 404,
          statusMessage: "Project not found",
        });
      }

      // Update the project with the new labor record using arrayUnion
      await projectRef.update({
        landPrepTable: FieldValue.arrayUnion(newRecord),
      });

      return {
        message: "Land prep record added successfully",
        id: newRecord.id,
      };
    }

    throw createError({
      statusCode: 405,
      statusMessage: "Method Not Allowed",
    });
  } catch (error) {
    console.error("Error adding land prep record:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
