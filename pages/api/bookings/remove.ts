// /pages/api/bookings/remove.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/dbConnect';
import Booking from '@/src/models/Booking';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Use POST here (since we're updating the document, not deleting it)
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { bookingId, providerId } = req.query;
  if (!bookingId || typeof bookingId !== "string" || !providerId || typeof providerId !== "string") {
    return res.status(400).json({ message: "Invalid parameters" });
  }
  await db.connect();
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      await db.disconnect();
      return res.status(404).json({ message: "Booking not found" });
    }
    // Add providerId to ignoredProviders if not already present
    if (!booking.ignoredProviders) {
      booking.ignoredProviders = [];
    }
    if (!booking.ignoredProviders.includes(providerId)) {
      booking.ignoredProviders.push(providerId);
    }
    await booking.save();
    await db.disconnect();
    res.status(200).json({ message: "Booking removed from your orders view" });
  } catch (error) {
    await db.disconnect();
    res.status(500).json({ message: "Error updating booking", error });
  }
}
