import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/dbConnect";
import User from "@/src/models/User";
import bcrypt from "bcryptjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ message: "Email and password required" });
  }

  await db.connect();
  const user = await User.findOne({ email });
  if (!user) {
    await db.disconnect();
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    await db.disconnect();
    return res.status(422).json({ message: "Invalid credentials" });
  }

  await db.disconnect();

  // In a full implementation, you would now issue a token or set session cookies.
  // For demonstration, we simply return the user info.
  return res.status(200).json({
    message: "Login successful",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      pincode: user.pincode,
      isAdmin: user.isAdmin,
    },
  });
};

export default handler;