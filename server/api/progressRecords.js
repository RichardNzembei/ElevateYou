import getFirebaseAdmin from "../firebase";
import { FieldValue } from "firebase-admin/firestore";
import multiparty from "multiparty";
import fs from "fs/promises"; // Use fs.promises for async operations

const parseForm = (req) => {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form();
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  if (event.node.req.method === "OPTIONS") {
    return { message: "CORS preflight passed" };
  }

  try {
    const { firestore, storageBucket } = getFirebaseAdmin();
    if (!firestore || !storageBucket) {
      throw createError({
        statusCode: 500,
        statusMessage: "Firebase init failed",
      });
    }

    if (event.node.req.method === "POST") {
      let fields, files;
      try {
        const formData = await parseForm(event.node.req);
        fields = formData.fields;
        files = formData.files;
      } catch (parseError) {
        console.error("❌ Form parsing error:", parseError);
        throw createError({
          statusCode: 400,
          statusMessage: "Invalid form data",
        });
      }

      if (
        !fields?.projectId?.[0] ||
        !fields?.date?.[0] ||
        !fields?.stage?.[0]
      ) {
        throw createError({
          statusCode: 400,
          statusMessage: "Missing required fields",
        });
      }

      let imageUrl = "";
      if (files?.image?.[0]) {
        try {
          const imageFile = files.image[0];
          const fileName = `progress_images/${Date.now()}_${
            imageFile.originalFilename
          }`;
          const file = storageBucket.file(fileName);
          const buffer = await fs.readFile(imageFile.path);

          await file.save(buffer, {
            metadata: { contentType: imageFile.headers["content-type"] },
          });
          await file.makePublic();
          imageUrl = `https://storage.googleapis.com/${storageBucket.name}/${fileName}`;
        } catch (uploadError) {
          console.error("❌ Image upload failed:", uploadError);
          throw createError({
            statusCode: 500,
            statusMessage: "Failed to upload image",
          });
        }
      }

      const newRecord = {
        id: Date.now(),
        date: fields.date[0],
        stage: fields.stage[0],
        imageUrl,
        createdAt: new Date(),
      };

      const projectRef = firestore
        .collection("projects")
        .doc(fields.projectId[0]);
      const projectSnap = await projectRef.get();

      if (!projectSnap.exists) {
        throw createError({
          statusCode: 404,
          statusMessage: "Project not found",
        });
      }

      await projectRef.update({
        progressTable: FieldValue.arrayUnion(newRecord),
      });

      return { message: "Progress record added", id: newRecord.id, imageUrl };
    }

    throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" });
  } catch (error) {
    console.error("❌ Error:", error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || "Internal Server Error",
    });
  }
});
