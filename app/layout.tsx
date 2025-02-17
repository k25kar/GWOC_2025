"use client";

import React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/src/context/CartContext";

import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>
          Helper Buddy
        </title>
        <meta name="description" content="Your one stop solution." />

        <link rel="icon" href="/helperbuddy-logo.ico" />

      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Wrap your entire app with SessionProvider and CartProvider */}
        <SessionProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow pt-[45px]">
                {children}
              </main>
              <footer className="w-full">
                <Footer />
              </footer>
            </div>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
