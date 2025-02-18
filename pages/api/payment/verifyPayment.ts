// /pages/api/payment/verifyPayment.ts
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

const verifyPayment = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Construct the string to verify
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    // Generate the expected signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(body)
      .digest("hex");

    // Compare the Razorpay signature with the expected signature
    if (razorpay_signature === expectedSignature) {
      res.status(200).json({ success: true, message: "Payment verified" });
    } else {
      res.status(400).json({ success: false, message: "Payment verification failed" });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ message: "Error verifying payment", error });
  }
};

export default verifyPayment;
