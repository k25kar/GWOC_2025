import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from "../../../lib/dbConnect";
import BlogPostModel from '../../../src/models/blogs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      await dbConnect.connect(); // Ensure database connection is established
      const blogPosts = await BlogPostModel.find();
      res.status(200).json(blogPosts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      res.status(500).json({ error: 'Failed to fetch blog posts' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
