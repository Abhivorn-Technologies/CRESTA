import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ConfirmationCard } from "@/features/checkout/ConfirmationCard";
import { Check } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f0f3fa]">
      <Navbar />
      
      <div className="flex-1 w-full flex flex-col items-center px-6 pt-[120px] pb-24">
        
        {/* Progress Indicator */}
        <div className="flex flex-col items-center mb-16 relative w-full">
          <div className="flex items-center justify-between w-full max-w-[768px] relative">
            
            {/* Connecting Lines */}
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-[2px] bg-gray-200 -z-10" />
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-[2px] bg-[#00113A] -z-10 transition-all" />

            {/* Step 1: Shipping (Completed) */}
            <div className="flex flex-col items-center gap-2 bg-[#f0f3fa] px-4 z-10">
              <div className="w-8 h-8 rounded-full bg-[#00113A] text-white flex items-center justify-center text-sm shadow-sm">
                <Check className="size-4" strokeWidth={3} />
              </div>
              <span className="text-[10px] font-bold text-[#00113A] uppercase tracking-wider">Shipping</span>
            </div>

            {/* Step 2: Payment (Completed) */}
            <div className="flex flex-col items-center gap-2 bg-[#f0f3fa] px-4 z-10">
              <div className="w-8 h-8 rounded-full bg-[#00113A] text-white flex items-center justify-center text-sm shadow-sm">
                <Check className="size-4" strokeWidth={3} />
              </div>
              <span className="text-[10px] font-bold text-[#00113A] uppercase tracking-wider">Payment</span>
            </div>

            {/* Step 3: Confirmation (Active) */}
            <div className="flex flex-col items-center gap-2 bg-[#f0f3fa] px-4 z-10">
              <div className="w-8 h-8 rounded-full bg-[#00113A] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                3
              </div>
              <span className="text-[10px] font-bold text-[#00113A] uppercase tracking-wider">Confirmation</span>
            </div>

          </div>
        </div>

        {/* Main Content */}
        <ConfirmationCard />

      </div>
    </main>
  );
}
