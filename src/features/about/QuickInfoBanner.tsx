import React from "react";
import Image from "next/image";
import { ShoppingCart, ShoppingBag, Phone } from "lucide-react";

export const QuickInfoBanner = React.memo(function QuickInfoBanner() {
  return (
    <section className="w-full px-4 md:px-6 lg:px-10 pb-20 pt-8 md:pb-24 md:pt-12">
      <div className="mx-auto max-w-[1440px]">
        {/* Pink Pill Container */}
        <div className="bg-[#FDC5EC] rounded-[36px] md:rounded-[50px] relative w-full flex flex-col lg:flex-row items-center justify-between px-6 py-8 md:px-8 md:py-8 lg:px-8 lg:py-8 shadow-sm border border-pink-200 overflow-hidden gap-6 lg:gap-4">
          
          {/* Desktop Left Image (Hidden on Mobile) */}
          <div className="hidden lg:flex w-[150px] xl:w-[180px] shrink-0 z-20 mix-blend-multiply flex-col items-center justify-center relative">
            <div className="w-full aspect-[4/3] relative">
              <Image 
                src="/api/images/about-mega"
                alt="Megaphone"
                fill
                className="object-contain mix-blend-multiply brightness-[1.05] contrast-[1.05]"
                sizes="180px"
              />
              <div className="absolute inset-0 flex items-center justify-center -translate-y-6 translate-x-3">
                <span className="text-white font-black italic text-base xl:text-lg uppercase tracking-wider leading-none text-center drop-shadow-md rotate-[-5deg]">
                  COMING<br/>SOON!
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Top Image */}
          <div className="flex lg:hidden w-[140px] relative shrink-0 z-20 mix-blend-multiply mb-2">
            <div className="w-full aspect-[4/3] relative">
              <Image 
                src="/api/images/about-mega"
                alt="Megaphone"
                fill
                className="object-contain mix-blend-multiply brightness-[1.05] contrast-[1.05]"
                sizes="140px"
              />
              <div className="absolute inset-0 flex items-center justify-center -translate-y-5 translate-x-2">
                <span className="text-white font-black italic text-[11px] uppercase tracking-wider leading-none text-center drop-shadow-sm rotate-[-5deg]">
                  COMING<br/>SOON!
                </span>
              </div>
            </div>
          </div>

          {/* 3 Information Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 w-full flex-1 gap-6 lg:gap-4 xl:gap-8 z-30 px-2 lg:px-4">
            
            {/* Col 1: FMCG */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3">
              <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-white text-[#e6127d] shadow-sm transform transition-transform hover:scale-110">
                <ShoppingCart className="size-5" />
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <h3 className="font-heading font-bold text-[#101b4d] text-base xl:text-lg mb-1">FMCG Products</h3>
                <p className="text-[#6b7280] text-xs xl:text-sm font-medium leading-relaxed">
                  A wide range of Fast Moving Consumer Goods from top brands — coming soon.
                </p>
              </div>
            </div>

            {/* Col 2: Grocery */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3">
              <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-white text-[#101b4d] shadow-sm transform transition-transform hover:scale-110">
                <ShoppingBag className="size-5" />
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <h3 className="font-heading font-bold text-[#101b4d] text-base xl:text-lg mb-1">All Grocery Items</h3>
                <p className="text-[#6b7280] text-xs xl:text-sm font-medium leading-relaxed">
                  Everything your home needs, from daily essentials to premium groceries.
                </p>
              </div>
            </div>

            {/* Col 3: Contact */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-3">
              <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-white text-[#101b4d] shadow-sm transform transition-transform hover:scale-110">
                <Phone className="size-5" />
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <h3 className="font-heading font-bold text-[#101b4d] text-base xl:text-lg mb-1">Contact Us</h3>
                <p className="text-[#6b7280] text-xs xl:text-sm font-medium leading-relaxed mb-2">
                  For enquiries, partnerships or bulk orders:
                </p>
                <a
                  href="tel:9000199047"
                  className="font-heading font-black text-[#e6127d] text-lg xl:text-xl tracking-tight bg-white/70 hover:bg-white px-4 py-1.5 rounded-xl shadow-sm border border-white transition-colors"
                >
                  9000199047
                </a>
              </div>
            </div>

          </div>

          {/* Right Basket Image - Desktop */}
          <div className="hidden lg:flex w-[160px] xl:w-[200px] shrink-0 aspect-[4/3] relative z-20 mix-blend-multiply items-center justify-center">
            <Image 
              src="/api/images/about-basket"
              alt="Grocery Basket"
              fill
              className="object-contain mix-blend-multiply brightness-[1.05] contrast-[1.05]"
              sizes="200px"
            />
          </div>

          {/* Mobile Bottom Image */}
          <div className="flex lg:hidden w-[180px] relative shrink-0 z-20 mix-blend-multiply mt-4 -mb-2">
            <div className="w-full aspect-[4/3] relative">
              <Image 
                src="/api/images/about-basket"
                alt="Grocery Basket"
                fill
                className="object-contain mix-blend-multiply brightness-[1.05] contrast-[1.05]"
                sizes="180px"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
});
