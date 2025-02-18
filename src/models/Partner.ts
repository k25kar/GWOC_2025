import mongoose from "mongoose";

const pincodeSchema = new mongoose.Schema({
  code: { type: String, required: true },
  activeStatus: { type: Boolean, default: true },
});

const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  about: { type: String, required: true, default: "Not provided" },
  skills: { type: [String], required: true, default: [] },
  servicePincodes: { type: [pincodeSchema], required: true, default: [] },
  active: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  joinedAt: { type: Date, default: Date.now },
  stats: {
    pendingJobs: { type: Number, default: 0 },
    completedJobs: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    responseTime: { type: Number, default: 0 },
    revenueGenerated: { type: Number, default: 0 },
  },
});

const Partner =
  mongoose.models.Partner || mongoose.model("Partner", partnerSchema);
export default Partner;
