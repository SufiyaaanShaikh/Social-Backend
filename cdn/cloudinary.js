import { v2 as cloudinary } from "cloudinary";

export const uploadonCloudinary = async (fileBuffer) => {
  if (!fileBuffer) return null;

  try {
    // Configure cloudinary with environment variables
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Convert buffer to base64 for direct upload
    const fileStr = fileBuffer.toString('base64');
    const fileUri = `data:image/jpeg;base64,${fileStr}`;
    
    // Return a proper Promise
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        fileUri, 
        { resource_type: "auto" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });
  } catch (error) {
    console.error("Error in cloudinary setup:", error);
    throw error; // Throw the error for better error handling upstream
  }
};

export const deleteFromCloudinary = async (fileID) => {
  if(!fileID) return null;
  
  try {
    // Configure cloudinary with environment variables
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    
    // Return a proper Promise
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(fileID, (error, result) => {
        if (error) {
          console.error("Cloudinary delete error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.error("Error in cloudinary delete setup:", error);
    throw error;
  }
};