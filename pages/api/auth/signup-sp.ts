// /pages/api/auth/signup-sp.ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/dbConnect";
import Partner from "@/src/models/Partner";
import bcrypt from "bcryptjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password, phone, servicePincodes, about, skills } = req.body;

  if (
    !name ||
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 6 ||
    !phone ||
    !servicePincodes ||
    !Array.isArray(servicePincodes) ||
    servicePincodes.length === 0 ||
    !about ||
    !skills ||
    !Array.isArray(skills) ||
    skills.length === 0
  ) {
    return res.status(422).json({ message: "Validation error" });
  }

  await db.connect();
  const existingPartner = await Partner.findOne({ email });
  if (existingPartner) {
    await db.disconnect();
    return res.status(422).json({ message: "User already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password);

  const newPartner = new Partner({
    name,
    email,
    password: hashedPassword,
    phone,
    servicePincodes,
    about,
    skills,
  });

  await newPartner.save();
  await db.disconnect();

  res.status(201).json({ message: "Created service provider" });
};

export default handler;
