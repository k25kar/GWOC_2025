// /pages/api/bookings/accept.ts
import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import db from "@/lib/dbConnect";
import Booking from "@/src/models/Booking";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Retrieve session from NextAuth
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const { bookingId } = req.query;
  if (!bookingId || typeof bookingId !== "string") {
    return res.status(400).json({ message: "Invalid booking ID" });
  }

  await db.connect();
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ message: "Booking not found. Possibly cancelled by user." });
    }
    if (booking.serviceProviderId) {
      return res.status(409).json({ message: "Service already taken" });
    }
    // Use logged in service provider's details from the session.
    // Make sure session.user contains _id, name, and phone.
    booking.serviceProviderId = new mongoose.Types.ObjectId(session.user._id);
    booking.serviceProviderName = session.user.name;
    booking.serviceProviderContact = session.user.phone;

    await booking.save();
    res.status(200).json(booking);
  } catch (error) {
    console.error("Error accepting booking:", error);
    res.status(500).json({ message: "Error accepting booking", error });
  } finally {
    await db.disconnect();
  }
}
