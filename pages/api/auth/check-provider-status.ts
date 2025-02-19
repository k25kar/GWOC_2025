/* eslint-disable @typescript-eslint/no-unused-vars */
// /pages/api/auth/check-provider-status.ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/dbConnect";
import Partner from "@/src/models/Partner";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(422).json({ message: "Email is required" });
  }

  try {
    await db.connect();
    const partner = await Partner.findOne({ email });
    await db.disconnect();

    if (!partner) {
      // If no partner is found, we assume the user is a normal user.
      return res.status(404).json({ message: "Not a service provider" });
    }

    return res.status(200).json({ status: partner.status });
  } catch (error) {
    await db.disconnect();
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default handler;
