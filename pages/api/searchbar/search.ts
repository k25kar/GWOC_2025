import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../../lib/dbConnect';
import Service from '../../../src/models/Service';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    await dbConnect.connect(); // Ensure database connection

    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ message: 'Invalid search query' });
    }

    // Perform a case-insensitive search on name and category
    const services = await Service.find({
      $or: [
        { name: { $regex: query, $options: 'i' } }, // Match service names
        { category: { $regex: query, $options: 'i' } } // Match categories
      ]
    });

    res.status(200).json({ services });
  } catch (error) {
    console.error('Search API Error:', error);
    res.status(500).json({ message: 'Error fetching search results', error });
  }
};

export default handler;
