import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Service from "../../../src/models/Service";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      await dbConnect.connect(); // Ensure database connection

      const { category } = req.query;

      // Fetch services, filtering by category if provided
      const services = category
        ? await Service.find({ category }, "name description price active imageUrl category bookingCount")
        : await Service.find({}, "name description price active imageUrl category bookingCount");

      res.status(200).json({ services });
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Error fetching services", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default handler;
