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
    const {firestore}= getFirebaseAdmin();
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
        !body.quantity ||
        !body.quality ||
        !body.pricePerUnit
      ) {
        throw createError({
          statusCode: 400,
          statusMessage: "Missing required fields for labor record",
        });
      }

   
      const newRecord = {
        id: Date.now(),
        date: body.date,
        quantity: body.quantity,
        quality: body.quality,
        pricePerUnit: body.pricePerUnit,
        createdAt: new Date(),
      };

      console.log("New Harvest record:", newRecord);
      const projectRef = firestore.collection("projects").doc(body.projectId);
      const projectSnap = await projectRef.get();
      if (!projectSnap.exists) {
        throw createError({
          statusCode: 404,
          statusMessage: "Project not found",
        });
      }

   
      await projectRef.update({
        harvestTable: FieldValue.arrayUnion(newRecord),
      });

      return {
        message: "Harvest record added successfully",
        id: newRecord.id,
      };
    }

    throw createError({
      statusCode: 405,
      statusMessage: "Method Not Allowed",
    });
  } catch (error) {
    console.error("Error adding harvest record:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
