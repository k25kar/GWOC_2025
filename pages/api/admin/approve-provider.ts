import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@/src/models/User';
import {sendEmail} from '@/lib/email';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'PUT') {
    try {
      const { userId } = req.body;
      const user = await User.findByIdAndUpdate(userId, { isApproved: true });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Send approval email
      await sendEmail({
        to: user.email,
        subject: 'Account Approved',
        text: 'Your service provider account has been approved!'
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}