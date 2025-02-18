import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/dbConnect";
import Partner from "@/src/models/Partner";
import bcrypt from "bcryptjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(422)
      .json({ message: "Email and password are required" });
  }

  await db.connect();
  const partner = await Partner.findOne({ email });
  if (!partner) {
    await db.disconnect();
    return res.status(404).json({ message: "Service provider not found" });
  }

  // Check that the service provider is approved
  if (partner.status !== "approved") {
    await db.disconnect();
    return res
      .status(403)
      .json({ message: "Application not approved yet" });
  }

  const isPasswordValid = await bcrypt.compare(password, partner.password);
  if (!isPasswordValid) {
    await db.disconnect();
    return res.status(422).json({ message: "Invalid credentials" });
  }

  await db.disconnect();

  return res.status(200).json({
    message: "Login successful",
    partner: {
      _id: partner._id,
      name: partner.name,
      email: partner.email,
      phone: partner.phone,
      about: partner.about,
      skills: partner.skills,
      servicePincodes: partner.servicePincodes,
      active: partner.active,
      status: partner.status,
      stats: partner.stats,
    },
  });
};

export default handler;
