"use client";

import { useState } from "react";
import Image from "next/image";

export function UpiPaymentForm() {
  const [upiId, setUpiId] = useState("");
  const [verified, setVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const handleVerify = () => {
    if (!upiId) return;
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 1000);
  };

  return (
    <div className="flex-1 max-w-[752px] w-full flex flex-col gap-6 h-fit">
      
      {/* Enter UPI ID Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm flex flex-col gap-4 relative overflow-hidden">
        {/* Left gold border accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8c7322]" />
        
        <h2 className="text-[#00113A] font-bold text-lg">Enter UPI ID</h2>
        <p className="text-gray-500 text-sm">
          Enter your Virtual Payment Address (VPA) to receive a payment request on your app.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <input 
            type="text" 
            placeholder="e.g. username@bank"
            value={upiId}
            onChange={(e) => {
              setUpiId(e.target.value);
              setVerified(false);
            }}
            className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#00113A] focus:ring-1 focus:ring-[#00113A] transition-all"
          />
          <button 
            onClick={handleVerify}
            disabled={!upiId || verified || verifying}
            className={`px-8 py-3 rounded-lg text-sm font-bold transition-colors shrink-0 ${
              verified 
                ? 'bg-green-50 text-green-600 border border-green-200'
                : 'bg-gray-100 text-[#00113A] hover:bg-gray-200'
            }`}
          >
            {verifying ? 'Verifying...' : verified ? 'Verified ✓' : 'Verify'}
          </button>
        </div>
      </div>

      {/* Mobile Wallets Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm flex flex-col gap-6">
        <h2 className="text-[#00113A] font-bold text-lg">Mobile Wallets</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          {/* Google Pay */}
          <button className="flex flex-col items-center justify-center gap-3 p-6 border border-gray-200 rounded-xl hover:border-[#00113A] hover:bg-gray-50 transition-all group">
            <div className="w-10 h-10 relative opacity-70 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-gray-100 rounded-md">
              <span className="font-bold text-gray-500 text-xs">GPay</span>
            </div>
            <span className="text-xs font-bold text-gray-600 group-hover:text-[#00113A]">Google Pay</span>
          </button>

          {/* PhonePe */}
          <button className="flex flex-col items-center justify-center gap-3 p-6 border border-gray-200 rounded-xl hover:border-[#00113A] hover:bg-gray-50 transition-all group">
            <div className="w-10 h-10 relative opacity-70 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-gray-100 rounded-md">
              <span className="font-bold text-gray-500 text-xs text-center leading-tight">Phone<br/>Pe</span>
            </div>
            <span className="text-xs font-bold text-gray-600 group-hover:text-[#00113A]">PhonePe</span>
          </button>

          {/* Paytm */}
          <button className="flex flex-col items-center justify-center gap-3 p-6 border border-gray-200 rounded-xl hover:border-[#00113A] hover:bg-gray-50 transition-all group">
            <div className="w-10 h-10 relative opacity-70 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-gray-100 rounded-md">
              <span className="font-bold text-gray-500 text-xs">Paytm</span>
            </div>
            <span className="text-xs font-bold text-gray-600 group-hover:text-[#00113A]">Paytm</span>
          </button>

          {/* Amazon Pay */}
          <button className="flex flex-col items-center justify-center gap-3 p-6 border border-gray-200 rounded-xl hover:border-[#00113A] hover:bg-gray-50 transition-all group">
            <div className="w-10 h-10 relative opacity-70 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-gray-100 rounded-md">
              <span className="font-bold text-gray-500 text-[10px] text-center leading-tight">Amazon<br/>Pay</span>
            </div>
            <span className="text-xs font-bold text-gray-600 group-hover:text-[#00113A]">Amazon Pay</span>
          </button>

        </div>
      </div>

    </div>
  );
}
