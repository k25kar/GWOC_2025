// /pages/api/bookings/history.ts
import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/dbConnect";
import Booking from "@/src/models/Booking";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await db.connect();
    // History bookings: those with a date < today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const historyBookings = await Booking.find({ date: { $lt: today } });
    await db.disconnect();
    res.status(200).json(historyBookings);
  } catch (error) {
    await db.disconnect();
    res.status(500).json({ message: "Error fetching booking history" });
  }
};

export default handler;
