import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export const uploadonCloudinary = async (fileBuffer) => {
  if (!fileBuffer) return null;

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    const uploadResult = await cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return null;
        }
        return result;
      }
    );

    // Convert to a stream to feed Cloudinary
    const streamifier = await import("streamifier");
    streamifier.default.createReadStream(fileBuffer).pipe(uploadResult);

    return new Promise((resolve, reject) => {
      uploadResult.on("finish", (result) => resolve(result));
      uploadResult.on("error", (err) => reject(err));
    });
  } catch (error) {
    console.error("Error Uploading File", error);
    return null;
  }
};

export const deleteFromCloudinary = async (fileID) => {
    if(!fileID) return;
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
  });
  try {
    // Upload an image
    const result = await cloudinary.uploader.destroy(fileID)

    return result;
  } catch (error) {
    console.error("Error Deleting File", error);
    return null;
  }
};
