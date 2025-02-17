import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/dbConnect";
import User from "@/src/models/User";
import bcrypt from "bcryptjs";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(422).json({ message: "User ID is required" });
  }

  try {
    await db.connect();

    if (req.method === "GET") {
      const user = await User.findById(id).select("-password");
      await db.disconnect();
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    }

    if (req.method === "PUT") {
      const { name, email, phone, address, pincode, currentPassword, newPassword } = req.body;

      if (!name || !email) {
        await db.disconnect();
        return res.status(400).json({ message: "Name and email are required" });
      }

      const user = await User.findById(id);
      if (!user) {
        await db.disconnect();
        return res.status(404).json({ message: "User not found" });
      }

      if (!currentPassword) {
        await db.disconnect();
        return res.status(400).json({ message: "Current password is required" });
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        await db.disconnect();
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      const updateData: any = { name, email, phone, address, pincode };
      if (newPassword && newPassword.trim().length > 0) {
        updateData.password = bcrypt.hashSync(newPassword);
      }

      const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
      await db.disconnect();
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    }

    await db.disconnect();
    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Error updating user:", error);
    await db.disconnect();
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default handler;
