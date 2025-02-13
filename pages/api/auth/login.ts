import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import User from '@/src/models/User';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/lib/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { role, email, phone, password } = req.body;
      
      const user = await User.findOne({ 
        $or: [{ email }, { phone }],
        role 
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate and send OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
      await User.findByIdAndUpdate(user._id, {
        otp,
        otpExpiry: new Date(Date.now() + 15 * 60 * 1000)
      });

      await sendEmail({
        to: user.email,
        subject: 'Login OTP',
        text: `Your OTP is ${otp}`
      });

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}