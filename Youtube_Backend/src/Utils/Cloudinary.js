import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // file has been successfully uploaded
    // console.log("File uploaded successfully:", result.url);
    return result;
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);
    throw error;
  } finally {
    // Always clean up local file
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); //remove file from server after upload
    }
  }
};

export default uploadOnCloudinary;