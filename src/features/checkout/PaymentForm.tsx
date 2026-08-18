"use client";

import { useState } from "react";
import { CreditCard, Landmark, QrCode } from "lucide-react";

export function PaymentForm() {
  const [selectedMethod, setSelectedMethod] = useState("card");

  return (
    <div className="flex-1 max-w-[760px] w-full flex flex-col h-fit">
      
      <h2 className="font-heading text-xl font-bold text-[#00113A] mb-8">Payment Method</h2>

      {/* Payment Selection Container */}
      <div className="flex flex-col border border-[#00113A] rounded-xl overflow-hidden mb-8">
        
        {/* Credit / Debit Card */}
        <label className={`flex items-center justify-between p-6 cursor-pointer border-b border-gray-200 transition-colors ${selectedMethod === 'card' ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}>
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              <input 
                type="radio" 
                name="payment_method" 
                value="card" 
                checked={selectedMethod === 'card'}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#00113A] transition-all"
              />
              <div className="absolute w-2.5 h-2.5 bg-[#00113A] rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
            <span className="text-sm text-[#00113A] font-medium">Credit / Debit Card</span>
          </div>
          <CreditCard className="size-5 text-gray-400" />
        </label>
        {selectedMethod === 'card' && (
          <div className="px-6 pb-6 pt-2 bg-gray-50 animate-in fade-in slide-in-from-top-2 duration-300 border-b border-gray-200">
            <div className="flex flex-col gap-4">
              <input type="text" placeholder="Card Number (e.g., 4111 1111 1111 1111)" className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#00113A]" />
              <div className="flex gap-4">
                <input type="text" placeholder="MM/YY" className="w-1/2 px-4 py-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#00113A]" />
                <input type="text" placeholder="CVV" className="w-1/2 px-4 py-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#00113A]" />
              </div>
              <input type="text" placeholder="Name on Card" className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#00113A]" />
            </div>
          </div>
        )}

        {/* Net Banking */}
        <label className={`flex items-center justify-between p-6 cursor-pointer border-b border-gray-200 transition-colors ${selectedMethod === 'net_banking' ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}>
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              <input 
                type="radio" 
                name="payment_method" 
                value="net_banking" 
                checked={selectedMethod === 'net_banking'}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#00113A] transition-all"
              />
              <div className="absolute w-2.5 h-2.5 bg-[#00113A] rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
            <span className="text-sm text-[#00113A] font-medium">Net Banking</span>
          </div>
          <Landmark className="size-5 text-gray-400" />
        </label>
        {selectedMethod === 'net_banking' && (
          <div className="px-6 pb-6 pt-2 bg-gray-50 animate-in fade-in slide-in-from-top-2 duration-300 border-b border-gray-200">
            <select className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#00113A] bg-white text-gray-700">
              <option value="">Select your Bank</option>
              <option value="sbi">State Bank of India (SBI)</option>
              <option value="hdfc">HDFC Bank</option>
              <option value="icici">ICICI Bank</option>
              <option value="axis">Axis Bank</option>
              <option value="kotak">Kotak Mahindra Bank</option>
            </select>
          </div>
        )}

        {/* UPI / Mobile Wallets */}
        <label className={`flex items-center justify-between p-6 cursor-pointer transition-colors ${selectedMethod === 'upi' ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}>
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center">
              <input 
                type="radio" 
                name="payment_method" 
                value="upi" 
                checked={selectedMethod === 'upi'}
                onChange={(e) => setSelectedMethod(e.target.value)}
                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#00113A] transition-all"
              />
              <div className="absolute w-2.5 h-2.5 bg-[#00113A] rounded-full opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
            <span className="text-sm text-[#00113A] font-medium">UPI / Mobile Wallets</span>
          </div>
          <QrCode className="size-5 text-gray-400" />
        </label>
        {selectedMethod === 'upi' && (
          <div className="px-6 pb-6 pt-2 bg-gray-50 animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col items-center gap-4">
            <div className="p-6 bg-white border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-4 w-fit">
              <QrCode className="size-32 text-[#00113A]" strokeWidth={1} />
              <span className="text-xs text-[#00113A] font-bold tracking-wider uppercase">Scan to Pay via UPI</span>
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">or enter upi id</span>
            <input type="text" placeholder="e.g. yourname@upi" className="w-full max-w-[300px] px-4 py-3 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#00113A] text-center" />
          </div>
        )}

      </div>

      {/* Billing Address Checkbox */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative flex items-center justify-center mt-0.5 shrink-0">
          <input type="checkbox" defaultChecked className="peer appearance-none w-4 h-4 border-2 border-gray-300 rounded focus:ring-2 focus:ring-[#00113A]/20 checked:bg-[#00113A] checked:border-[#00113A] transition-all" />
          <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-bold text-[#00113A] group-hover:text-[#1a2b7c] transition-colors">
            Billing address is same as shipping address
          </span>
          <span className="text-[11px] text-gray-400">
            G-30 & 31, Aparna Neo Mall, Sy. No- 282 P, Nallagandla Aparna Neo Mall, Hyderabad
          </span>
        </div>
      </label>

    </div>
  );
}
