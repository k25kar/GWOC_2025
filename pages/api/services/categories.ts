import { NextApiRequest, NextApiResponse } from 'next'; // Import correct types
import dbConnect from "@/lib/dbConnect"; // Import your database connection
import Service from "@/src/models/Service"; // Assuming the Service model is in `src/models/Service.ts`

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      // Ensure database connection is established
      await dbConnect.connect();

      // Fetch unique categories from the 'Service' collection
      const services = await Service.find({}, "category"); // Get only the 'category' field

      // Get unique categories
      const uniqueCategories = [...new Set(services.map(service => service.category))];

      // Respond with the categories
      res.status(200).json({ categories: uniqueCategories });
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Error fetching categories", error });
    } finally {
      // Ensure the DB connection is properly closed after request is processed
      await dbConnect.disconnect();
    }
  } else {
    // Method Not Allowed for non-GET requests
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
