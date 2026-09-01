"use client";

import { ShieldCheck, Plus, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PaymentMethodType } from "./PaymentContainer";

interface PaymentFormProps {
  selectedMethod: PaymentMethodType;
  onSelectMethod: (method: PaymentMethodType) => void;
}

export function PaymentForm({ selectedMethod, onSelectMethod }: PaymentFormProps) {
  return (
    <div className="flex-1 max-w-[760px] w-full h-fit flex flex-col gap-6">
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 md:p-6 border-b border-gray-100 bg-[#f9fafb] flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/checkout"
              className="p-2 -ml-2 rounded-lg hover:bg-gray-200/50 text-gray-500 hover:text-[#00113A] transition-colors"
              title="Back to Shipping"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <h2 className="font-heading text-xl font-bold text-[#00113A]">Payment method</h2>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full border border-green-100">
            <ShieldCheck className="size-3.5 text-green-600" />
            <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">Secure</span>
          </div>
        </div>

        <div className="p-5 md:p-6 flex flex-col gap-4">
          
          <h3 className="font-bold text-[#00113A] mb-2 text-sm">Another payment method</h3>

          <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden">
            
            {/* Razorpay Online Payment Option */}
            <div 
              className={`relative p-4 transition-all ${
                selectedMethod === "online" 
                  ? "bg-gray-50" 
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <label className="flex items-start gap-3 cursor-pointer w-full">
                <div className="flex items-center justify-center mt-1 shrink-0">
                  <input 
                    type="radio" 
                    name="paymentSelection"
                    checked={selectedMethod === "online"}
                    onChange={() => onSelectMethod("online")}
                    className="w-4 h-4 text-[#e6127d] border-gray-300 focus:ring-[#e6127d]" 
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <span className={`font-bold ${selectedMethod === "online" ? "text-[#00113A]" : "text-gray-700"} mb-2`}>
                    Credit or debit card / UPI / Netbanking
                  </span>
                  
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-[#1434CB]">VISA</div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-[#EB001B]">MASTERCARD</div>
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-[#F37021]">RUPAY</div>
                    <div className="text-xs text-gray-500 ml-2 font-medium">Powered by Razorpay</div>
                  </div>

                  {selectedMethod === "online" && (
                    <div className="mt-2 text-sm text-gray-600 bg-white p-4 rounded-lg border border-gray-100 flex flex-col gap-3">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="size-5 text-green-500 shrink-0 mt-0.5" />
                        <p>
                          You will be securely redirected to <strong>Razorpay</strong> to complete your purchase. 
                        </p>
                      </div>
                      <div className="pl-8 text-xs text-gray-500">
                        All payment options including <strong>Cards, UPI (GPay, PhonePe), Netbanking (All Indian Banks), Wallets, and EMI</strong> will be available for you to select inside the secure Razorpay window on the next step.
                      </div>
                    </div>
                  )}

                </div>
              </label>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gray-200" />

            {/* Cash on Delivery Option */}
            <div 
              className={`relative p-4 transition-all ${
                selectedMethod === "cod" 
                  ? "bg-gray-50" 
                  : "bg-white hover:bg-gray-50"
              }`}
            >
              <label className="flex items-start gap-3 cursor-pointer w-full">
                <div className="flex items-center justify-center mt-1 shrink-0">
                  <input 
                    type="radio" 
                    name="paymentSelection"
                    checked={selectedMethod === "cod"}
                    onChange={() => onSelectMethod("cod")}
                    className="w-4 h-4 text-[#e6127d] border-gray-300 focus:ring-[#e6127d]" 
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <span className={`font-bold ${selectedMethod === "cod" ? "text-[#00113A]" : "text-gray-700"} mb-1`}>
                    Cash on Delivery / Pay on Delivery
                  </span>
                  <p className="text-sm text-gray-600">
                    Cash, UPI and Cards accepted upon delivery.
                  </p>

                  {selectedMethod === "cod" && (
                    <div className="mt-3 text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-100">
                      Please note: You will pay the courier when your order arrives. Please keep exact change ready if paying by cash.
                    </div>
                  )}
                </div>
              </label>
            </div>

          </div>
          
        </div>
      </div>
      
    </div>
  );
}
