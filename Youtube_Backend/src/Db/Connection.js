import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `Mongoose connected  !! DB_Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("Error in DB connection", error);
    throw error;
  }
};

export default connectDB;