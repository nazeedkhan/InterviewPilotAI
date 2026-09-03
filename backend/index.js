import express from "express";
import dotenv from "dotenv";
dotenv.config();
import dbConnect from "./config/db.js";
import userRoute from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import interviewRoute from "./routes/interview.routes.js";
import paymentRoute from "./routes/payment.routes.js";
const app = express();

// Middlewares here
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", userRoute);
app.use('/api/interview', interviewRoute)
app.use('/api/payment', paymentRoute)

const port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", () => {
  dbConnect();
  console.log(`Listening at port ${port}`);
});
