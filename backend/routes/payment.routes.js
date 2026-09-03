import express from "express";
import gettingUserIdFromToken from "../middlewares/gettingUserIDFromToken.js";
import {
  paymentOrderCreate,
  verifyPayment,
} from "../controllers/payment.controller.js";

const paymentRoute = express.Router();

paymentRoute.post("/order", gettingUserIdFromToken, paymentOrderCreate);
paymentRoute.post("/verify", gettingUserIdFromToken, verifyPayment);

export default paymentRoute;
