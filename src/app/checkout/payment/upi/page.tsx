import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { UpiPaymentForm } from "@/features/checkout/UpiPaymentForm";
import { UpiPaymentSummary } from "@/features/checkout/UpiPaymentSummary";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function UpiPaymentPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f0f3fa]">
      <Navbar />
      
      <div className="flex-1 w-full max-w-[1152px] mx-auto px-6 pt-[120px] pb-24">
        
        {/* Header Container */}
        <div className="flex flex-col mb-10 w-full max-w-[1152px]">
          <Link 
            href="/checkout/payment" 
            className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#e6127d] transition-colors mb-4 w-fit"
          >
            <ArrowLeft className="size-4" />
            Back to Checkout
          </Link>
          
          <h1 className="font-heading text-3xl font-bold text-[#00113A] tracking-tight">
            Payment via UPI / Mobile Wallets
          </h1>
        </div>

        {/* Main Content Two-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 justify-start items-start w-full">
          <UpiPaymentForm />
          <UpiPaymentSummary />
        </div>

      </div>
    </main>
  );
}
