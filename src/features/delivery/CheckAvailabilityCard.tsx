"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

export function CheckAvailabilityCard() {
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-[576px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-10 relative"
    >
      <div className="p-8 md:p-12 text-center">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#101b4d] mb-3">
          Check Availability
        </h2>
        <p className="text-[#6b7280] text-sm font-medium mb-8">
          Enter your pincode to check if we deliver to your location.
        </p>

        <form className="flex flex-col gap-5 text-left" onSubmit={(e) => e.preventDefault()}>
          
          {/* Pincode Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#101b4d]">
              Pincode <span className="text-[#e6127d]">*</span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-[18px]" />
              <input 
                type="text" 
                placeholder="e.g. 400001" 
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm font-medium text-[#101b4d] focus:outline-none focus:border-[#101b4d] focus:ring-1 focus:ring-[#101b4d] transition-all placeholder:font-normal"
              />
            </div>
          </div>

          {/* City Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#101b4d]">
              City <span className="text-gray-400 font-medium">(Optional)</span>
            </label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="e.g. Mumbai" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 text-sm font-medium text-[#101b4d] focus:outline-none focus:border-[#101b4d] focus:ring-1 focus:ring-[#101b4d] transition-all placeholder:font-normal"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full mt-2 py-4 rounded-xl bg-[#8592B8] hover:bg-[#101b4d] text-white font-bold text-[15px] transition-colors shadow-md hover:shadow-lg"
          >
            Check Availability
          </button>
        </form>
      </div>

      {/* Bottom info section */}
      <div className="bg-[#fafafa] border-t border-gray-100 p-6 text-center">
        <h4 className="text-[#101b4d] font-bold text-xs mb-2">Why do we check pincodes?</h4>
        <p className="text-gray-500 text-[11px] font-medium leading-relaxed px-4 max-w-[400px] mx-auto">
          Ice cream requires strict temperature control. We only deliver to areas where we can guarantee our products will arrive perfectly frozen.
        </p>
      </div>
    </motion.div>
  );
}
