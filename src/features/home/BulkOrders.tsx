"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { Heart, Briefcase, Gift, MoreHorizontal } from "lucide-react";

export function BulkOrders() {
  return (
    <section className="relative w-full py-16 bg-white overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 flex items-center justify-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-[1200px] rounded-2xl bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col lg:flex-row items-center justify-between p-6 md:p-8 lg:p-0 min-h-[300px] overflow-hidden lg:overflow-visible"
        >
          {/* Left: Tubs Image */}
          <div className="relative w-[220px] h-[180px] sm:w-[280px] sm:h-[220px] lg:w-[400px] lg:h-[350px] shrink-0 flex items-center justify-center lg:-ml-6 z-10 mt-6 lg:mt-0">
            <Image 
              src="/images/image 5.png" 
              alt="Baskin Robbins Tubs" 
              fill
              priority
              className="object-contain drop-shadow-xl"
             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
          </div>

          {/* Center: Text Content */}
          <div className="flex flex-col items-center text-center flex-1 z-20 py-6 lg:py-0 px-4">
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-[40px] font-bold leading-tight text-[#101b4d] mb-3">
              Bulk Orders for Every<br />Celebration!
            </h2>
            <p className="text-[#6b7280] text-[14px] sm:text-[15px] font-medium max-w-[400px] mb-8 leading-relaxed">
              We provide bulk orders for all your special moments. Marriage Events, Corporate Events, Birthday Parties and more.
            </p>
            
            {/* Horizontal Icons */}
            <div className="flex items-center justify-center gap-3 sm:gap-6 md:gap-10 mb-8 flex-wrap">
              <div className="flex flex-col items-center gap-2 group">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-[#101b4d] group-hover:scale-110 group-hover:border-[#e6127d] group-hover:text-[#e6127d] transition-all">
                  <Heart className="size-4 sm:size-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 uppercase tracking-wider text-center">Marriage<br/>Events</span>
              </div>
              
              <div className="flex flex-col items-center gap-2 group">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-[#101b4d] group-hover:scale-110 group-hover:border-[#e6127d] group-hover:text-[#e6127d] transition-all">
                  <Briefcase className="size-4 sm:size-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 uppercase tracking-wider text-center">Corporate<br/>Events</span>
              </div>
              
              <div className="flex flex-col items-center gap-2 group">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-[#101b4d] group-hover:scale-110 group-hover:border-[#e6127d] group-hover:text-[#e6127d] transition-all">
                  <Gift className="size-4 sm:size-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 uppercase tracking-wider text-center">Birthday<br/>Parties</span>
              </div>
              
              <div className="flex flex-col items-center gap-2 group">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 text-[#101b4d] group-hover:scale-110 group-hover:border-[#e6127d] group-hover:text-[#e6127d] transition-all">
                  <MoreHorizontal className="size-4 sm:size-5" />
                </div>
                <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 uppercase tracking-wider text-center">And<br/>More</span>
              </div>
            </div>

            {/* Mobile Enquire Now Button */}
            <div className="lg:hidden z-20 mb-4">
               <Link href="/enquiry">
                 <Button className="bg-[#101b4d] hover:bg-[#1a2b75] text-white rounded-full px-8 py-5 font-semibold shadow-lg shadow-[#101b4d]/20 transition-all hover:scale-105">
                   Enquire Now &rarr;
                 </Button>
               </Link>
            </div>
          </div>

          {/* Right: Enquire Now Button (Desktop) & Sundae Image */}
          <div className="relative shrink-0 hidden lg:flex items-center justify-center lg:justify-end w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] lg:w-[350px] lg:h-[300px] lg:pr-8 z-10 mb-6 lg:mb-0">
            <div className="absolute right-[220px] top-1/2 -translate-y-1/2 z-20 hidden lg:block">
               <Link href="/enquiry">
                 <Button className="bg-[#101b4d] hover:bg-[#1a2b75] text-white rounded-full px-8 py-6 font-semibold shadow-lg shadow-[#101b4d]/20 transition-all hover:scale-105">
                   Enquire Now &rarr;
                 </Button>
               </Link>
            </div>
            
            <div className="relative lg:absolute w-full h-full lg:w-[280px] lg:h-[280px] lg:right-[-40px] lg:top-1/2 lg:-translate-y-1/2">
              <Image 
                src="/images/Ice Cream Sundae.png" 
                alt="Ice Cream Sundae" 
                fill
                className="object-contain drop-shadow-xl"
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            </div>
          </div>
          
        </motion.div>
      </div>
    </section>
  );
}
