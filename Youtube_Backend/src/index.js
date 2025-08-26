import "dotenv/config";
import connectDB from "./Db/Connection.js";

connectDB();

/*

import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import express from "express";
const app = express();
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log("DB connected");
    app.on("error", (error) => {
      console.log("Error in starting server", error);
      throw error;
    });

    app.listen(process.env.PORT, () => {
      console.log(`App is Listening on PORT ${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error in DB connection", error);
    throw error;
  }
})();

*** ⚠️ Note:
Currently, the database connection logic and the server startup code
are mixed together inside a single async IIFE. While this works, it
makes the `index.js` file messy and harder to maintain. *** 

*/
