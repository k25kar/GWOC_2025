import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Service model
interface IService extends Document {
  name: string;
  category: string;
  price: string; // Assuming the price is a string (based on your data example)
}

// Define the schema for the Service model
const serviceSchema = new Schema<IService>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: String, required: true }, // Add the price field and make it required
});

// Create the Service model
const Service = mongoose.models.Service || mongoose.model<IService>('Service', serviceSchema);

export default Service;
