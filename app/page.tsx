'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Loading from './feed/loading';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Simulate loading time

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex justify-between items-center w-full max-w-6xl mx-auto">
        <Image
          src="/logo.svg"
          alt="Company Logo"
          width={100}
          height={100}
          priority
        />
        <nav className="flex gap-8">
          <a href="/services" className="hover:underline">Services</a>
          <a href="/about" className="hover:underline">About Us</a>
          <a href="/contact" className="hover:underline">Contact</a>
        </nav>
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start text-center sm:text-left">
        <h1 className="text-4xl sm:text-6xl font-bold">Welcome to Our Company</h1>
        <p className="text-lg sm:text-xl max-w-2xl">
          We provide top-notch home services to make your life easier. From cleaning to repairs, we&apos;ve got you covered.
        </p>
        <a
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          href="/services"
        >
          Explore Our Services
        </a>
      </main>
      <footer className="flex justify-center items-center w-full max-w-6xl mx-auto">
        <p className="text-sm">&copy; 2023 Our Company. All rights reserved.</p>
      </footer>
    </div>
  );
}