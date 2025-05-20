import { v2 as cloudinary } from "cloudinary";

// Modified for buffer upload (compatible with Vercel)
export const uploadToCloudinary = async (fileBuffer, mimeType) => {
  if (!fileBuffer) return null;
  
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
  try {
    // Convert buffer to base64 for Cloudinary upload
    const base64Data = Buffer.from(fileBuffer).toString('base64');
    const dataURI = `data:${mimeType};base64,${base64Data}`;
    
    // Upload to Cloudinary using buffer
    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
    });
    
    return uploadResult;
  } catch (error) {
    console.error("Error Uploading File to Cloudinary:", error);
    return null;
  }
};

export const deleteFromCloudinary = async (fileID) => {
  if (!fileID) return;
  
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
  try {
    // Delete image from Cloudinary
    const result = await cloudinary.uploader.destroy(fileID);
    return result;
  } catch (error) {
    console.error("Error Deleting File from Cloudinary:", error);
    return null;
  }
};