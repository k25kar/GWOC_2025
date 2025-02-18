// /pages/api/bookings/complete.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/dbConnect';
import Booking from '@/src/models/Booking';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
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
      return res.status(404).json({ message: "Booking not found" });
    }
    // Mark booking as complete – here, we remove it from the collection.
    await booking.remove();
    res.status(200).json({ message: "Booking marked as done" });
  } catch (error) {
    res.status(500).json({ message: "Error marking booking as done", error });
  } finally {
    await db.disconnect();
  }
}
