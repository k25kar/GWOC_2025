import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'user' | 'provider' | 'admin';
  pincode: string;
  area: string;
  serviceType?: string;
  servicePincodes?: string[];
  isApproved?: boolean;
  otp?: string;
  otpExpiry?: Date;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'provider', 'admin'], default: 'user' },
  pincode: { type: String },
  area: { type: String },
  serviceType: { type: String },
  servicePincodes: { type: [String] },
  isApproved: { type: Boolean, default: false },
  otp: { type: String },
  otpExpiry: { type: Date }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);