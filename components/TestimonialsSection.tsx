"use client"; // Remove if you're not using Next.js 13 App Router

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { Star } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Testimonial {
  _id: string;
  name: string;
  rating: number;
  review: string;
  profilePic: string;
}

const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Fetch testimonials dynamically
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await axios.get<Testimonial[]>("/api/testimonials");
        setTestimonials(data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };
    fetchTestimonials();
  }, []);

  // GSAP marquee animation based on Magic UI marquee component style
  useEffect(() => {
    if (testimonials.length > 0) {
      const marqueeInner = document.querySelector(".marquee__inner");
      gsap.to(marqueeInner, {
        x: "-50%",
        ease: "linear",
        duration: 30,
        repeat: -1,
      });
    }
  }, [testimonials]);

  const renderStars = (rating: number) => {
    return Array.from({ length: rating }, (_, i) => (
      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
    ));
  };

  return (
    <div className="bg-black px-4 py-8 md:py-12 testimonials-section relative">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 md:mb-12 text-center">
          What Our Customers Say
        </h2>

        {testimonials.length === 0 ? (
          <p className="text-white">Loading testimonials...</p>
        ) : (
          <div className="overflow-hidden relative">
            <div className="marquee__inner flex items-center whitespace-nowrap">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial._id}
                  className="testimonial-card inline-block w-72 md:w-80 p-6 mx-4 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <h4 className="text-white font-medium">{testimonial.name}</h4>
                    </div>
                  </div>
                  <div className="flex mb-3">{renderStars(testimonial.rating)}</div>
                  <p className="text-zinc-300 text-sm">"{testimonial.review}"</p>
                </div>
              ))}
              {/* Duplicate the testimonials for continuous marquee effect */}
              {testimonials.map((testimonial) => (
                <div
                  key={`${testimonial._id}-dup`}
                  className="testimonial-card inline-block w-72 md:w-80 p-6 mx-4 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <h4 className="text-white font-medium">{testimonial.name}</h4>
                    </div>
                  </div>
                  <div className="flex mb-3">{renderStars(testimonial.rating)}</div>
                  <p className="text-zinc-300 text-sm">"{testimonial.review}"</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsSection;