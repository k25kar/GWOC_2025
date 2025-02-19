// pages/api/auth/forgot-password.ts

import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";
import User from "../../../src/models/User";
import PasswordReset from "../../../src/models/PasswordReset"; // Adjust path accordingly
import dbConnect from "../../../lib/dbConnect"; // Adjust path accordingly

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      // Connect to the database
      await dbConnect.connect();

      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate a reset token
      const token = randomBytes(32).toString("hex");

      // Save the password reset token and its expiration time
      const resetToken = new PasswordReset({
        userId: user._id,
        token,
        expiration: new Date(Date.now() + 3600000), // Token expires in 1 hour
      });
      await resetToken.save();

      // Create transporter for Nodemailer
      const transporter = nodemailer.createTransport({
        service: "your-email-service",  // For example: 'gmail', 'sendgrid', etc.
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      // Create reset link
      const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

      // Send the email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Request",
        text: `To reset your password, click the link: ${resetLink}`,
      });

      return res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
      console.error("Error in forgot-password API:", error);
      return res.status(500).json({ message: "An error occurred while sending the email" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
