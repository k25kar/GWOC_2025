'use client';

import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Lenis from '@studio-freight/lenis';

interface ServiceCard {
  title: string;
  subtitle: string;
  features: string[];
  icon: string;
  color: string;
}

const serviceCards: ServiceCard[] = [
  {
    title: "Reliable, Fast & Affordable Services",
    subtitle: "Your go-to solution for all home and office maintenance needs",
    features: [
      "Trained Professionals – Verified experts for every service",
      "Quick & Hassle-Free – Book in minutes, service at your convenience",
      "Affordable & Transparent – No hidden charges, just quality service"
    ],
    icon: "🏠",
    color: "#1a1a2e"
  },
  {
    title: "Home & Office Cleaning",
    subtitle: "Deep Cleaning for a Fresh & Healthy Space",
    features: [
      "Home Cleaning – From living rooms to bathrooms, we make your home shine",
      "Office Cleaning – Maintain a spotless and productive workspace",
      "Eco-Friendly Products – Safe for your family and pets"
    ],
    icon: "🧹",
    color: "#16213e"
  },
  {
    title: "Appliance Repair & Maintenance",
    subtitle: "Quick, Reliable Fixes for Your Appliances",
    features: [
      "AC, Fridge, Washing Machine, Microwave & More",
      "Regular Maintenance Plans Available",
      "Certified Technicians with Genuine Spare Parts"
    ],
    icon: "⚙️",
    color: "#1b2430"
  },
  {
    title: "Plumbing & Electrical",
    subtitle: "Expert Solutions for Your Home & Office Needs",
    features: [
      "Leak Fixing, Pipe Installations & Drainage Solutions",
      "Wiring, Circuit Fixes, & Emergency Electrical Repairs",
      "Available 24/7 for Urgent Repairs"
    ],
    icon: "🔧",
    color: "#0f172a"
  }
];

// Adjusted card dimensions and spacing
const CARD_HEIGHT = 600; // Decreased from 700
const VISIBLE_CARD_HEIGHT = 100; // Decreased from 120
const TOTAL_CARDS = serviceCards.length;
const SCROLL_THRESHOLD = 0.001;

const CardComponent: React.FC<{
  i: number;
  data: ServiceCard;
  progress: any;
}> = ({ i, data, progress }) => {
  // Adjusted segment size for closer spacing
  const segmentSize = (1 - SCROLL_THRESHOLD) / (TOTAL_CARDS * 1.2);
  
  const startPoint = SCROLL_THRESHOLD + (i * segmentSize * 1.2);
  const endPoint = startPoint + segmentSize;

  const animatedTop = useTransform(
    progress,
    [0, startPoint, endPoint, 1],
    [
      i * CARD_HEIGHT,
      i * CARD_HEIGHT,
      i * VISIBLE_CARD_HEIGHT,
      i * VISIBLE_CARD_HEIGHT
    ]
  );
  
  // New: subtract a fixed offset to decrease height from top
  const TOP_OFFSET = 100; // adjust as needed
  const adjustedTop = useTransform(animatedTop, (v) => v - TOP_OFFSET);

  const scale = useTransform(
    progress,
    [0, startPoint, endPoint, 1],
    [
      1,
      1,
      1 - (0.03 * (TOTAL_CARDS - 1 - i)),
      1 - (0.03 * (TOTAL_CARDS - 1 - i))
    ]
  );

  return (
    <div className={`absolute inset-0 flex items-center justify-center ${
      ["z-10", "z-20", "z-30", "z-40"][i]
    }`}>
      <motion.div
        style={{
          backgroundColor: data.color,
          scale,
          top: adjustedTop, // use new adjusted top value
        }}
        className="relative w-[95vw] max-w-6xl h-[350px] rounded-2xl p-6 md:p-8"
      >
        <div className="text-4xl mb-4">{data.icon}</div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
          {data.title}
        </h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <p className="text-zinc-300 text-base mb-4">{data.subtitle}</p>
            <ul className="space-y-3">
              {data.features.map((feature, idx) => (
                <li 
                  key={idx}
                  className="text-zinc-400 flex items-start gap-2 text-sm md:text-base"
                >
                  <span className="text-indigo-400 mt-1">✔️</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-1/2 relative rounded-xl overflow-hidden bg-black/50">
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/40" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const StackedCardsSection: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      smoothWheel: true,
      wheelMultiplier: 0.8
    });
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    // Reduced vertical padding and height for less top/bottom whitespace
    <main 
      ref={container} 
      className="relative bg-black py-2 h-[1000px]"
    >
      {serviceCards.map((card, i) => (
        <CardComponent
          key={i}
          i={i}
          data={card}
          progress={scrollYProgress}
        />
      ))}
    </main>
  );
};

export default StackedCardsSection;