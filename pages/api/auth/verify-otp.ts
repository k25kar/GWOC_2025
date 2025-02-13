import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@/src/models/User';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { email, otp } = req.body;
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(400).json({ message: 'Invalid request' });
      }

      if (user.otp !== otp || new Date() > new Date(user.otpExpiry)) {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
      }

      // Clear OTP
      await User.findByIdAndUpdate(user._id, { 
        otp: null,
        otpExpiry: null
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}