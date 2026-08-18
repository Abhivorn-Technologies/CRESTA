"use client";

import { CheckCircle2, Truck, CreditCard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function ConfirmationCard() {
  const router = useRouter();

  return (
    <div className="w-full max-w-[768px] mx-auto bg-white shadow-sm flex flex-col overflow-hidden">
      
      {/* Success Header */}
      <div className="bg-[#002B5C] py-12 px-8 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#f5a623]/20 flex items-center justify-center mb-6">
          <CheckCircle2 className="size-8 text-[#f5a623]" strokeWidth={2.5} />
        </div>
        <h2 className="text-white font-heading font-bold text-2xl md:text-3xl mb-2 tracking-tight">
          Thank you for your order!
        </h2>
        <p className="text-white/80 text-sm">
          Order #CG-88291 has been confirmed.
        </p>
      </div>

      {/* Content Area */}
      <div className="p-8 lg:p-10 flex flex-col border-x border-b border-gray-200">
        
        {/* Estimated Delivery Box */}
        <div className="w-full bg-[#f0f3fa] rounded-lg p-6 flex items-center gap-4 mb-10">
          <Truck className="size-6 text-[#00113A]" />
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-500 tracking-wider uppercase">
              Estimated Delivery
            </span>
            <span className="text-lg font-bold text-[#00113A] font-heading">
              30 min
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 mb-12">
          
          {/* Left Column: Address & Payment */}
          <div className="flex flex-col gap-8">
            
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-[#00113A] text-sm">Delivery Address</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Acme Retail Corp.<br />
                123 Logistics Blvd, Suite 400<br />
                Moto City, NY 10001<br />
                United States
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-[#00113A] text-sm">Payment Method</h3>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-md border border-gray-100">
                <CreditCard className="size-4 text-gray-500" />
                <span className="text-sm text-gray-700">Corporate Account **** 4492</span>
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="flex flex-col border border-gray-100 rounded-lg p-6 bg-gray-50/50">
            <h3 className="font-bold text-[#00113A] text-sm mb-4">Order Summary</h3>
            
            {/* Items */}
            <div className="flex flex-col gap-4 mb-6 border-b border-gray-200 pb-6">
              
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="relative h-10 w-10 shrink-0 bg-white border border-gray-200 rounded overflow-hidden">
                    <Image src="/images/paleta-strawberry.png" alt="Vanilla Bean" fill className="object-contain p-1"  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#00113A]">Vanilla Bean (3 Gallon)</span>
                    <span className="text-[10px] text-gray-500">Qty: 5</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#00113A]">$170.00</span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className="relative h-10 w-10 shrink-0 bg-white border border-gray-200 rounded overflow-hidden">
                    <Image src="/images/paleta-strawberry.png" alt="Dutch Chocolate" fill className="object-contain p-1"  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#00113A]">Dutch Chocolate (3 Gallon)</span>
                    <span className="text-[10px] text-gray-500">Qty: 2</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#00113A]">$70.00</span>
              </div>

            </div>

            {/* Breakdown */}
            <div className="flex flex-col gap-3 mb-6">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold text-[#00113A]">$240.00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Shipping</span>
                <span className="font-bold text-[#00113A]">$5.00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Tax</span>
                <span className="font-bold text-[#00113A]">$19.60</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center border-t border-gray-200 pt-4">
              <span className="font-bold text-[#00113A]">Total</span>
              <span className="font-heading font-bold text-xl text-[#00113A]">$264.60</span>
            </div>

          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button 
            onClick={() => router.push("/products")}
            className="w-full sm:w-auto px-8 py-3 bg-[#002B5C] hover:bg-[#00113A] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors"
          >
            Continue Shopping
          </button>
          <button 
            onClick={() => router.push("/orders/track")}
            className="w-full sm:w-auto px-8 py-3 bg-white hover:bg-gray-50 text-[#002B5C] border-2 border-[#002B5C] text-xs font-bold uppercase tracking-wider rounded transition-colors"
          >
            Track Order
          </button>
        </div>

      </div>
      
    </div>
  );
}
