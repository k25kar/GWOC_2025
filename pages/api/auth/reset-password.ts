import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import dbConnect from "../../../lib/dbConnect";
import User from "../../../src/models/User";
import PasswordReset from "../../../src/models/PasswordReset";

// Handle reset password request
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    try {
      // Connect to the database
      await dbConnect.connect();

      // Find the reset record based on the token
      const resetRecord = await PasswordReset.findOne({ token });

      if (!resetRecord || new Date() > resetRecord.expiration) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update the user's password in the 'User' collection
      await User.findByIdAndUpdate(resetRecord.userId, { password: hashedPassword });

      // Delete the reset token from the 'PasswordReset' collection
      await PasswordReset.deleteOne({ token });

      return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Something went wrong" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
};

export default handler;
