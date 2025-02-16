// /pages/api/auth/signup-sp.ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/dbConnect";
import User from "@/src/models/User";
import bcrypt from "bcryptjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password, phone, servicePincodes } = req.body;

  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 6 ||
    !phone ||
    !servicePincodes ||
    !Array.isArray(servicePincodes) ||
    servicePincodes.length === 0
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

  const newSP = new User({
    name,
    email,
    password: hashedPassword,
    phone,
    isAdmin: false,
    isServiceProvider: true, // Mark as service provider
    servicePincodes, // Already an array
  });

  await newSP.save();
  await db.disconnect();

  res.status(201).json({ message: "Created service provider" });
};

export default handler;
