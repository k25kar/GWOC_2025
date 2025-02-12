'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from 'react';
import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer'; // Import Footer component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen flex flex-col">
          <header className="flex justify-between items-center w-full max-w-6xl mx-auto p-4">
            <Navbar />
          </header>
          <main className="flex-grow">
            {children}
          </main>
          <footer className="w-full">
            <Footer /> {/* Add Footer component */}
          </footer>
        </div>
      </body>
    </html>
  );
}
