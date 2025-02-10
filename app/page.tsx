'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from 'next/link';
import Loading from './feed/loading';
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-zinc-900" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
          <span className="inline-block relative">
          Seamless Home & Office {" "}
            <span className="relative">
              <span className="absolute -inset-1 blur-xl bg-gradient-to-r from-white/30 to-white/10 opacity-50" />
              <span className="relative">Services </span>
            </span>{" "}
            at Your Fingertips
          </span>
        </h1>

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
    </div>
  )
}
