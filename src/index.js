/*
import mongoose from "mongoose";
import { MY_DB } from "./constants";

import express from "express";
const app = express();
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${MY_DB}`);
    app.on("error", (error) => {
      console.log("Error: ", error);
      throw error;
    });
    app.listen(process.env.PORT, () => {
      console.log(`App is Listening on Port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
})();
*/

import "dotenv/config";
import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running 🏃at port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MONGODB Connection Failed !!! ", error);
  });
