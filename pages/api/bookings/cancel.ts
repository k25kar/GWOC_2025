// /pages/api/bookings/cancel.ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/dbConnect";
import Booking from "@/src/models/Booking";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { bookingId } = req.query;
  if (!bookingId || typeof bookingId !== "string") {
    return res.status(400).json({ message: "Invalid booking ID" });
  }

  await db.connect();
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      await db.disconnect();
      return res.status(404).json({ message: "Booking not found" });
    }
    // Delete the booking document (user cancellation) using deleteOne()
    await booking.deleteOne();
    await db.disconnect();
    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    await db.disconnect();
    console.error("Error cancelling booking:", error);
    res.status(500).json({ message: "Error cancelling booking", error });
  }
}
