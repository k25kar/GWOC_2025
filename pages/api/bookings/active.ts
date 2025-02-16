// /pages/api/bookings/active.ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/dbConnect";
import Booking from "@/src/models/Booking";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await db.connect();
    // Active bookings: those with a date >= today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activeBookings = await Booking.find({ date: { $gte: today } });
    await db.disconnect();
    res.status(200).json(activeBookings);
  } catch (error) {
    await db.disconnect();
    res.status(500).json({ message: "Error fetching active bookings" });
  }
};

export default handler;
