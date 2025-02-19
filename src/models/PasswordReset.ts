import mongoose, { Document, Model, Types } from "mongoose";

export interface IPasswordReset extends Document {
  userId: Types.ObjectId;
  token: string;
  expiration: Date;
}

const passwordResetSchema = new mongoose.Schema<IPasswordReset>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true },
    expiration: { type: Date, required: true },
  },
  { timestamps: true }
);

const PasswordReset: Model<IPasswordReset> =
  mongoose.models.PasswordReset ||
  mongoose.model<IPasswordReset>("PasswordReset", passwordResetSchema);

export default PasswordReset;
