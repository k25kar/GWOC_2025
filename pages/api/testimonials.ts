// pages/api/testimonials.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Testimonial, { ITestimonial } from "@/src/models/Testimonial";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure the database is connected
  await dbConnect.connect();

  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const testimonials: ITestimonial[] = await Testimonial.find({});
        res.status(200).json(testimonials);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(400).json({ success: false, error: errorMessage });
      }
      break;
    case "POST":
      try {
        const testimonial = await Testimonial.create(req.body);
        res.status(201).json(testimonial);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        res.status(400).json({ success: false, error: errorMessage });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}