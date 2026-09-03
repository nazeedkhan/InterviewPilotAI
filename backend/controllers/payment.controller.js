import paymentModel from "../models/payment.model.js";
import userModel from "../models/user.model.js";
import razorpay from "../services/razorpay.service.js";
import crypto from "crypto";

export const paymentOrderCreate = async (req, res) => {
  try {
    const { planId, amount, credits } = req.body;
    if (!amount || !credits) {
      return res.status(400).json({ message: "Invalid Plan!" });
    }
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const createNewOrder = await razorpay.orders.create(options);
    await paymentModel.create({
      userId: req.userID,
      planId,
      amount,
      credits,
      razorpayOrderId: createNewOrder.id,
      status: "created",
    });

    return res.status(200).json(createNewOrder);
  } catch (error) {
    return res.status(500).json({ "Failed to create Razorpay order :": error });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid Payment Signature!" });
    }
    const payment = await paymentModel.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!payment) {
      return res.status(400).json({ message: "Payment not found!" });
    }

    if (payment.status === "paid") {
      return res.json({ message: "Payment Already Processed! " });
    }

    // update payment record
    payment.status = "paid";
    payment.razorpayPaymentId = razorpay_payment_id;
    await payment.save();

    // add credits to user account
    const updateUser = await userModel.findByIdAndUpdate(
      payment.userId,
      {
        $inc: { credit: payment.credits },
      },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified and credits added.",
      user: updateUser,
    });
  } catch (error) {
    return res.status(500).json({ "Failed to Verify Payment :": error });
  }
};
