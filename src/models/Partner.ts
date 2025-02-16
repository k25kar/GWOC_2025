// /src/models/Partner.ts
import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  // Added password field for SP login credentials (even if they aren’t logged in immediately)
  password: { type: String, required: true },
  // Retaining existing fields with defaults where needed
  about: { type: String, required: true, default: "Not provided" },
  skills: { type: [String], required: true, default: [] },
  // New field for serviceable pincodes
  servicePincodes: { type: [String], required: true },
  active: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  joinedAt: { type: Date, default: Date.now },
  stats: {
    completedJobs: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    responseTime: { type: Number, default: 0 },
    revenueGenerated: { type: Number, default: 0 },
  },
});

const Partner =
  mongoose.models.Partner || mongoose.model("Partner", partnerSchema);
export default Partner;
