// models/Testimonial.ts
import mongoose, { Document, Schema } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  rating: number;
  review: string;
  profilePic: string;
}

const TestimonialSchema: Schema = new Schema<ITestimonial>(
  {
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1, // minimum 1 star
      max: 5, // maximum 5 stars
    },
    review: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String, // URL to the profile picture
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Testimonial ||
  mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);
