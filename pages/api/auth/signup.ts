import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect'; 
import User from '@/src/models/User';
import bcrypt from 'bcryptjs';
import { sendEmail } from '@/lib/email';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const { email, phone, role } = req.body;
      
      // Check existing user
      const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const userData = {
        ...req.body,
        password: hashedPassword,
        ...(role === 'provider' && { isApproved: false })
      };

      const user = await User.create(userData);

      // Send OTP (implement SMS service integration here)
      const otp = Math.floor(100000 + Math.random() * 900000);
      await User.findByIdAndUpdate(user._id, {
        otp,
        otpExpiry: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
      });

      // Send email
      await sendEmail({
        to: user.email,
        subject: role === 'user' ? 'OTP Verification' : 'Application Received',
        text: role === 'user' 
          ? `Your OTP is ${otp}` 
          : 'We will contact you shortly after verifying your details'
      });

      res.status(201).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}