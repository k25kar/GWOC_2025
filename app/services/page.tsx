"use client";

import { motion, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";
import ImageCarousel from "./components/image-carousel";
import FeaturesCarousel from "./components/category-carousel";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import TrueFocus from "@/components/reactbits/TrueFocus";
import BlurText from "@/components/reactbits/BlurText";
import { useSearchParams } from "next/navigation";
import BestsellerCarousel from "./components/Bestseller-Carousel";

const handleAnimationComplete = () => {
  console.log("Animation completed!");
};

export default function ServicesPage() {
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const bestSellersRef = useRef(null);
  const featuresRef = useRef<HTMLDivElement | null>(null);

  const featuresInView = useInView(featuresRef, { once: false });

  const heroInView = useInView(heroRef, { once: false });
  const servicesInView = useInView(servicesRef, { once: false });
  const bestSellersInView = useInView(bestSellersRef, { once: false });

  const searchParams = useSearchParams();
  const selectedCategory = searchParams?.get("category") ?? "";

  useEffect(() => {
    if (featuresRef.current && selectedCategory) {
      featuresRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedCategory]);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="h-screen flex flex-col items-center justify-center px-4 text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-7xl lg:text-8xl font-bold"
          style={{ color: "#E8E4D3" }}
        >
          <BlurText
            text="Our Services."
            delay={50}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
          />
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl md:text-2xl text-zinc-400 max-w-2xl mb-12"
        >
          <BlurText
            text="Reliable, Fast & Affordable – Just a Click Away"
            delay={50}
            animateBy="words"
            direction="bottom"
            onAnimationComplete={handleAnimationComplete}
          />
        </motion.h1>
        <motion.div
          initial={{ opacity: 0.6 }}
          whileHover={{ opacity: 1, scale: 1.1 }}
          transition={{ duration: 0.2 }}
          className="relative flex items-center justify-center w-14 h-14"
        >
          <ChevronDown className="h-6 w-6 absolute" />
          <Button
            variant="outline"
            className="rounded-full w-14 h-14 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
            onClick={() =>
              window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
            }
          >
            <ChevronDown className="h-6 w-6" />
          </Button>
        </motion.div>
      </section>

      {/* New and Bestsellers Section */}
      <section ref={servicesRef} className="min-h-screen py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-24">
            <div className="order-2 md:order-1">
              <ImageCarousel />
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={
                servicesInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
              }
              transition={{ duration: 0.6 }}
              className="order-1 md:order-2 flex flex-col justify-center"
            >
              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ color: "#E8E4D3" }}
              >
                New and Trustworthy
              </h2>
              <p className="text-zinc-400 mb-8">Find out the New.</p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              ref={bestSellersRef}
              initial={{ opacity: 0, x: -20 }}
              animate={
                bestSellersInView
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: -20 }
              }
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center"
            >
              <h2
                className="text-4xl md:text-5xl font-bold mb-4"
                style={{ color: "#E8E4D3" }}
              >
                Best Sellers
              </h2>
              <p className="text-zinc-400 mb-8">Experience the best.</p>
            </motion.div>
            <div>
              <BestsellerCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={
              featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.8 }}
            className="text-center mb-4"
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: "#E8E4D3" }}
            >
              <TrueFocus
                sentence="What we Offer"
                manualMode={false}
                blurAmount={2}
                borderColor="white"
                animationDuration={2}
                pauseBetweenAnimations={1}
              />
            </h2>
            <p className="text-zinc-400">
              Discover our comprehensive range of services
            </p>
          </motion.div>
          <FeaturesCarousel
            onCategorySelect={(category) => console.log(category)}
            selectedCategory={selectedCategory}
          />
        </div>
      </section>
    </main>
  );
}
