'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import helperbuddyLogo from '@/public/helperbuddy-logo.png';

export default function About() {
  const textRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    textRefs.current.forEach((ref, index) => {
      gsap.fromTo(
        ref,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: index * 0.2,
          ease: "power2.out",
        }
      );
    });
  }, []);

  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center px-4 py-8 md:py-12">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <Link href="/">
            <Image
              src={helperbuddyLogo}
              alt="HelperBuddy Logo"
              width={150}
              height={150}
              className="mx-auto cursor-pointer"
            />
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mt-4">About Us</h1>
        </div>

        <section className="mb-12" ref={(el) => (textRefs.current[0] = el!)}>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">HelperBuddy</h2>
          <p className="text-base md:text-lg text-gray-400 leading-relaxed">
            HelperBuddy offers professional house, office, and AC cleaning services across India, delivering top-quality, eco-friendly solutions tailored to customer needs. Our trusted team ensures that homes and offices remain spotless, fresh, and well-maintained.
          </p>
        </section>

        <section className="mb-12" ref={(el) => (textRefs.current[1] = el!)}>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Mission</h2>
          <p className="text-base md:text-lg text-gray-400 leading-relaxed">
            Our mission is to provide reliable, efficient, and affordable cleaning services that promote a healthy and hygienic environment for all. We focus on customer satisfaction, eco-friendly practices, and highly trained professionals to deliver the best experience.
          </p>
        </section>

        <section ref={(el) => (textRefs.current[2] = el!)}>
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Our Team</h2>
          <p className="text-base md:text-lg text-gray-400 leading-relaxed">
            HelperBuddy is powered by a team of dedicated cleaning experts who are thoroughly trained and background-checked, ensuring quality, trust, and professionalism in every service we provide.
          </p>
        </section>
      </div>
    </div>
  );
}