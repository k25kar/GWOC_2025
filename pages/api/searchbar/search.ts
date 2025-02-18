import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Service from "../../../src/models/Service";
import SearchLog from "../../../src/models/SearchLog";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await dbConnect.connect();

    const { query, log } = req.query;
    const shouldLog = log === "true"; // Log only if explicitly passed as `true`

    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "Invalid search query" });
    }

    const services = await Service.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    });

    // ✅ Only log missing searches when log=true
    if (shouldLog && services.length === 0) {
      const existingLog = await SearchLog.findOne({ query });

      if (existingLog) {
        existingLog.count += 1;
        await existingLog.save();
      } else {
        await SearchLog.create({ query, count: 1 });
      }
    }

    res.status(200).json({ services });
  } catch (error) {
    console.error("Search API Error:", error);
    res.status(500).json({ message: "Error fetching search results", error });
  }
};

export default handler;
