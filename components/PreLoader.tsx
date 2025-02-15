// src/components/Preloader.tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const minLoadTime = 3000; // 3 seconds minimum loading time

    const incrementProgress = () => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 1;
        }
        return prev;
      });
    };

    const progressInterval = setInterval(incrementProgress, 30);

    const checkCompletion = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      if (progress >= 100 && elapsedTime >= minLoadTime) {
        clearInterval(progressInterval);
        clearInterval(checkCompletion);

        setTimeout(() => {
          onComplete();
        }, 300);
      }
    }, 100);

    return () => {
      clearInterval(progressInterval);
      clearInterval(checkCompletion);
    };
  }, [progress, onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Logo/Image Container */}
      <div className="mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-32 h-32 bg-zinc-800 rounded-2xl flex items-center justify-center"
        >
          <Image
            src="/helperbuddy-logo.png"
            alt="Logo"
            width={96} // Adjust width based on your need
            height={96} // Adjust height based on your need
            className="object-contain"
          />
        </motion.div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-64 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-white"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Progress Text */}
      <motion.p
        className="mt-4 text-zinc-400 text-sm font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Loading... {progress}%
      </motion.p>
    </motion.div>
  );
};

export default Preloader;
