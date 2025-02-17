import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/dbConnect";
import Booking from "@/src/models/Booking";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { bookings } = req.body;
  if (!bookings || !Array.isArray(bookings)) {
    return res.status(422).json({ message: "Bookings data must be an array" });
  }

  try {
    await db.connect();
    const createdBookings = await Booking.insertMany(bookings);
    await db.disconnect();
    res.status(201).json({ message: "Bookings created", bookings: createdBookings });
  } catch (error) {
    console.error("Error inserting bookings:", error);
  await db.disconnect();
  res.status(500).json({ message: "Internal server error", error });
  }
};

export default handler;
