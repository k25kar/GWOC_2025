// /pages/api/users/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/dbConnect";
import User from "@/src/models/User";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(422).json({ message: "User id is required" });
  }

  try {
    await db.connect();
    const user = await User.findById(id);
    await db.disconnect();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user details you need (phone, address, pincode, etc.)
    return res.status(200).json({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      pincode: user.pincode || "",
    });
  } catch (error) {
    await db.disconnect();
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default handler;
