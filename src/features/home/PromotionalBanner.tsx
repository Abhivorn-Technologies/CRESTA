"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CmsImage } from "@/components/ui/CmsImage";
import Link from "next/link";

export const PromotionalBanner = React.memo(function PromotionalBanner() {
  return (
    <section className="w-full py-12 lg:py-16 bg-[#fdfdfd]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative w-full overflow-hidden rounded-[2.5rem] bg-[#101b4d] text-white shadow-2xl px-6 py-16 md:p-16 lg:p-20 flex flex-col justify-center items-center text-center lg:items-start lg:text-left min-h-[450px] lg:min-h-[512px]"
        >
          {/* Background image placeholder / overlay */}
          <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none">
            <CmsImage imageKey="home-banner" alt="Make Every Occasion Special" fill className="object-cover"  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            <div className="w-full h-full bg-gradient-to-r from-[#101b4d] via-transparent to-transparent absolute inset-0 z-10" />
            <div className="w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent absolute inset-0 z-10" />
          </div>

          <div className="relative z-20 flex flex-col items-center lg:items-start max-w-xl gap-6">
            <h2 className="font-heading text-4xl md:text-5xl lg:text-[56px] font-[800] leading-[1.1] tracking-tight">
              Make Every Occasion Special
            </h2>
            
            <p className="text-[15px] md:text-[17px] text-white/90 leading-relaxed font-medium">
              Get 15% off on all party orders above ₹2000. Use code <span className="font-bold text-[#f5a623]">PARTY15</span> at checkout.
            </p>
            
            <div className="pt-2">
              <Link href="/products/party-pack-supreme">
                <Button size="lg" className="bg-[#f5a623] hover:bg-[#d97706] text-[#101b4d] font-bold border-none shadow-[0_8px_20px_-8px_rgba(245,166,35,0.6)]">
                  Order Party Pack
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
});
