// /pages/api/bookings/orders.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import db from '@/lib/dbConnect';
import Booking from '@/src/models/Booking';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await db.connect();
  try {
    let query = {};
    const { providerId } = req.query;
    if (providerId && typeof providerId === "string") {
      // Exclude orders that have been removed by this provider
      query = { ignoredProviders: { $ne: providerId } };
    }
    const orders = await Booking.find(query).sort({ createdAt: -1 }).lean();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  } finally {
    await db.disconnect();
  }
}
