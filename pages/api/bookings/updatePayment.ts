// /src/pages/api/bookings/updatePaymentStatus.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Booking from '../../../src/models/Booking';
import dbConnect from '../../../lib/dbConnect';  // Import the dbConnect utility

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { bookingId, paymentStatus } = req.body;

  // Validate input data
  if (!bookingId || !paymentStatus) {
    return res.status(400).json({ success: false, message: 'Invalid data' });
  }

  if (!['pending', 'paid'].includes(paymentStatus)) {
    return res.status(400).json({ success: false, message: 'Invalid payment status' });
  }

  try {
    // Step 1: Connect to the database using your custom connection function
    await dbConnect.connect();  // Ensure that the database is connected

    // Step 2: Update booking payment status
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { paymentStatus },
      { new: true } // Ensure we get the updated document back
    );

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Step 3: Return success response
    return res.status(200).json({
      success: true,
      message: `Booking payment status updated to ${paymentStatus}`,
      data: updatedBooking, // Optionally return the updated booking data
    });
  } catch (error) {
    console.error('Error updating booking payment status', error);
    return res.status(500).json({ success: false, message: 'Server error during status update.' });
  }
}
