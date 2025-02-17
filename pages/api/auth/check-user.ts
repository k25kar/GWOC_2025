// /pages/api/auth/check-user.ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/dbConnect";
import User from "@/src/models/User";

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
    const user = await User.findOne({ email });
    await db.disconnect();

    if (user) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(404).json({ exists: false });
    }
  } catch (error) {
    await db.disconnect();
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default handler;
