// /pages/api/payment/createOrder.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY!, // Your Razorpay key
  key_secret: process.env.RAZORPAY_SECRET, // Your Razorpay secret
});

const createOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { amount, userDetails } = req.body;

  if (!amount || !userDetails) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_order_${new Date().getTime()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      orderId: order.id, // This will be used for payment in Razorpay frontend
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Error creating Razorpay order", error });
  }
};

export default createOrder;
