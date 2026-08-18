import Image from "next/image";
import { ShoppingCart, ShoppingBag, Phone } from "lucide-react";

export function QuickInfoBanner() {
  return (
    <section className="w-full px-6 lg:px-10 pb-24 pt-12">
      <div className="mx-auto max-w-[1440px]">
        {/* Pink Pill Container */}
        <div className="bg-[#FDC5EC] rounded-[30px] md:rounded-[60px] relative w-full flex flex-col lg:flex-row items-center justify-between px-6 md:px-12 py-8 lg:py-10">
          
          {/* Left Megaphone Image (Inside bounds) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 md:-translate-x-0 md:static md:w-[200px] lg:w-[240px] w-[120px] aspect-[4/3] shrink-0 z-20 mix-blend-multiply opacity-50 md:opacity-100">
            <Image 
              src="/images/blank-megaphone.png"
              alt="Megaphone"
              fill
              className="object-contain mix-blend-multiply brightness-[1.05] contrast-[1.05]"
              sizes="(max-width: 1024px) 200px, 240px"
            />
            {/* CSS Text Overlaid on the blank speech bubble */}
            <div className="absolute inset-0 flex items-center justify-center -translate-y-4 md:-translate-y-6 lg:-translate-y-8 translate-x-2 md:translate-x-4">
              <span className="text-white font-black italic text-xs md:text-lg lg:text-xl uppercase tracking-wider leading-none text-center drop-shadow-md rotate-[-5deg]">
                COMING<br/>SOON!
              </span>
            </div>
          </div>

          {/* Columns Wrapper */}
          <div className="flex flex-col lg:flex-row w-full justify-between items-center gap-8 lg:gap-10 px-4 lg:px-8 mt-12 md:mt-0 z-30">
            
            {/* Col 1: FMCG */}
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 flex-1">
              <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-white text-[#e6127d] shadow-sm">
                <ShoppingCart className="size-5" />
              </div>
              <div className="flex flex-col items-center md:items-start">
                <h3 className="font-heading font-bold text-[#101b4d] text-[17px] mb-1.5">FMCG Products</h3>
                <p className="text-[#6b7280] text-[13px] font-medium leading-relaxed max-w-[200px]">
                  A wide range of Fast Moving Consumer Goods from top brands — coming soon.
                </p>
              </div>
            </div>

            {/* Col 2: Grocery */}
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 flex-1">
              <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-white text-[#101b4d] shadow-sm">
                <ShoppingBag className="size-5" />
              </div>
              <div className="flex flex-col items-center md:items-start">
                <h3 className="font-heading font-bold text-[#101b4d] text-[17px] mb-1.5">All Grocery Items</h3>
                <p className="text-[#6b7280] text-[13px] font-medium leading-relaxed max-w-[200px]">
                  Everything your home needs, from daily essentials to premium groceries.
                </p>
              </div>
            </div>

            {/* Col 3: Contact */}
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 flex-1">
              <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-white text-[#101b4d] shadow-sm">
                <Phone className="size-5" />
              </div>
              <div className="flex flex-col items-center md:items-start">
                <h3 className="font-heading font-bold text-[#101b4d] text-[17px] mb-1.5">Contact Us</h3>
                <p className="text-[#6b7280] text-[13px] font-medium leading-relaxed mb-3 max-w-[200px]">
                  For enquiries, partnerships or bulk orders, reach us at:
                </p>
                <span className="font-heading font-black text-[#e6127d] text-2xl tracking-tight">
                  9000199047
                </span>
              </div>
            </div>

          </div>

          {/* Right Basket Image (Inside right bound, pops out top/bottom) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[160px] md:w-[220px] lg:w-[280px] aspect-[4/3] pointer-events-none z-20 mix-blend-multiply scale-125 lg:scale-150 transform origin-right">
            <Image 
              src="/images/grocery-basket.png"
              alt="Grocery Basket"
              fill
              className="object-contain mix-blend-multiply brightness-[1.05] contrast-[1.05]"
              sizes="(max-width: 1024px) 220px, 280px"
            />
          </div>

          {/* Invisible spacer to reserve space for the absolute basket on the right */}
          <div className="hidden lg:block w-[180px] shrink-0" />

        </div>
      </div>
    </section>
  );
}
