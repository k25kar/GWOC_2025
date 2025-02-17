import mongoose, { Schema, Document } from "mongoose";

// Define the interface for TypeScript
interface IService extends Document {
  id: string; // The MongoDB _id field, treated as a string
  name: string;
  description: string;
  price: number; // Number type for price
  imageUrl: string; // URL to the service image
  category: string; // Category of the service
  bookingCount: number; // Number of bookings
  dateAdded: Date; // The date when the service was added (Date object)
}


// Define the Mongoose schema
const serviceSchema = new Schema<IService>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }, // Change from string to number
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
    bookingCount: { type: Number, default: 0 },
    dateAdded: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Create the model
const Service = mongoose.models.Service || mongoose.model<IService>("Service", serviceSchema);

export default Service;
