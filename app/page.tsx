'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import InfiniteCarousel from '@/components/InfiniteCarousel';
import Image from "next/image";
import userIcon from "@/public/user-icon.png"; // Import the user icon image
import landingPhoto1 from "@/public/landing-photo1.jpg"; // Import the existing image
import Footer from "../components/Footer"; // Corrected import path

function FeaturesGrid() {
  const features = [
    {
      icon: userIcon,
      title: "All pages, fully responsive",
      description: "All of the pages and sections work on any device. From mobile to desktop.",
    },
    {
      icon: userIcon,
      title: "Blog & customer stories",
      description: "Beautiful blog and customer stories, all connected to a CMS.",
    },
    {
      icon: userIcon,
      title: "Fancy animations",
      description: "Animated pages and fancy scroll effects for your sections.",
    },
    {
      icon: userIcon,
      title: "Be found",
      description: "We thought about the fundamentals to make sure you're SEO proof.",
    },
    {
      icon: userIcon,
      title: "Customized in no-time",
      description: "Sections are easy to copy and paste and combine to make your own pages.",
    },
    {
      icon: userIcon,
      title: "Look different",
      description: "From a 'shiny button' to an animated hero and cool gradient options.",
    },
    {
      icon: userIcon,
      title: "Secure Payments",
      description: "Your payments are secure with our advanced encryption technology.",
    },
    {
      icon: userIcon,
      title: "24/7 Support",
      description: "We offer round-the-clock support to assist you with any issues.",
    },
    {
      icon: userIcon,
      title: "User-Friendly Interface",
      description: "Our platform is designed to be intuitive and easy to use.",
    },
  ]

  return (
    <div className="bg-black px-4 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-3 md:gap-x-12 md:gap-y-16 lg:gap-x-16 lg:gap-y-20">
          {features.map((feature, index) => (
            <div key={index} className="space-y-4">
              <div className="inline-block rounded-lg">
                <Image src={feature.icon} alt="Feature Icon" width={24} height={24} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-white md:text-3xl">{feature.title}</h3>
              <p className="text-gray-400 text-lg">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ServicesSection() {
  const services = [
    {
      image: landingPhoto1,
      title: "Service 1",
      description: "Description for Service 1",
    },
    {
      image: landingPhoto1,
      title: "Service 2",
      description: "Description for Service 2",
    },
    {
      image: landingPhoto1,
      title: "Service 3",
      description: "Description for Service 3",
    },
    {
      image: landingPhoto1,
      title: "Service 4",
      description: "Description for Service 4",
    },
  ]

  return (
    <div className="bg-black px-4 py-16 md:py-24" id="services-section">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-3xl font-bold text-white mb-8">Some Services</h2>
        <div className="flex justify-center gap-4" id="services-container">
          {services.map((service, index) => (
            <div key={index} className="w-1/4 p-2 service-item" id={`service-${index + 1}`}>
              <div className="relative">
                <Image src={service.image} alt={service.title} className="w-full h-48 object-cover rounded-lg" />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="text-white text-sm">{service.description}</p>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mt-2">{service.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  const topLeftRef = useRef<HTMLImageElement>(null);
  const bottomLeftRef = useRef<HTMLImageElement>(null);
  const topRightRef = useRef<HTMLImageElement>(null);
  const bottomRightRef = useRef<HTMLImageElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const [servicePositions, setServicePositions] = useState<Array<DOMRect | null>>([null, null, null, null]);

  useEffect(() => {
    const updateServicePositions = () => {
      const positions = Array.from({ length: 4 }, (_, i) => {
        const element = document.getElementById(`service-${i + 1}`);
        return element?.getBoundingClientRect() || null;
      });
      setServicePositions(positions);
    };

    updateServicePositions();
    window.addEventListener('resize', updateServicePositions);
    return () => window.removeEventListener('resize', updateServicePositions);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const servicesTop = servicesRef.current?.offsetTop || 0;
      const progress = Math.min(Math.max(scrollY / (servicesTop - windowHeight), 0), 1);

      const cornerRefs = [topLeftRef, bottomLeftRef, topRightRef, bottomRightRef];
      const originalPositions = [
        { x: -200, y: -150 },
        { x: -200, y: 150 },
        { x: 200, y: -150 },
        { x: 200, y: 150 }
      ];

      cornerRefs.forEach((ref, index) => {
        if (ref.current && servicePositions[index]) {
          const startX = originalPositions[index].x;
          const startY = originalPositions[index].y;
          const targetX = servicePositions[index]!.left - (ref.current.offsetLeft + startX);
          const targetY = servicePositions[index]!.top - (ref.current.offsetTop + startY);

          const x = startX + (targetX * progress);
          const y = startY + (targetY * progress);

          ref.current.style.transform = `translate(${x}px, ${y}px)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [servicePositions]);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden"> {/* Remove pt-48 */}
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-zinc-900" />

      {/* Whitespace */}
      <div className="h-40 w-full bg-black"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="relative">
          <Image 
            ref={topLeftRef} 
            src={landingPhoto1} 
            alt="Top Left Image" 
            className="absolute top-[-150px] left-[-200px] w-48 h-48 object-cover rounded-lg border-2 border-white/20 transition-all duration-300 ease-in-out" 
          />
          <Image 
            ref={bottomLeftRef} 
            src={landingPhoto1} 
            alt="Bottom Left Image" 
            className="absolute bottom-[-150px] left-[-200px] w-48 h-48 object-cover rounded-lg border-2 border-white/20 transition-all duration-300 ease-in-out" 
          />
          <Image 
            ref={topRightRef} 
            src={landingPhoto1} 
            alt="Top Right Image" 
            className="absolute top-[-150px] right-[-200px] w-48 h-48 object-cover rounded-lg border-2 border-white/20 transition-all duration-300 ease-in-out" 
          />
          <Image 
            ref={bottomRightRef} 
            src={landingPhoto1} 
            alt="Bottom Right Image" 
            className="absolute bottom-[-150px] right-[-200px] w-48 h-48 object-cover rounded-lg border-2 border-white/20 transition-all duration-300 ease-in-out" 
          />
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
            <span className="inline-block relative">
              Seamless Home & Office{" "}
              <span className="relative">
                <span className="absolute -inset-1 blur-xl bg-gradient-to-r from-white/30 to-white/10 opacity-50" />
                <span className="relative">Services</span>
              </span>{" "}
              at Your Fingertips
            </span>
          </h1>
        </div>

        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
          Book expert cleaning, installation, and repair services in just a few clicks. Quality service, hassle-free experience, and secure payments—anytime, anywhere.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="outline"
            className="min-w-[160px] bg-transparent text-white border-white/20 hover:bg-white/10 hover:border-white/30 transition-all"
          >
            Get Started
          </Button>
          <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-transparent">
            Explore Services
          </Button>
        </div>
      </div>

      {/* Ambient light effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30">
        <div className="absolute inset-0 bg-gradient-radial from-zinc-500/20 to-transparent blur-2xl" />
      </div>

      {/* Services Section */}
      <div ref={servicesRef} className="relative z-10 w-full mt-12">
        <ServicesSection />
      </div>

      {/* Features Grid */}
      <div className="relative z-10 w-full mt-12">
        <FeaturesGrid />
      </div>

      {/* Infinite Carousel */}
      <div className="relative z-10 w-full mt-12">
        <InfiniteCarousel />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
