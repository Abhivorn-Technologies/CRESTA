"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const features = [
  "Official Baskin Robbins Distributor",
  "Bulk Orders Available",
  "31+ Iconic Flavours",
  "Retail & Wholesale Supply",
  "100% Cold Chain Delivery",
];

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center w-full overflow-hidden bg-[#fdfdfd] pt-[80px]">
      {/* Soft Background Blurs */}
      <div className="pointer-events-none absolute -top-[10%] -left-[10%] h-[50%] w-[40%] rounded-full bg-[#fdeef6] blur-[120px]" />
      <div className="pointer-events-none absolute top-[20%] -right-[10%] h-[60%] w-[35%] rounded-full bg-[#eef6fd] blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[10%] left-[20%] h-[30%] w-[30%] rounded-full bg-[#fdf3e2] blur-[100px]" />

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-6 py-8 lg:grid-cols-[1fr_1.1fr] lg:gap-8 lg:px-10 lg:py-10 xl:py-12 relative z-10 w-full">
        
        {/* Left Content */}
        <motion.div 
          animate={{ y: [30, 0] }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold tracking-[0.25em] text-[#6b7280] uppercase">
              Proud to be an
            </span>
            <h1 className="font-heading text-[clamp(2.5rem,4vw,3.75rem)] font-[800] leading-[1.05] tracking-tight text-[#101b4d]">
              Official <span className="text-[#e6127d]">BR</span><br />
              Baskin Robbins<br />
              <span className="text-[#e6127d]">Distributor</span>
            </h1>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="font-heading text-[20px] font-[700] leading-[28px] text-[#1F2937]">
              Premium Ice Cream Delivered Across Your City
            </h2>
            <p className="max-w-[480px] text-[15px] leading-[1.6] text-[#4b5563]">
              We are an Authorized Baskin Robbins Distributor, supplying premium ice creams, 
              sundaes, tubs, cakes and frozen desserts to retailers, cafes, supermarkets, 
              restaurants and event organizers with <span className="font-bold text-[#e6127d]">100% cold-chain delivery network.</span>
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 mt-2">
            {features.map((feature, i) => (
              <motion.div 
                animate={{ x: [-10, 0] }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                key={feature} 
                className="flex items-start gap-2.5"
              >
                <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#fdeef6] text-[#e6127d]">
                  <CheckCircle2 className="size-3.5" strokeWidth={3} />
                </div>
                <span className="text-[14px] font-medium text-[#374151] leading-snug">
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.div 
            animate={{ y: [10, 0] }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-4 flex items-center gap-4"
          >
            <Button 
              variant="ghost"
              className="text-[#101b4d] hover:bg-transparent hover:text-[#e6127d] text-[16px] font-semibold px-2 transition-colors"
              onClick={() => {
                window.location.href = "/products";
              }}
            >
              Order Now
              <ArrowRight className="ml-2 size-5 transition-transform group-hover/button:translate-x-1" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Right Content - Hero Image with Floating Elements */}
        <motion.div 
          animate={{ scale: [0.95, 1] }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-[700px] lg:ml-auto"
        >
          {/* Main Image Container */}
          <div className="relative aspect-[4/3] w-full lg:aspect-[999/656]">
            {/* Soft backdrop glow behind image */}
            <div className="absolute inset-0 scale-95 rounded-[3rem] bg-gradient-to-tr from-[#fdeef6] to-[#eef6fd] opacity-80 blur-2xl" />
            
            {/* The Image */}
            <div className="relative h-full w-full overflow-hidden rounded-[2.5rem] bg-transparent shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] flex items-center justify-center p-0">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 z-10 pointer-events-none" />
              <Image 
                src="/images/hero-composite.png" 
                alt="Baskin Robbins Distribution" 
                fill
                className="object-cover"
                priority
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              
              {/* Floating BR Logo Overlay to fix AI text issues */}
              <div className="absolute bottom-6 right-6 z-20 flex flex-col items-center justify-center p-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl border border-white">
                <Image src="/cresta-logo.png" alt="BR Logo" width={55} height={50} style={{ width: 'auto', height: 'auto' }} className="object-contain drop-shadow-sm mb-1" />
                <span className="text-[8px] font-bold text-[#e6127d] tracking-widest uppercase">Premium</span>
              </div>
            </div>
          </div>

          {/* Floating Glass Badges */}
          <motion.div 
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute -bottom-6 left-4 lg:-bottom-10 lg:-left-10 glass-card flex items-center gap-3 rounded-2xl px-5 py-3.5 pr-8"
          >
            <div className="flex size-11 items-center justify-center rounded-full bg-[#eef6fd] text-[#3b82f6]">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h10"/><path d="M9 4v16"/><path d="m3 9 3 3-3 3"/></svg>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-[15px] font-bold text-[#101b4d]">100% Cold Chain</span>
              <span className="text-[12px] font-medium text-[#6b7280]">Delivery Guaranteed</span>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
