"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  AirVent,
  Paintbrush,
  Sparkles,
  Wrench,
  Check,
  Star,
  MessageCircle,
  ArrowRight
} from "lucide-react";
import Preloader from "@/components/PreLoader";
import Footer from "@/components/Footer";
import TestimonialsSection from "@/components/TestimonialsSection";
import TextAnimate from "@/components/TextAnimate";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Service Icon component with gradient background
interface ServiceIconProps {
  icon: React.ElementType;
  gradientFrom: string;
  gradientTo: string;
}

const ServiceIcon: React.FC<ServiceIconProps> = ({ icon: Icon, gradientFrom, gradientTo }) => (
  <div className="relative flex items-center justify-center w-full h-full">
    <div className={`absolute inset-0 rounded-lg bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-20`}></div>
    <div className="absolute inset-0 rounded-lg border-2 border-white/20"></div>
    <Icon className="relative z-10 text-white w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" strokeWidth={1.5} />
  </div>
);

// Features Grid Component
function FeaturesGrid() {
  const features = [
    {
      icon: <Sparkles className="text-emerald-400" />,
      title: "Professional Cleaning",
      description: "Expert home and office cleaning services to keep your spaces fresh and hygienic."
    },
    {
      icon: <AirVent className="text-blue-400" />,
      title: "AC Maintenance",
      description: "Complete air conditioning cleaning and maintenance for optimal performance."
    },
    {
      icon: <Wrench className="text-amber-400" />,
      title: "Repair Services",
      description: "Quick and reliable repair services for home appliances and fixtures."
    },
    {
      icon: <Paintbrush className="text-purple-400" />,
      title: "Home Improvement",
      description: "Transform your living spaces with our professional improvement services."
    }
  ];

  useEffect(() => {
    gsap.fromTo(
      ".feature-item",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".features-grid",
          start: "top 80%"
        }
      }
    );
  }, []);

  return (
    <div className="bg-zinc-950 px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 text-center">
          Why Choose <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-rose-400">HelperBuddy</span>
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-item p-6 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 group space-y-4"
            >
              <div className="p-3 rounded-lg inline-flex bg-zinc-800/50 group-hover:bg-zinc-800 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg font-medium text-white">
                {feature.title}
              </h3>
              <p className="text-zinc-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// New "Why Choose HelperBuddy" Hero Section with Perspective Scroll
function PerspectiveHeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (sectionRef.current && contentRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: true,
        }
      });
      
      tl.fromTo(
        contentRef.current,
        {
          scale: 0.9,
          y: 100,
          opacity: 0.5,
          transformPerspective: 1000,
          rotationX: 5
        },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          rotationX: 0,
          ease: "power2.out"
        }
      );
      
      gsap.fromTo(
        ".highlight-item",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          scrollTrigger: {
            trigger: ".highlights-container",
            start: "top 70%"
          }
        }
      );
    }
    
    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);
  
  const highlights = [
    {
      icon: <Check className="text-emerald-400" />,
      text: "Verified professionals with background checks"
    },
    {
      icon: <Check className="text-emerald-400" />,
      text: "Consistent, high-quality service delivery"
    },
    {
      icon: <Check className="text-emerald-400" />,
      text: "Transparent pricing - no hidden charges"
    },
    {
      icon: <Check className="text-emerald-400" />,
      text: "24/7 customer support at your service"
    }
  ];

  return (
    <div ref={sectionRef} className="w-full bg-gradient-to-b from-black to-zinc-950 py-24 md:py-32 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl -z-10"></div>
      
      <div className="max-w-5xl mx-auto px-4">
        <div ref={contentRef} className="relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-12 text-white">
            Why Choose{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-rose-400">
              HelperBuddy
            </span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-zinc-300 text-lg leading-relaxed">
                HelperBuddy transforms how you experience home services with a commitment to quality, reliability and convenience that's unmatched in the industry.
              </p>
              
              <div className="highlights-container space-y-4">
                {highlights.map((item, index) => (
                  <div key={index} className="highlight-item flex items-start gap-3">
                    <div className="p-1 rounded-full bg-emerald-500/20 mt-0.5">
                      {item.icon}
                    </div>
                    <p className="text-zinc-300">{item.text}</p>
                  </div>
                ))}
              </div>

            </div>
            
            <div className="relative aspect-square md:aspect-auto md:h-96 rounded-2xl overflow-hidden border border-zinc-800 shadow-xl shadow-indigo-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-rose-500/20"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-rose-400">97%</div>
              </div>
              <div className="absolute bottom-8 w-full text-center">
                <p className="text-white font-medium text-xl">Customer Satisfaction</p>
                <p className="text-zinc-400 text-sm mt-1">Based on 1000+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProcessSteps() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        ".process-step",
        { 
          opacity: 0,
          y: 40,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.2,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%"
          }
        }
      );
    }
  }, []);
  
  const steps = [
    {
      number: "01",
      title: "Choose Your Service",
      description: "Browse our range of professional services and select what you need.",
      detail:
        "Review our diverse service offerings, which include everything from home cleaning to specialized repair services, and choose the one that best fits your requirements. Our platform provides detailed descriptions and customer reviews to guide your decision.",
    },
    {
      number: "02",
      title: "Book a Time Slot",
      description: "Select a convenient date and time that works for your schedule.",
      detail:
        "Our easy-to-use booking system allows you to view available time slots and pick the one that aligns perfectly with your calendar. Enjoy the convenience of flexible scheduling tailored specifically for you.",
    },
    {
      number: "03",
      title: "Expert Arrives",
      description: "Our verified professional arrives on time, ready to provide stellar service.",
      detail:
        "Once your appointment is confirmed, a highly trained and verified professional will arrive promptly at your location. Experience punctual, efficient service as our expert handles your needs with utmost care.",
    },
    {
      number: "04",
      title: "Enjoy the Results",
      description: "Sit back and enjoy your perfectly maintained home or office.",
      detail:
        "After the service is completed, take a moment to relax and admire the impeccable results. Our commitment to excellence ensures that your space is maintained to the highest standards, leaving you stress-free and completely satisfied.",
    },
  ];
  
  return (
    <div className="w-full bg-black py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-16 text-center">
          How HelperBuddy <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-rose-400">Works</span>
        </h2>
        
        <div ref={containerRef} className="relative">
          {/* Connecting line */}
          <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-indigo-500 to-rose-500 hidden md:block"></div>
          
          <div className="space-y-12 md:space-y-24">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="process-step flex flex-col md:flex-row items-start gap-6 md:gap-12"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center relative z-10">
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-rose-400">
                    {step.number}
                  </span>
                </div>
                
                <div className="flex-1 pt-2 md:pt-0">
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-zinc-400">{step.description}</p>
                  
                  {/* Process step detail as a paragraph */}
                  <div className="mt-6 p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl w-full md:w-4/5">
                    <p className="text-zinc-500 text-sm leading-relaxed">
                      {step.detail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


// Services Section Component with updated quirky text and improved alignment
function ServicesSection() {
  const router = useRouter();
  
  const services = [
    {
      id: "ac-service",
      title: "AC Cleaning",
      description: "Cool vibes only! We'll make your AC breathe like a yoga instructor."
    },
    {
      id: "home-cleaning",
      title: "Home Cleaning",
      description: "We don't just clean, we make your floors jealous of your countertops!"
    },
    {
      id: "repair-service",
      title: "Repair Services",
      description: "We fix stuff so well, it'll wonder why it ever broke up with you."
    },
    {
      id: "painting-service",
      title: "Painting Services",
      description: "Colors that pop and walls that won't stop showing off. Insta-worthy spaces guaranteed!"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-black to-zinc-950 px-4 py-16 md:py-24" id="services-section">
      <div className="mx-auto max-w-5xl text-center">
        <h2 className="text-2xl md:text-5xl font-bold text-white mb-16 service-text">
          Our Services
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-12">
          {services.map((service, index) => (
            <div
              key={index}
              id={service.id}
              className="service-container bg-zinc-900/30 rounded-xl overflow-hidden group transition-all duration-300 hover:bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700"
            >
              <div className="p-6 h-full flex flex-col">
                <div className="service-image-placeholder h-40 w-full bg-zinc-800/30 rounded-lg mb-4" data-service-target={service.id}></div>
                <h3 className="text-lg font-medium text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-zinc-400 text-sm flex-grow mb-4">
                  {service.description} 
                </p>
                <Button
                  variant="ghost"
                  className="mt-auto text-zinc-400 hover:text-white hover:bg-zinc-800 px-4 py-2 text-sm flex items-center gap-2"
                  onClick={() => router.push("/services")}
                >
                  <span>Check it out</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <Button
          variant="outline"
          className="min-w-[160px] bg-transparent text-white border-white/20 hover:bg-white/10 hover:border-white/30 transition-all"
          onClick={() => router.push("/services")}
        >
          View All Services
        </Button>
      </div>
    </div>
  );
}

// FAQ Section Component with restored original FAQs
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is HelperBuddy?",
      answer: "HelperBuddy is a premium service platform that connects you with professional cleaners, technicians, and home service experts. We provide home cleaning, office cleaning, AC maintenance, repairs, and more."
    },
    {
      question: "How do I book a service?",
      answer: "Booking is simple! Browse our services, select the one you need, choose your preferred date and time, and complete the booking. You can book through our website or mobile app."
    },
    {
      question: "What areas do you service?",
      answer: "We currently serve major metropolitan areas across India including Delhi NCR, Mumbai, Bangalore, Hyderabad, Chennai, and Kolkata. We're expanding to new cities regularly!"
    },
    {
      question: "Are your service providers verified?",
      answer: "Absolutely. All our service providers undergo thorough background checks, skill verification, and training before joining our platform. We prioritize your safety and service quality."
    },
    {
      question: "What if I'm not satisfied with the service?",
      answer: "Customer satisfaction is our priority. If you're not happy with any service, please report within 24 hours and we'll arrange a free service recovery visit to address your concerns."
    },
    {
      question: "Do you offer service warranties?",
      answer: "Yes, we provide service warranties ranging from 7 days to 90 days depending on the type of service. Details are provided before booking completion."
    },
    {
      question: "Can I reschedule or cancel my booking?",
      answer: "Yes. Reschedule requests made 24 hours before the appointment are free. Cancellations made 24 hours in advance receive a full refund. Late cancellations may incur a small fee."
    },
    {
      question: "Do you provide the cleaning supplies and equipment?",
      answer: "Yes! Our professionals bring all necessary equipment and high-quality cleaning supplies. If you have specific products you prefer, just let us know in advance."
    }
  ];

  useEffect(() => {
    gsap.fromTo(
      ".faq-item",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".faq-section",
          start: "top 80%"
        }
      }
    );
  }, []);

  return (
    <div className="bg-black px-4 py-16 md:py-24 faq-section">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="faq-item border border-zinc-800 rounded-lg overflow-hidden hover:border-zinc-700 transition-all duration-300"
            >
              <button
                className="w-full px-6 py-4 text-left text-white hover:bg-zinc-900/50 transition-colors flex justify-between items-center"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium">{faq.question}</span>
                <span className="transform transition-transform ml-2 text-zinc-400">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? "py-4 px-6 opacity-100 max-h-96"
                    : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <p className="text-zinc-400">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const acIconRef = useRef<HTMLDivElement>(null);
  const broomIconRef = useRef<HTMLDivElement>(null);
  const wrenchIconRef = useRef<HTMLDivElement>(null);
  const paintIconRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate preloader delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      ScrollTrigger.refresh();
    };
  
    handleResize();
    window.addEventListener("resize", handleResize);
  
    const setupIcons = () => {
      // Array of icons with references and target IDs
      const icons = [
        { ref: acIconRef.current, targetId: "ac-service" },
        { ref: broomIconRef.current, targetId: "home-cleaning" },
        { ref: wrenchIconRef.current, targetId: "repair-service" },
        { ref: paintIconRef.current, targetId: "painting-service" },
      ];
  
      // Set initial styles
      icons.forEach((icon) => {
        if (icon.ref) {
          gsap.set(icon.ref, {
            borderRadius: "9999px",
            scale: 1,
            opacity: 1,
          });
        }
      });
  
      // Create timeline with a tight scrub
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: servicesRef.current!,
          start: "top 60%",
          end: "top 20%",
          scrub: 0.1,
          markers: false,
        },
      });
  
      // Calculate center-to-center offset
      const calculateOffset = (iconEl: HTMLDivElement, targetEl: Element) => {
        const iconRect = iconEl.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
  
        const iconCenter = {
          x: iconRect.left + window.pageXOffset + iconRect.width / 2,
          y: iconRect.top + window.pageYOffset + iconRect.height / 2,
        };
        const targetCenter = {
          x: targetRect.left + window.pageXOffset + targetRect.width / 2,
          y: targetRect.top + window.pageYOffset + targetRect.height / 2,
        };
  
        return {
          x: targetCenter.x - iconCenter.x,
          y: targetCenter.y - iconCenter.y,
        };
      };
  
      // Animate each icon
      icons.forEach(({ ref, targetId }) => {
        if (!ref) return;
  
        const target = document.querySelector(
          `#${targetId} .service-image-placeholder`
        );
        if (!target) return;
  
        // Just move the icon to center, no resizing:
        tl.to(
          ref,
          {
            x: () => calculateOffset(ref, target).x,
            y: () => calculateOffset(ref, target).y,
            borderRadius: "0.75rem",
            ease: "none",
            duration: 0.5,
          },
          0
        );
  
        // Optionally scale the SVG icon
        const svg = ref.querySelector("svg");
        if (svg) {
          tl.to(
            svg,
            {
              scale: 1.5, // adjust or remove if you don't want scaling
              ease: "none",
              duration: 0.5,
            },
            0
          );
        }
      });
  
      // Ensure timeline completes if scrolling quickly
      if (servicesRef.current) {
        ScrollTrigger.create({
          trigger: servicesRef.current!,
          start: "top bottom",
          once: true,
          onEnter: () => {
            if (!ScrollTrigger.isInViewport(servicesRef.current!)) {
              tl.progress(1);
            }
          },
        });
      }
    };
  
    if (
      acIconRef.current &&
      broomIconRef.current &&
      wrenchIconRef.current &&
      paintIconRef.current &&
      servicesRef.current
    ) {
      setupIcons();
    }
  
    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isMobile]);
  

  useEffect(() => {
    if (!isLoading) {
      // Add an extra 500ms buffer after preloader is done
      const bufferTimeout = setTimeout(() => {
        // Always scroll to top on mount
        window.scrollTo(0, 0);
        
        // Determine navigation type
        const navigationEntry = window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
        const navType = navigationEntry?.type;
        
        if (navType === "reload") {
          gsap.fromTo(
            [".hero-title", ".hero-subtitle", ".hero-buttons"],
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              stagger: 0.2,
              ease: "power2.out",
            }
          );
        }
      }, 500); // 500ms buffer delay
  
      return () => clearTimeout(bufferTimeout);
    }
  }, [isLoading]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      ScrollTrigger.refresh();
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    if (
      acIconRef.current &&
      broomIconRef.current &&
      wrenchIconRef.current &&
      paintIconRef.current &&
      servicesRef.current
    ) {
      // Service containers
      const acService = document.querySelector("#ac-service");
      const homeCleaningService = document.querySelector("#home-cleaning");
      const repairService = document.querySelector("#repair-service");
      const paintingService = document.querySelector("#painting-service");

      if (!acService || !homeCleaningService || !repairService || !paintingService) return;

      // Set initial styles for icons (start as circular)
      gsap.set(acIconRef.current, { borderRadius: "50%" });
      gsap.set(broomIconRef.current, { borderRadius: "50%" });
      gsap.set(wrenchIconRef.current, { borderRadius: "50%" });
      gsap.set(paintIconRef.current, { borderRadius: "50%" });

      // Create a timeline to animate the icons when scrolling to the services section
      const iconTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: servicesRef.current,
          start: "top 80%",
          end: "top 50%",
          scrub: true,
        },
      });

      // Animate icons: transition from circular to a more square shape with rounded corners
      iconTimeline.to(
        [acIconRef.current, broomIconRef.current, wrenchIconRef.current, paintIconRef.current],
        {
          borderRadius: "0.5rem",
          duration: 1,
          ease: "power2.out",
        }
      );
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isMobile]);

  return (
    <>
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      <div className="relative flex min-h-screen flex-col">
        <main className="flex-1">
          <section className="flex min-h-screen flex-col items-center justify-center space-y-10 py-24">
            <div className="flex justify-center gap-8 mt-12">
              <div 
                ref={acIconRef} 
                className="service-icon w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 border border-indigo-500/40 transition-all duration-300"
              >
                <AirVent className="text-indigo-400 w-8 h-8 md:w-12 md:h-12" strokeWidth={1.5} />
              </div>
              <div 
                ref={broomIconRef} 
                className="service-icon w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/10 border border-blue-500/40 transition-all duration-300"
              >
                <Sparkles className="text-blue-400 w-8 h-8 md:w-12 md:h-12" strokeWidth={1.5} />
              </div>
              <div 
                ref={wrenchIconRef} 
                className="service-icon w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-amber-500/20 to-amber-500/10 border border-amber-500/40 transition-all duration-300"
              >
                <Wrench className="text-amber-400 w-8 h-8 md:w-12 md:h-12" strokeWidth={1.5} />
              </div>
              <div 
                ref={paintIconRef} 
                className="service-icon w-16 h-16 md:w-24 md:h-24 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/10 border border-purple-500/40 transition-all duration-300"
              >
                <Paintbrush className="text-purple-400 w-8 h-8 md:w-12 md:h-12" strokeWidth={1.5} />
              </div>
            </div>      
            <div className="container flex flex-col items-center justify-center gap-6 text-center">
              <TextAnimate
                text="Professional Cleaning Made Simple"
                className="hero-title text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl lg:leading-[1.1] text-black"
                shouldAnimate={!isLoading}
              />
              <TextAnimate
                text="Book expert cleaning services for your home and office in just a few clicks. Quality service, guaranteed satisfaction."
                className="hero-subtitle max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl"
                shouldAnimate={!isLoading}
              />
              <div className="hero-buttons flex gap-4">
                <button
                  onClick={() => router.push("/services")}
                  className="px-8 py-3 border border-black text-black bg-white rounded-lg font-semibold transition-colors duration-300 hover:bg-black hover:text-white"
                >
                  Book Now
                </button>
                <button
                  onClick={() => router.push("/api/auth/login")}
                  className="px-8 py-3 border border-black bg-black text-white rounded-lg font-semibold transition-colors duration-300 hover:bg-white hover:text-black"
                >
                  Get Started
                </button>
              </div>

            </div>
          </section>

          <div ref={servicesRef}>
            <ServicesSection />
          </div>

          {/* <FeaturesGrid /> */}

          <PerspectiveHeroSection />

          <ProcessSteps />

          <TestimonialsSection />

          <FAQSection />
        </main>
      </div>
    </>
  );
}
