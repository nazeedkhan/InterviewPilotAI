// Database connection
import mongoose from "mongoose";

async function dbConnect() {
  try {
    await mongoose.connect(process.env.DB_URL);
    return console.log("DB Connect!");
  } catch (error) {
    return console.log("Database Connection Error : ", error);
  }
}

export default dbConnect;
