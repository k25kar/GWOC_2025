// /models/User.ts
import mongoose, { Document, Model, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  phone?: string;
  address?: string;
  pincode?: string;
  isServiceProvider?: boolean;
  servicePincodes?: string[];
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    // Extra fields for both regular users and service providers
    phone: { type: String },
    address: { type: String },
    pincode: { type: String },
    // For service providers
    isServiceProvider: { type: Boolean, default: false },
    servicePincodes: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
export default User;
