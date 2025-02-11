"use client";

import { motion, useAnimation } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";

interface FeatureCard {
  title: string;
  description: string;
}

const features: FeatureCard[] = [
  {
    title: "AC Service",
    description: "Professional AC servicing and maintenance.",
  },
  {
    title: "Bathroom & Kitchen Cleaning",
    description: "Expert cleaning services for your bathroom and kitchen.",
  },
  {
    title: "Carpenter",
    description: "Skilled carpentry services for all your needs.",
  },
  {
    title: "Chimney Repair",
    description: "Reliable chimney repair and maintenance services.",
  },
  {
    title: "Electrician",
    description: "Certified electricians for all electrical work.",
  },
  {
    title: "Microwave Repair",
    description: "Quick and efficient microwave repair services.",
  },
  {
    title: "Plumbers",
    description: "Experienced plumbers for all plumbing issues.",
  },
  {
    title: "Refrigerator Repair",
    description: "Expert refrigerator repair and maintenance.",
  },
  {
    title: "Sofa & Carpet Cleaning",
    description: "Professional sofa and carpet cleaning services.",
  },
  {
    title: "Washing Machine Repair",
    description: "Reliable washing machine repair services.",
  },
  {
    title: "Water Purifier Repair",
    description: "Expert water purifier repair and maintenance.",
  },
];

export default function FeaturesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const scrollToIndex = (index: number) => {
    if (!carouselRef.current) return;

    const newIndex = Math.max(0, Math.min(index, features.length - 1));
    setCurrentIndex(newIndex);

    controls.start({
      x: `${-newIndex * 100}%`,
      transition: { duration: 0.5, ease: "easeInOut" },
    });
  };

  const next = () => scrollToIndex(currentIndex + 1);
  const prev = () => scrollToIndex(currentIndex - 1);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - carouselRef.current!.offsetLeft;
    scrollLeft.current = carouselRef.current!.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current!.offsetLeft;
    const walk = (x - startX.current) * 2; // scroll-fast
    carouselRef.current!.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    startX.current = e.touches[0].pageX - carouselRef.current!.offsetLeft;
    scrollLeft.current = carouselRef.current!.scrollLeft;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const x = e.touches[0].pageX - carouselRef.current!.offsetLeft;
    const walk = (x - startX.current) * 2; // scroll-fast
    carouselRef.current!.scrollLeft = scrollLeft.current - walk;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <div className="relative w-full py-12">
      <div
        className="overflow-x-auto scrollbar-hide"
        ref={carouselRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          className="flex gap-6 md:gap-8"
          animate={controls}
          initial={{ x: 0 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="w-full flex-none md:w-1/3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="bg-white bg-opacity-10 rounded-lg overflow-hidden h-full">
                <div className="h-48 bg-[url('https://via.placeholder.com/600x800.png?text=Image+2')] bg-cover bg-center opacity-10" />
                <div className="p-6">
                  <h3
                    className="text-xl font-semibold mb-2"
                    style={{ color: "#E8E4D3" }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 mb-4">{feature.description}</p>
                  <Button variant="secondary">Read More</Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="flex justify-center mt-8 gap-4">
        <Button
          variant="outline"
          className="rounded-full"
          onClick={prev}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="rounded-full"
          onClick={next}
          disabled={currentIndex >= features.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
