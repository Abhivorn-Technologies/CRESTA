"use client";

import { motion } from "framer-motion";

export function AboutHero() {
  return (
    <section className="relative w-full flex flex-col pt-[120px]">
      
      {/* Hero Image Area */}
      <div className="relative w-full h-[540px] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/store-interior.png")' }}
        />
        
        {/* Blue Gradient Overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#101b4d]/95 via-[#101b4d]/80 to-[#101b4d]/60" />

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center max-w-[800px] mt-10">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="px-4 py-1.5 rounded-full bg-[#f5a623] text-[#101b4d] font-bold text-[11px] tracking-widest uppercase mb-6"
          >
            Our Story
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-4xl md:text-5xl lg:text-[56px] font-bold text-white leading-tight mb-6"
          >
            Delivering Joy, <br/> One Scoop at a Time.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/80 font-medium text-base md:text-lg leading-relaxed max-w-[650px]"
          >
            Cresta Global is proud to be an authorized distributor of Baskin Robbins, bringing the world's most beloved ice cream to your doorstep with uncompromising quality and service.
          </motion.p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="w-full bg-[#1b2c8d] py-12 px-6">
        <div className="mx-auto max-w-[1440px] grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 divide-x-0 lg:divide-x divide-white/20">
          
          <div className="flex flex-col items-center text-center px-4">
            <span className="text-[#f5a623] font-bold text-4xl mb-1">10+</span>
            <span className="text-white/80 text-[11px] font-bold tracking-widest uppercase">Years Experience</span>
          </div>
          
          <div className="flex flex-col items-center text-center px-4">
            <span className="text-[#f5a623] font-bold text-4xl mb-1">31+</span>
            <span className="text-white/80 text-[11px] font-bold tracking-widest uppercase">Premium Flavors</span>
          </div>
          
          <div className="flex flex-col items-center text-center px-4">
            <span className="text-[#f5a623] font-bold text-4xl mb-1">50k+</span>
            <span className="text-white/80 text-[11px] font-bold tracking-widest uppercase">Happy Customers</span>
          </div>
          
          <div className="flex flex-col items-center text-center px-4">
            <span className="text-[#f5a623] font-bold text-4xl mb-1">100%</span>
            <span className="text-white/80 text-[11px] font-bold tracking-widest uppercase">Cold Chain Guarantee</span>
          </div>

        </div>
      </div>
      
    </section>
  );
}
