import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PaymentForm } from "@/features/checkout/PaymentForm";
import { PaymentSummary } from "@/features/checkout/PaymentSummary";
import { Check } from "lucide-react";

export default function PaymentPage() {
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
          <div className="flex items-center justify-between w-full max-w-[500px] relative">
            
            {/* Connecting Lines */}
            <div className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-[2px] bg-gray-200 -z-10" />

            {/* Step 1: Shipping (Completed) */}
            <div className="flex flex-col items-center gap-2 bg-[#f0f3fa] px-2 z-10">
              <div className="w-8 h-8 rounded-full bg-[#00113A] text-white flex items-center justify-center text-sm shadow-sm">
                <Check className="size-4" strokeWidth={3} />
              </div>
              <span className="text-[10px] font-bold text-[#00113A] uppercase tracking-wider">Shipping</span>
            </div>

            {/* Step 2: Payment (Active) */}
            <div className="flex flex-col items-center gap-2 bg-[#f0f3fa] px-2 z-10">
              <div className="w-8 h-8 rounded-full bg-[#00113A] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                2
              </div>
              <span className="text-[10px] font-bold text-[#00113A] uppercase tracking-wider">Payment</span>
            </div>

            {/* Step 3: Confirmation (Pending) */}
            <div className="flex flex-col items-center gap-2 bg-[#f0f3fa] px-2 z-10">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center text-sm font-bold">
                3
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Confirmation</span>
            </div>

          </div>
        </div>

        {/* Main Content Two-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 justify-center items-start">
          <PaymentForm />
          <PaymentSummary />
        </div>

      </div>
    </main>
  );
}
