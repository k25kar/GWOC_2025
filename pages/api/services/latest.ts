import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Service from "../../../src/models/Service";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      await dbConnect.connect(); // Ensure database connection

      // Fetch latest 3 services sorted by `dateAdded` in descending order (newest first)
      const latestServices = await Service.find()
        .sort({ dateAdded: -1 }) // Sort by dateAdded instead of _id
        .limit(3);

      res.status(200).json({ services: latestServices });
    } catch (error) {
      console.error("Error fetching latest services:", error);
      res.status(500).json({ message: "Error fetching latest services", error });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default handler;
