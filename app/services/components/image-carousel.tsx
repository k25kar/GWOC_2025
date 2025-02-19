"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Booking from "@/components/Booking";

// Define the type for service objects (updated to include description and price)
interface Service {
  id: string; // MongoDB _id as a string
  name: string; // The name of the service
  description: string; // A description of the service
  price: number; // The price of the service
  imageUrl: string; // URL of the service's image
  category: string; // The category the service belongs to
  bookingCount: number; // The number of bookings for this service
  dateAdded: Date; // Date when the service was added to the database
}

export default function ImageCarousel() {
  const [services, setServices] = useState<Service[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); 

  useEffect(() => {
    const fetchLatestServices = async () => {
      try {
        const response = await axios.get("/api/services/latest");
        setServices(response.data.services || []);  // Set the data only if the request is successful
      } catch (error:any) {
        if (error.response && error.response.status === 500) {
          // Log the 500 error to the console
          console.error("Error fetching latest services:", error);
        } else {
          // Optionally, log other types of errors
          console.error("Error fetching latest services:", error);
        }
        // No UI updates on error, preventing the error from being shown to the user
      }
    };
    
    fetchLatestServices();
  }, []);
  

  const handlePrevious = () => {
    setCurrentIndex((current) =>
      current === 0 ? services.length - 1 : current - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((current) =>
      current === services.length - 1 ? 0 : current + 1
    );
  };

  return (
    <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-zinc-900 w-50 max-w-xl mx-auto">
      <AnimatePresence mode="wait">
        {services.length > 0 && (
          <>
            <motion.img
              key={currentIndex}
              src={services[currentIndex]?.imageUrl || "/placeholder.svg"}
              alt={services[currentIndex]?.name || "Service Image"}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Service Name */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 text-black text-xl font-semibold">
              {services[currentIndex]?.name}
            </div>

            {/* Book Now Button */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 pointer-events-auto">
              <Booking service={services[currentIndex]}>
                <Button
                  variant="primary"
                  className="w-full bg-zinc-800 hover:bg-gray-600 text-white rounded-lg py-2"
                  onClick={() => console.log("Button Clicked!")}
                >
                  Book Now
                </Button>
              </Booking>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <Button
          variant="outline"
          className="rounded-full bg-black/50 hover:bg-black/70 z-10"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          className="rounded-full bg-black/50 hover:bg-black/70 z-10"
          onClick={handleNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      {/* Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {services.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
