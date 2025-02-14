import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import mongoose from 'mongoose';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    // Connect to the database
    await dbConnect();

    // Check if the connection is successful
    const connectionState = mongoose.connection.readyState;

    if (connectionState === 1) {
      res.status(200).json({ message: 'Database connected successfully!' });
    } else {
      res.status(500).json({ message: 'Database connection failed!' });
    }
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Failed to connect to the database' });
  }
}