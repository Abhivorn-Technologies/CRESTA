import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CheckoutForm } from "@/features/checkout/CheckoutForm";
import { CheckoutSummary } from "@/features/checkout/CheckoutSummary";
import { Check } from "lucide-react";

export default function CheckoutPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f0f3fa]">
      <Navbar />
      
      <div className="flex-1 w-full max-w-[1152px] mx-auto px-6 pt-[120px] pb-24">
        
        {/* Header & Progress Container */}
        <div className="flex flex-col items-center mb-16 relative">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#00113A] tracking-tight mb-10 text-center">
            Checkout
          </h1>
          
          {/* Progress Indicator */}
          <div className="flex items-start justify-between w-full max-w-[500px] relative mt-4">
            
            {/* Connecting Lines */}
            <div className="absolute top-[16px] left-[10%] right-[10%] h-[2px] bg-gray-300 z-0" />

            {/* Step 1: Shipping (Active) */}
            <div className="flex flex-col items-center gap-2 relative z-10 w-24">
              <div className="w-8 h-8 rounded-full bg-[#00113A] text-white flex items-center justify-center text-sm font-bold shadow-sm ring-[6px] ring-[#f0f3fa]">
                1
              </div>
              <span className="text-[10px] font-bold text-[#00113A] uppercase tracking-wider text-center">Shipping</span>
            </div>

            {/* Step 2: Payment (Pending) */}
            <div className="flex flex-col items-center gap-2 relative z-10 w-24">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center text-sm font-bold ring-[6px] ring-[#f0f3fa]">
                2
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Payment</span>
            </div>

            {/* Step 3: Confirmation (Pending) */}
            <div className="flex flex-col items-center gap-2 relative z-10 w-24">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center text-sm font-bold ring-[6px] ring-[#f0f3fa]">
                3
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Confirmation</span>
            </div>

          </div>
        </div>

        {/* Main Content Two-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 justify-center items-start">
          <CheckoutForm />
          <CheckoutSummary />
        </div>

      </div>
    </main>
  );
}
