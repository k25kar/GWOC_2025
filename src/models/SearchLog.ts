import mongoose from "mongoose";

const SearchLogSchema = new mongoose.Schema(
  {
    query: { type: String, required: true, unique: true }, // Store unique queries
    count: { type: Number, default: 1 }, // Increment when the query is repeated
  },
  { timestamps: true }
);

export default mongoose.models.SearchLog || mongoose.model("SearchLog", SearchLogSchema);
