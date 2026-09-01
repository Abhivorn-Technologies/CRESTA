"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function SplashScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // Only show the splash screen once per session AND only on the home page
    const hasSeenSplash = sessionStorage.getItem("cresta_splash_seen");
    
    if (hasSeenSplash || pathname !== "/") {
      setIsLoading(false);
      return;
    }

    // Simulate loading progress much faster (800ms)
    const duration = 800; 
    const intervalTime = 20;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        sessionStorage.setItem("cresta_splash_seen", "true");
        setTimeout(() => setIsLoading(false), 200);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gradient-to-br from-white via-[#fdf2f8] to-[#fce7f3] overflow-hidden"
        >
          {/* Animated Background Blobs for depth */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-white/40 blur-[80px]"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[#fbcfe8]/30 blur-[100px]"
          />

          <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-md px-6">
            
            {/* Center Image (Floating) */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: [0, -10, 0], opacity: 1 }}
              transition={{ 
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 0.5 }
              }}
              className="relative w-48 h-48 mb-6 drop-shadow-2xl"
            >
              {/* Using a nice ice cream image or logo */}
              <Image 
                src="/images/Ice Cream Sundae.png" 
                alt="Loading Ice Cream" 
                fill 
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </motion.div>

            {/* Brand Text */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center text-center mb-10"
            >
              <h1 className="font-heading text-4xl font-extrabold text-[#101b4d] tracking-tight mb-2">
                Cresta
              </h1>
              <p className="text-[#e6127d] font-medium text-sm italic">
                Curating your delicious moments...
              </p>
            </motion.div>

            {/* Progress Bar Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full max-w-[280px] flex flex-col gap-3"
            >
              {/* Progress Bar Track */}
              <div className="h-3 w-full bg-white/60 rounded-full overflow-hidden shadow-inner border border-white/40 p-0.5 backdrop-blur-sm">
                {/* Progress Bar Fill */}
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#f472b6] to-[#e6127d] rounded-full shadow-[0_0_10px_rgba(230,18,125,0.5)]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear", duration: 0.1 }}
                />
              </div>

              {/* Status Text */}
              <div className="flex justify-between items-center text-[11px] font-bold text-[#101b4d]/60 px-1 uppercase tracking-wider">
                <span>Slowly preparing your experience...</span>
                <span className="text-[#e6127d]">{progress}%</span>
              </div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
