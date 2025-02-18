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
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [itemsPerSlide, setItemsPerSlide] = useState<number>(4);

  // Decide itemsPerSlide based on screen size (4 on desktop, 2 on mobile)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerSlide(2);
      } else {
        setItemsPerSlide(4);
      }
    };
    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch testimonials
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

  // Group testimonials into slides, each slide has up to `itemsPerSlide` items
  const slides: Testimonial[][] = [];
  for (let i = 0; i < testimonials.length; i += itemsPerSlide) {
    slides.push(testimonials.slice(i, i + itemsPerSlide));
  }
  const maxSlide = slides.length - 1;

  // Navigation
  const handlePrev = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : 0));
  };
  const handleNext = () => {
    setCurrentSlide((prev) => (prev < maxSlide ? prev + 1 : maxSlide));
  };

  // GSAP animation on scroll
  useEffect(() => {
    gsap.fromTo(
      ".testimonial-card",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".testimonials-section",
          start: "top 85%",
          end: "bottom 60%",
          scrub: true,
        },
      }
    );
  }, [testimonials]);

  return (
    <div className="bg-black px-4 py-8 md:py-12 testimonials-section relative">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 md:mb-12 text-center">
          What Our Customers Say
        </h2>

        {testimonials.length === 0 ? (
          <p className="text-white">Loading testimonials...</p>
        ) : (
          <div className="relative">
            {/* Slider container with overflow hidden */}
            <div className="overflow-hidden">
              {/* Slides container: each slide is 100% width of the container */}
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {slides.map((slide, slideIndex) => {
                  // Number of placeholders we need to keep the grid consistent
                  const placeholdersCount = itemsPerSlide - slide.length;

                  return (
                    <div key={slideIndex} className="min-w-full">
                      {/* Always 2 columns on mobile, 4 on desktop, with gap */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                        {slide.map((testimonial) => (
                          <div
                            key={testimonial._id}
                            className="testimonial-card bg-zinc-900 p-4 md:p-6 rounded-lg"
                          >
                            <div className="flex items-center mb-3 md:mb-4">
                              <Image
                                src={testimonial.profilePic}
                                alt={testimonial.name}
                                width={40}
                                height={40}
                                className="rounded-full w-10 h-10 md:w-12 md:h-12"
                              />
                              <div className="ml-3">
                                <h3 className="text-white font-semibold text-sm md:text-base">
                                  {testimonial.name}
                                </h3>
                              </div>
                            </div>
                            <div className="flex mb-2">
                              {Array.from({ length: testimonial.rating }, (_, i) => (
                                <Star
                                  key={i}
                                  className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-yellow-400"
                                />
                              ))}
                            </div>
                            <p className="text-zinc-300 text-xs md:text-sm">
                              {testimonial.review}
                            </p>
                          </div>
                        ))}

                        {/* Render empty placeholders if we have fewer than itemsPerSlide */}
                        {Array.from({ length: placeholdersCount }).map((_, idx) => (
                          <div key={`placeholder-${idx}`} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Arrow Navigation */}
            <div className="absolute inset-0 flex items-center justify-between pointer-events-none">
              <button
                onClick={handlePrev}
                className="pointer-events-auto text-white bg-transparent rounded-full p-2 m-2 hover:bg-gray-700 transition-colors"
              >
                <svg
                  viewBox="0 0 8 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="M7 13L1 7l6-6" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="pointer-events-auto text-white bg-transparent rounded-full p-2 m-2 hover:bg-gray-700 transition-colors"
              >
                <svg
                  viewBox="0 0 8 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6"
                >
                  <path d="M1 13l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialsSection;
