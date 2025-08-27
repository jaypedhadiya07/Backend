import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary = async (localFilePath) => {
  let result;
  try {
    if (!localFilePath) throw new Error("File path is required");

    result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been successfully uploaded
    console.log("File uploaded successfully:", result.url);
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);
    throw error;
  } finally {
    // Always clean up local file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); //remove file from server after upload
    }
  }
  return result;
};

export default uploadOnCloudinary;
