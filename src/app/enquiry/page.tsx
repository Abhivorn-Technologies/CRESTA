import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { EnquiryForm } from "@/features/enquiry/EnquiryForm";
import { EnquirySidebar } from "@/features/enquiry/EnquirySidebar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function EnquiryPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f0f3fa]">
      <Navbar />
      
      {/* 
        Figma total width is 851 (form) + 512 (sidebar) = 1363px. 
        Using max-w-[1440px] with padding aligns well.
      */}
      <div className="flex-1 w-full max-w-[1440px] mx-auto px-6 pt-[120px] pb-24">
        
        {/* Header Section */}
        <div className="max-w-[963px] mx-auto flex flex-col items-center mb-12 relative">
          
          {/* Back Button */}
          <Link 
            href="/" 
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#e6127d] transition-colors hidden md:block"
          >
            <ArrowLeft className="size-6" />
          </Link>

          <div className="text-center flex flex-col items-center gap-3">
            <h1 className="font-heading text-3xl md:text-[42px] leading-tight font-bold text-[#00113A]">
              Enquire for Your Special Occasion
            </h1>
            <p className="text-[#6b7280] text-sm md:text-base max-w-[680px]">
              Elevate your events with our premium selection. Provide us with your details below, and our concierges will curate a bespoke experience tailored to your exacting standards.
            </p>
          </div>
        </div>

        {/* Main Layout Container */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 justify-center items-start">
          <EnquiryForm />
          <EnquirySidebar />
        </div>

      </div>
    </main>
  );
}
