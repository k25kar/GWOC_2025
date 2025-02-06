'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from 'react';
import { Navbar } from '@/components/Navbar';

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
          <footer className="flex justify-center items-center w-full max-w-6xl mx-auto p-4">
            <p className="text-sm">&copy; 2023 Our Company. All rights reserved.</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
