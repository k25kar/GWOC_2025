// /pages/api/auth/signup.ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/dbConnect";
import User from "@/src/models/User";
import bcrypt from "bcryptjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password, phone, address, pincode } = req.body;

  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 6 ||
    !phone ||
    !address ||
    !pincode
  ) {
    return res.status(422).json({ message: "Validation error" });
  }

  await db.connect();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    await db.disconnect();
    return res.status(422).json({ message: "User already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    phone,
    address,
    pincode,
    isAdmin: false,
    isServiceProvider: false, // Regular user
  });

  const user = await newUser.save();
  await db.disconnect();

  res.status(201).json({
    message: "Created user",
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
};

export default handler;
