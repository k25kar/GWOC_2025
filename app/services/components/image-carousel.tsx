"use client"

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

// Define the type for service objects
interface Service {
  imageUrl: string;
  name: string;
}

export default function ImageCarousel() {
  const [services, setServices] = useState<Service[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchLatestServices = async () => {
      try {
        const response = await axios.get("/api/services/latest");
        setServices(response.data.services || []);
      } catch (error) {
        console.error("Error fetching latest services:", error);
      }
    };
    fetchLatestServices();
  }, []);

  const handlePrevious = () => {
    setCurrentIndex((current) => (current === 0 ? services.length - 1 : current - 1));
  };

  const handleNext = () => {
    setCurrentIndex((current) => (current === services.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-zinc-900 w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {services.length > 0 && (
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
        )}
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-between p-4">
        <Button
          variant="outline"
          className="rounded-full bg-black/50 hover:bg-black/70"
          onClick={handlePrevious}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          className="rounded-full bg-black/50 hover:bg-black/70"
          onClick={handleNext}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {services.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-white" : "bg-white/50"}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}
