import { Navbar } from "@/components/layout/Navbar";
import { CheckAvailabilityCard } from "@/features/delivery/CheckAvailabilityCard";
import { Truck } from "lucide-react";

export default function DeliveryPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white overflow-hidden">
      <Navbar />

      <div className="relative flex flex-col items-center pt-[140px] pb-32 px-6">
        {/* Deep Blue Background Split */}
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-[#1b2c8d] z-0" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-[800px] mx-auto mt-8">
          
          {/* Truck Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-[#f5a623] shadow-sm mb-6">
            <Truck className="size-8" />
          </div>

          {/* Intro Text */}
          <p className="text-white text-center font-medium leading-relaxed max-w-[600px] mb-12 opacity-90 text-[15px]">
            We use specialized temperature-controlled vehicles to ensure your Baskin Robbins treats arrive perfectly frozen and ready to enjoy.
          </p>

          {/* Availability Card */}
          <CheckAvailabilityCard />
          
        </div>
      </div>
    </main>
  );
}
