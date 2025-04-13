// /server/api/updateStatus.js
import getFirebaseAdmin from "../firebase";

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
      if (!body.projectId || !body.status) {
        throw createError({
          statusCode: 400,
          statusMessage: "Missing projectId or status",
        });
      }

      // Validate that only "pin" and "end" are accepted
      if (!['pin', 'end'].includes(body.status)) {
        throw createError({
          statusCode: 400,
          statusMessage: "Invalid status value",
        });
      }

      // Get a reference to the project and check if it exists
      const projectRef = firestore.collection("projects").doc(body.projectId);
      const projectSnap = await projectRef.get();

      if (!projectSnap.exists) {
        throw createError({
          statusCode: 404,
          statusMessage: "Project not found",
        });
      }

      // Update the project with the new status
      await projectRef.update({
        status: body.status,
      });

      // Retrieve the updated project data
      const updatedProjectSnap = await projectRef.get();
      const updatedProject = { id: updatedProjectSnap.id, ...updatedProjectSnap.data() };

      return updatedProject;
    }

    throw createError({
      statusCode: 405,
      statusMessage: "Method Not Allowed",
    });
  } catch (error) {
    console.error("Error updating project status:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    });
  }
});
