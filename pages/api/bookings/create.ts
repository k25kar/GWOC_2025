import type { NextApiRequest, NextApiResponse } from "next";
import db from "@/lib/dbConnect";
import Booking from "@/src/models/Booking";
import Partner from "@/src/models/Partner"; // Approved partners model
import nodemailer from "nodemailer";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { bookings } = req.body;
  if (!bookings || !Array.isArray(bookings)) {
    return res
      .status(422)
      .json({ message: "Bookings data must be provided as an array" });
  }

  try {
    await db.connect();

    // Create the bookings in the database
    const createdBookings = await Booking.insertMany(bookings);

    // Configure Nodemailer using Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "helperbuddytestmail@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Loop over each booking to find matching approved partners
    for (const booking of bookings) {
      // Destructure category and pincode from the booking payload
      const { category, pincode } = booking;

      // Find approved and active partners whose skills include the category and who serve the given pincode (with activeStatus true)
      const matchingPartners = await Partner.find({
        status: "approved",
        active: true,
        skills: category,
        servicePincodes: { $elemMatch: { code: pincode, activeStatus: true } },
      });

      // Send an email notification to each matching partner
      for (const partner of matchingPartners) {
        const mailOptions = {
          from: "helperbuddytestmail@gmail.com",
          to: partner.email,
          subject: "New Service Opportunity Available",
          text: `Hello ${partner.name},

A new booking for a "${category}" service is available in your area (Pincode: ${pincode}). 
Log in to your account to view more details and respond if you're interested.

Best regards,
HelperBuddy Team`,
        };

        await transporter.sendMail(mailOptions);
      }
    }

    await db.disconnect();
    res.status(201).json({
      message: "Bookings created and notifications sent",
      bookings: createdBookings,
    });
  } catch (error) {
    console.error("Error inserting bookings or sending notifications:", error);
    await db.disconnect();
    res.status(500).json({ message: "Internal server error", error });
  }
};

export default handler;
