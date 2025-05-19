import { v2 as cloudinary } from "cloudinary";

export const uploadonCloudinary = async (fileBuffer) => {
  if (!fileBuffer) return null;

  // Configure cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  try {
    // Convert buffer to base64 for cloudinary
    const fileStr = fileBuffer.toString('base64');
    const fileUri = `data:image/jpeg;base64,${fileStr}`;
    
    // Upload directly using the upload method instead of streams
    const result = await cloudinary.uploader.upload(fileUri, {
      resource_type: "auto",
    });
    
    return result;
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
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  
  try {
    const result = await cloudinary.uploader.destroy(fileID);
    return result;
  } catch (error) {
    console.error("Error Deleting File", error);
    return null;
  }
};