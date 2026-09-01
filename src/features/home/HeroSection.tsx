"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CmsImage } from "@/components/ui/CmsImage";

import { ShieldCheck, Package, Star, Store, Snowflake } from "lucide-react";

const features = [
  { title: "Authorized Distributor", icon: ShieldCheck, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100" },
  { title: "Bulk Orders", icon: Package, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-100" },
  { title: "31+ Flavours", icon: Star, color: "text-pink-500", bg: "bg-pink-50", border: "border-pink-100" },
  { title: "Cold Chain Delivery", icon: Snowflake, color: "text-cyan-500", bg: "bg-cyan-50", border: "border-cyan-100" },
];

export const HeroSection = React.memo(function HeroSection() {
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
          className="flex flex-col gap-6 items-start text-left w-full"
        >
          <div className="flex flex-col gap-2 items-start text-left w-full">
            <span className="text-[10px] sm:text-[11px] font-black tracking-[0.25em] text-[#e6127d] uppercase">
              Proud to be an
            </span>
            <h1 className="font-sans text-[2.5rem] leading-[1.1] sm:text-5xl lg:text-[4.5rem] font-black lg:leading-[1.05] tracking-tighter text-[#101b4d]">
              Baskin Robbins<br />
              <span className="text-[#e6127d]">Distributor</span>
            </h1>
          </div>

          <div className="flex flex-col gap-3 items-start w-full">
            <h2 className="font-heading text-[18px] sm:text-[20px] font-[700] leading-[26px] sm:leading-[28px] text-[#1F2937]">
              Premium Ice Cream Delivered Across Your City
            </h2>
            <p className="max-w-[480px] text-[14px] sm:text-[15px] leading-[1.6] text-[#4b5563]">
              We are an Authorized Baskin Robbins Distributor, supplying premium ice creams, 
              sundaes, tubs, cakes and frozen desserts to retailers, cafes, supermarkets, 
              restaurants and event organizers with <span className="font-bold text-[#e6127d]">100% cold-chain delivery network.</span>
            </p>
          </div>

          {/* Premium Features Grid (Card Style) */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-2 w-full max-w-[500px]">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div 
                  animate={{ y: [10, 0], opacity: [0, 1] }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  key={feature.title} 
                  className={`flex flex-col items-center justify-center text-center gap-2.5 p-4 rounded-2xl border ${feature.border} bg-white shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className={`size-10 rounded-full ${feature.bg} ${feature.color} flex items-center justify-center`}>
                    <Icon className="size-5" strokeWidth={2.5} />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-gray-700 leading-tight px-1">
                    {feature.title}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <motion.div 
            animate={{ y: [10, 0] }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-4 flex items-center justify-start gap-4 w-full"
          >
            <Button 
              className="bg-[#e6127d] hover:bg-[#c80f6c] text-white rounded-full px-8 py-6 text-[16px] font-bold transition-all hover:-translate-y-1 shadow-lg shadow-pink-500/25 group"
              onClick={() => {
                window.location.href = "/products";
              }}
            >
              Order Now
              <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
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
              <CmsImage 
                imageKey="home-hero" 
                alt="Baskin Robbins Distribution" 
                fill
                className="object-contain"
                priority
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              

            </div>
          </div>



        </motion.div>
      </div>
    </section>
  );
});
