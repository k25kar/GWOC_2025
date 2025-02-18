// pages/api/testimonials.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Testimonial, { ITestimonial } from "@/src/models/Testimonial";

await dbConnect.connect();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const testimonials: ITestimonial[] = await Testimonial.find({});
        res.status(200).json(testimonials);
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const testimonial = await Testimonial.create(req.body);
        res.status(201).json(testimonial);
      } catch (error) {
        res.status(400).json({ success: false, error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
