"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen w-screen bg-[#f8f9fa] flex items-center justify-center p-4 sm:p-6 overflow-hidden fixed inset-0">
      <div className="w-full max-w-[1000px] max-h-[95vh] flex flex-row rounded-[2rem] overflow-hidden bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 relative">
        
        {/* Left Side: Branding / Image */}
        <div className="hidden lg:flex lg:w-[45%] relative bg-gradient-to-b from-[#f8f9fa] to-[#f1f5f9] flex-col overflow-hidden border-r border-gray-100">
          
          <div className="relative z-10 flex flex-col h-full w-full p-10 lg:p-12">
            
            {/* Back Button - Top Left Absolute */}
            <Link 
              href="/" 
              className="absolute top-8 left-8 flex items-center justify-center p-2.5 bg-white text-[#101b4d] rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300 group z-50 border border-gray-100"
              title="Back to Home"
            >
              <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
            </Link>

            {/* Top Section: Logo & Text (Centered) */}
            <div className="flex flex-col items-center text-center w-full max-w-[360px] mx-auto">
              {/* Clickable Logo - Centered */}
              <Link href="/" className="group relative transition-transform hover:scale-105 duration-300 w-fit mb-10">
                <Image 
                  src="/cresta-logo.png" 
                  alt="Cresta Global Logo" 
                  width={130} 
                  height={130} 
                  className="object-contain drop-shadow-sm"
                />
              </Link>

              {/* Title - Centered */}
              <h1 className="text-[2rem] leading-tight font-heading font-extrabold text-[#101b4d] mb-4 tracking-tight">
                Premium Ice Cream <br/> Portal
              </h1>
              <p className="text-gray-500 text-[15px] leading-relaxed font-medium">
                The secure and structured platform for managing your premium experiences and operations.
              </p>
            </div>

            {/* Bottom Section: Fully Visible Image Moved Up */}
            <div className="relative w-full flex-1 mt-6 flex items-center justify-center mix-blend-multiply">
              <div className="relative w-full max-w-[280px] aspect-square group -mt-4">
                <Image
                  src="/images/CottonCandy--450ml---1043sq_414x.png.png"
                  alt="Cresta Premium"
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-700 origin-center drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Area */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-10 relative bg-white overflow-y-auto custom-scrollbar">
          <div className="w-full max-w-[420px] mx-auto h-full flex flex-col justify-center">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}
