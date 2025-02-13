import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@/src/models/User';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/lib/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { email, newPassword } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        otp: null,
        otpExpiry: null
      });

      await sendEmail({
        to: user.email,
        subject: 'Password Reset Successful',
        text: 'Your password has been reset successfully'
      });

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}