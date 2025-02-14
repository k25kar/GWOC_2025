'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import InfiniteCarousel from '@/components/InfiniteCarousel';
import Image from "next/image";
import userIcon from "@/public/user-icon.png";
import landingPhoto1 from "@/public/landing-photo1.jpg";
import Footer from "../components/Footer";
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function FeaturesGrid() {
    const features = [
      {
        icon: userIcon,
        title: "Professional Cleaning Services",
        description: "Expert home, office, and AC cleaning services to keep your spaces fresh and hygienic.",
      },
      {
        icon: userIcon,
        title: "Fully Responsive Booking",
        description: "Easily book and manage your cleaning appointments on any device, from mobile to desktop.",
      },
      {
        icon: userIcon,
        title: "Trained & Verified Cleaners",
        description: "Our cleaning professionals are background-checked and trained to provide top-quality service.",
      },
      {
        icon: userIcon,
        title: "Safe & Secure Payments",
        description: "We ensure secure transactions with encrypted payment gateways for a hassle-free experience.",
      },
      {
        icon: userIcon,
        title: "24/7 Customer Support",
        description: "Our support team is available round the clock to assist with your bookings and queries.",
      },
      {
        icon: userIcon,
        title: "Eco-Friendly Cleaning Solutions",
        description: "We use environmentally friendly cleaning products that are safe for your family and pets.",
      },
    ];

  useEffect(() => {
    gsap.fromTo(
      ".feature-text",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".feature-text",
          start: "top 80%",
          end: "bottom 20%",
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <div className="bg-black px-4 py-8 md:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 md:gap-y-12">
          {features.map((feature, index) => (
            <div key={index} className="space-y-3 md:space-y-4 feature-text">
              <div className="inline-block rounded-lg">
                <Image 
                  src={feature.icon} 
                  alt="Feature Icon" 
                  width={20} 
                  height={20} 
                  className="text-gray-400 w-5 h-5 md:w-6 md:h-6" 
                />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-white">{feature.title}</h3>
              <p className="text-base md:text-lg text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
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

  useEffect(() => {
    gsap.fromTo(
      ".service-text",
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        scrollTrigger: {
          trigger: ".service-text",
          start: "top 70%",
          end: "bottom 20%",
          scrub: true,
        },
      }
    );
  }, []);

  const router = useRouter();

  return (
    <div className="bg-black px-4 py-8 md:py-12" id="services-section">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 service-text">Some Services</h2>
        <div className="relative flex flex-col md:flex-row justify-center gap-4 mb-6 md:mb-8" id="services-container">
          {/* Clickable overlay boxes */}
          <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-4 gap-4 z-20">
            {[...Array(4)].map((_, index) => (
              <button
                key={`overlay-${index}`}
                onClick={() => router.push('/services')}
                className="w-full h-full bg-transparent hover:bg-white/5 transition-colors rounded-lg cursor-pointer"
                aria-label={`Service ${index + 1}`}
              />
            ))}
          </div>
         {services.map((service, index) => (
            <div 
              key={index} 
              className="w-full md:w-1/4 p-2 service-item service-text relative" 
              id={`service-${index + 1}`}
            >
              <div className="relative">
                <Image 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-48 md:h-40 lg:h-48 object-cover rounded-lg opacity-0"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                  <p className="text-white text-sm md:text-base">{service.description}</p>
                </div>
              </div>
              <h3 className="text-base md:text-lg font-semibold text-white mt-6">{service.title}</h3> {/* Increased margin-top */}
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className="min-w-[140px] md:min-w-[160px] bg-transparent text-white border-white/20 hover:bg-white/10 hover:border-white/30 transition-all text-sm md:text-base"
          onClick={() => router.push('/services')}
        >
          View All
        </Button>
      </div>
    </div>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Damien Jo",
      role: "CEO",
      rating: 5,
      text: "Brings a passion for time management and a vision for seamless scheduling to the forefront of our innovative calendar app.",
      image: userIcon
    },
    {
      name: "Noel Slap",
      role: "Lead Engineer",
      rating: 5,
      text: "Noel combines deep technical expertise with a passion for intuitive design. His dedication ensures our app remains cutting-edge and user-friendly",
      image: userIcon
    },
    {
      name: "Ethan Parker",
      role: "Designer",
      rating: 5,
      text: "Ehtan, our Designer, blends aesthetics with functionality, crafting an interface that's both visually stunning and effortlessly navigable.",
      image: userIcon
    },
    {
      name: "Clara Rodriguez",
      role: "Engineer",
      rating: 5,
      text: "Clara is our frontend wizard, focuses on delivering a smooth and intuitive user experience.",
      image: userIcon
    }
  ];

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
          end: "bottom 20%",
          scrub: true,
        },
      }
    );
  }, []);

  return (
    <div className="bg-black px-4 py-8 md:py-12 testimonials-section">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 md:mb-12 text-center">What Our Customers Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card bg-zinc-900 p-4 md:p-6 rounded-lg">
              <div className="flex items-center mb-3 md:mb-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={40}
                  height={40}
                  className="rounded-full w-10 h-10 md:w-12 md:h-12"
                />
                <div className="ml-3">
                  <h3 className="text-white font-semibold text-sm md:text-base">{testimonial.name}</h3>
                  <p className="text-zinc-400 text-xs md:text-sm">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-2">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-zinc-300 text-xs md:text-sm">{testimonial.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is HelperBuddy?",
      answer: "HelperBuddy is a cleaning service that helps keep your home and office clean. We also clean air conditioning units. Our goal is to make your spaces fresh and healthy."
    },
    {
      question: "What cleaning services do you offer?",
      answer: "We offer a variety of cleaning services, including home cleaning, office cleaning, and AC cleaning. Whether you need a deep clean or regular maintenance, we've got you covered."
    },
    {
      question: "How do I book a cleaning service?",
      answer: "Booking is easy! Just give us a call or fill out our online form. We'll set up a time that works best for you."
    },
    {
      question: "How much does your service cost?",
      answer: "The cost depends on the size of your home or office and the type of cleaning you need. We have options for every budget. For exact prices, check our pricing page/contact us."
    },
    {
      question: "Is HelperBuddy the best cleaning service in India?",
      answer: "Many of our customers think so! We pride ourselves on quality service and customer satisfaction. Check our reviews to see what others are saying."
    },
    {
      question: "How can I find good cleaning services near me?",
      answer: "If you're looking for reliable cleaning services nearby, Helper Buddy is the answer. We connect you with experienced cleaners who can handle everything from regular home cleaning to deep cleaning. Simply book through our platform, and we'll send a trusted professional to your home."
    }
  ];

  return (
    <div className="bg-black px-4 py-8 md:py-12">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-3 md:space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-zinc-800 rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-4 md:px-6 py-3 md:py-4 text-left text-white hover:bg-zinc-900 transition-colors flex justify-between items-center text-sm md:text-base"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span>{faq.question}</span>
                <span className="transform transition-transform ml-2">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              <div
                className={`px-4 md:px-6 transition-all duration-200 ease-in-out ${
                  openIndex === index ? 'py-3 md:py-4 opacity-100' : 'h-0 opacity-0 overflow-hidden'
                }`}
              >
                <p className="text-zinc-400 text-sm md:text-base">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const topLeftRef = useRef<HTMLImageElement>(null);
  const bottomLeftRef = useRef<HTMLImageElement>(null);
  const topRightRef = useRef<HTMLImageElement>(null);
  const bottomRightRef = useRef<HTMLImageElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Add fade-in animation for hero section
    gsap.fromTo(
      [".hero-title", ".hero-description", ".hero-buttons"],
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out"
      }
    );
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      ScrollTrigger.refresh();
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    if (topLeftRef.current && bottomLeftRef.current && topRightRef.current && bottomRightRef.current && servicesRef.current) {
      const service1 = document.querySelector('#service-1 img');
      const service2 = document.querySelector('#service-2 img');
      const service3 = document.querySelector('#service-3 img');
      const service4 = document.querySelector('#service-4 img');

      if (!service1 || !service2 || !service3 || !service4) return;

      // Set initial styles for corner images
      [topLeftRef, bottomLeftRef, topRightRef, bottomRightRef].forEach(ref => {
        if (ref.current) {
          gsap.set(ref.current, {
            width: isMobile ? '8rem' : '12rem',
            height: isMobile ? '8rem' : '12rem',
            objectFit: 'cover',
            borderRadius: '0.5rem',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            zIndex: 15
          });
        }
      });

      // Create the main timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: servicesRef.current,
          start: "top 80%", // Start when the top of services section hits 80% of viewport
          end: "top 20%",   // End when the top of services section hits 20% of viewport
          scrub: true,
          markers: false,
          toggleActions: "play none none reverse", // Play on enter, reverse on leave
          invalidateOnRefresh: true,
          snap: {
            snapTo: "labels",
            duration: { min: 0.2, max: 0.5 },
            delay: 0,
            ease: "power1.inOut"
          }
        }
      });

      // Define animation mapping
      const animations = [
        { ref: topLeftRef.current, target: service1, align: 'start' },
        { ref: bottomLeftRef.current, target: service2, align: 'start' },
        { ref: bottomRightRef.current, target: service3, align: 'end' },
        { ref: topRightRef.current, target: service4, align: 'end' }
      ];

      // Add animations to timeline
      animations.forEach(({ ref, target, align }) => {
        if (!ref || !target) return;

        const targetRect = target.getBoundingClientRect();
        const startRect = ref.getBoundingClientRect();

        // Calculate position based on alignment
        const xOffset = align === 'end'
          ? (targetRect.left + targetRect.width) - (startRect.left + startRect.width)
          : targetRect.left - startRect.left;

        const yOffset = targetRect.top - startRect.top + window.scrollY;

        // Add to timeline
        tl.to(ref, {
          x: xOffset,
          y: yOffset,
          width: targetRect.width,
          height: targetRect.height,
          ease: "power1.inOut",
          duration: 1
        }, 0);
      });

      // Handle service images opacity
      tl.to([service1, service2, service3, service4], {
        opacity: 0,
        duration: 1,
        ease: "none"
      }, 0);

      // Check initial scroll position and set images accordingly
      const initialScrollY = window.scrollY;
      if (initialScrollY > servicesRef.current.offsetTop) {
        tl.progress(1);
      }

      return () => {
        window.removeEventListener('resize', handleResize);
        tl.kill();
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }
  }, [isMobile]);
  
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      <div className="h-20 md:h-40 w-full bg-black"></div>

      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        <div className="relative">
          <div className="absolute inset-[-75px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-rose-400 to-orange-800 opacity-40 blur-3xl -z-10" />
          
          {/* Images remain the same */}
          <Image 
            ref={topLeftRef} 
            src={landingPhoto1} 
            alt="Top Left Image" 
            className="absolute top-[-50px] md:top-[-100px] left-[-75px] md:left-[-250px] w-24 md:w-48 h-24 md:h-48 object-cover rounded-lg border-2 border-white/20"
          />
          <Image 
            ref={bottomLeftRef} 
            src={landingPhoto1} 
            alt="Bottom Left Image" 
            className={`absolute ${isMobile ? 'bottom-[-100px] left-[-125px] w-32 h-32' : 'bottom-[-200px] left-[-250px] w-48 h-48'} object-cover rounded-lg border-2 border-white/20`}
          />
          <Image 
            ref={topRightRef} 
            src={landingPhoto1} 
            alt="Top Right Image" 
            className={`absolute ${isMobile ? 'top-[-50px] right-[-125px] w-32 h-32' : 'top-[-100px] right-[-250px] w-48 h-48'} object-cover rounded-lg border-2 border-white/20`}
          />
          <Image 
            ref={bottomRightRef} 
            src={landingPhoto1} 
            alt="Bottom Right Image" 
            className={`absolute ${isMobile ? 'bottom-[-100px] right-[-125px] w-32 h-32' : 'bottom-[-200px] right-[-250px] w-48 h-48'} object-cover rounded-lg border-2 border-white/20`}
          />
          <h1 className="hero-title text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 tracking-tight">
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

        <p className="hero-description text-base md:text-lg lg:text-xl text-zinc-400 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed">
          Book expert cleaning, installation, and repair services in just a few clicks. Quality service, hassle-free experience, and secure payments—anytime, anywhere.
        </p>

        <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
          <Button
            variant="outline"
            className="min-w-[160px] bg-transparent text-white border-white/20 hover:bg-white/10 hover:border-white/30 transition-all"
          >
            Get Started
          </Button>
          <Button 
            variant="ghost" 
            className="text-zinc-400 hover:text-white hover:bg-transparent" 
            onClick={() => router.push('/services')}
          >
            Explore Services
          </Button>
        </div>
      </div>

      <div ref={servicesRef} className="relative z-10 w-full mt-20 md:mt-50">
        <ServicesSection />
      </div>

      <div className="relative z-10 w-full mt-8">
        <FeaturesGrid />
      </div>

      <div className="relative z-10 w-full mt-8">
        <InfiniteCarousel />
      </div>

      <div className="relative z-10 w-full">
        <TestimonialsSection />
      </div>

      <div className="relative z-10 w-full">
        <FAQSection />
      </div>
    </div>
  );
}