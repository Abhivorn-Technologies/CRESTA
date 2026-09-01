"use client";

import { motion } from "framer-motion";
import { CmsImage } from "@/components/ui/CmsImage";
import { CheckCircle2, ShieldCheck, ThermometerSnowflake, UserCheck } from "lucide-react";

export function AuthorizedDistributor() {
  return (
    <section className="relative w-full py-20 bg-white">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative w-full overflow-hidden rounded-[2.5rem] bg-[#fdeef6] flex flex-col lg:flex-row"
        >
          {/* Left Content */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left justify-center p-10 lg:p-16 lg:w-[55%] z-10">
            <h2 className="font-heading text-4xl lg:text-5xl font-bold text-[#101b4d] tracking-tight mb-3">
              BASKIN ROBBINS
            </h2>
            
            <div className="inline-block bg-[#e6127d] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full w-fit mb-6 shadow-sm mx-auto lg:mx-0">
              Authorized Distributor
            </div>
            
            <p className="text-[#6b7280] font-medium text-base max-w-[450px] leading-relaxed mb-10 mx-auto lg:mx-0">
              We are an authorized distributor for Baskin Robbins. Bringing you the world's favorite ice cream with the same great taste and quality.
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full max-w-[300px] sm:max-w-none mx-auto lg:mx-0">
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e6127d]/20 bg-white text-[#e6127d] shadow-sm">
                  <CheckCircle2 className="size-5" />
                </div>
                <span className="text-[11px] sm:text-[10px] font-bold sm:font-semibold text-[#101b4d] text-center uppercase leading-tight">100% Original<br/>Products</span>
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e6127d]/20 bg-white text-[#e6127d] shadow-sm">
                  <ThermometerSnowflake className="size-5" />
                </div>
                <span className="text-[11px] sm:text-[10px] font-bold sm:font-semibold text-[#101b4d] text-center uppercase leading-tight">Proper Cold<br/>Chain Delivery</span>
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e6127d]/20 bg-white text-[#e6127d] shadow-sm">
                  <ShieldCheck className="size-5" />
                </div>
                <span className="text-[11px] sm:text-[10px] font-bold sm:font-semibold text-[#101b4d] text-center uppercase leading-tight">Trusted<br/>Quality</span>
              </div>
              
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e6127d]/20 bg-white text-[#e6127d] shadow-sm">
                  <UserCheck className="size-5" />
                </div>
                <span className="text-[11px] sm:text-[10px] font-bold sm:font-semibold text-[#101b4d] text-center uppercase leading-tight">Dedicated<br/>Support</span>
              </div>
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative h-[250px] sm:h-[300px] mt-8 lg:mt-0 lg:h-auto lg:w-[45%] lg:absolute lg:right-0 lg:top-0 lg:bottom-0 rounded-[2.5rem] overflow-hidden lg:rounded-none">
            {/* Soft gradient fade into image for desktop */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#fdeef6] to-transparent z-10 hidden lg:block" />
            
            <CmsImage 
              imageKey="home-store-br"
              alt="Baskin Robbins Store Interior"
              fill
              className="object-cover object-right"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
