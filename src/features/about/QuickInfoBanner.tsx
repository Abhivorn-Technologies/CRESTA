import Image from "next/image";
import { ShoppingCart, ShoppingBag, Phone } from "lucide-react";

export function QuickInfoBanner() {
  return (
    <section className="w-full px-4 md:px-6 lg:px-10 pb-20 pt-8 md:pb-24 md:pt-12">
      <div className="mx-auto max-w-[1440px]">
        {/* Pink Pill Container */}
        <div className="bg-[#FDC5EC] rounded-[40px] md:rounded-[60px] relative w-full flex flex-col lg:flex-row items-center justify-between px-6 py-10 md:px-12 md:py-12 shadow-sm border border-pink-200 overflow-hidden md:overflow-visible">
          
          {/* Desktop Left Image (Hidden on Mobile) */}
          <div className="hidden lg:flex w-[240px] shrink-0 z-20 mix-blend-multiply flex-col items-center justify-center relative">
            <div className="w-full aspect-[4/3] relative">
              <Image 
                src="/api/images/about-mega"
                alt="Megaphone"
                fill
                className="object-contain mix-blend-multiply brightness-[1.05] contrast-[1.05]"
                sizes="240px"
              />
              <div className="absolute inset-0 flex items-center justify-center -translate-y-8 translate-x-4">
                <span className="text-white font-black italic text-xl uppercase tracking-wider leading-none text-center drop-shadow-md rotate-[-5deg]">
                  COMING<br/>SOON!
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Top Image */}
          <div className="flex lg:hidden w-[160px] relative shrink-0 z-20 mix-blend-multiply mb-8">
            <div className="w-full aspect-[4/3] relative">
              <Image 
                src="/api/images/about-mega"
                alt="Megaphone"
                fill
                className="object-contain mix-blend-multiply brightness-[1.05] contrast-[1.05]"
                sizes="160px"
              />
              <div className="absolute inset-0 flex items-center justify-center -translate-y-5 translate-x-2">
                <span className="text-white font-black italic text-[11px] uppercase tracking-wider leading-none text-center drop-shadow-sm rotate-[-5deg]">
                  COMING<br/>SOON!
                </span>
              </div>
            </div>
          </div>

          {/* Columns Wrapper */}
          <div className="flex flex-col lg:flex-row w-full justify-between items-center gap-10 lg:gap-8 px-0 lg:px-8 z-30">
            
            {/* Col 1: FMCG */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 flex-1 w-full max-w-[280px]">
              <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-white text-[#e6127d] shadow-sm transform transition-transform hover:scale-110">
                <ShoppingCart className="size-6" />
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <h3 className="font-heading font-bold text-[#101b4d] text-lg mb-2">FMCG Products</h3>
                <p className="text-[#6b7280] text-[15px] font-medium leading-relaxed">
                  A wide range of Fast Moving Consumer Goods from top brands — coming soon.
                </p>
              </div>
            </div>

            {/* Col 2: Grocery */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 flex-1 w-full max-w-[280px]">
              <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-white text-[#101b4d] shadow-sm transform transition-transform hover:scale-110">
                <ShoppingBag className="size-6" />
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <h3 className="font-heading font-bold text-[#101b4d] text-lg mb-2">All Grocery Items</h3>
                <p className="text-[#6b7280] text-[15px] font-medium leading-relaxed">
                  Everything your home needs, from daily essentials to premium groceries.
                </p>
              </div>
            </div>

            {/* Col 3: Contact */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 flex-1 w-full max-w-[280px]">
              <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full bg-white text-[#101b4d] shadow-sm transform transition-transform hover:scale-110">
                <Phone className="size-6" />
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <h3 className="font-heading font-bold text-[#101b4d] text-lg mb-2">Contact Us</h3>
                <p className="text-[#6b7280] text-[15px] font-medium leading-relaxed mb-3">
                  For enquiries, partnerships or bulk orders:
                </p>
                <span className="font-heading font-black text-[#e6127d] text-2xl tracking-tight bg-white/60 px-5 py-2 rounded-2xl shadow-sm border border-white">
                  9000199047
                </span>
              </div>
            </div>

          </div>

          {/* Right Basket Image - Desktop (Absolute) */}
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[280px] aspect-[4/3] pointer-events-none z-20 mix-blend-multiply scale-150 origin-right">
            <Image 
              src="/api/images/about-basket"
              alt="Grocery Basket"
              fill
              className="object-contain mix-blend-multiply brightness-[1.05] contrast-[1.05]"
              sizes="280px"
            />
          </div>

          {/* Mobile Bottom Image */}
          <div className="flex lg:hidden w-[220px] relative shrink-0 z-20 mix-blend-multiply mt-10 -mb-6">
            <div className="w-full aspect-[4/3] relative">
              <Image 
                src="/api/images/about-basket"
                alt="Grocery Basket"
                fill
                className="object-contain mix-blend-multiply brightness-[1.05] contrast-[1.05]"
                sizes="220px"
              />
            </div>
          </div>

          {/* Invisible spacer to reserve space for the absolute basket on the right */}
          <div className="hidden lg:block w-[180px] shrink-0" />

        </div>
      </div>
    </section>
  );
}
