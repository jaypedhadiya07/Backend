import mongoose from "mongoose";
import { MY_DB } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${MY_DB}`
    );
    console.log(
      `MongoosDB connected !! DB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGOODB connection FAILED: ", error);
    process.exit(1);
  }
};

export default connectDB;
