"use client";

import { Truck, Clock, MapPin, Settings, X, Calendar, Phone } from "lucide-react";
import React, { useState, useEffect } from "react";

export const ShipmentDetails = React.memo(function ShipmentDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Body scroll lock
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  return (
    <>
      <div className="bg-white rounded-3xl p-6 lg:p-8 flex flex-col h-auto border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative">
      
      <h2 className="font-heading font-bold text-[#101b4d] text-xl mb-8 tracking-wide">
        Shipment Details
      </h2>

      <div className="flex flex-col gap-8 flex-1">
        
        {/* Courier */}
        <div className="flex gap-5 group">
          <div className="bg-blue-50 p-3.5 rounded-2xl text-blue-600 transition-colors h-fit">
            <Truck className="size-6" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Courier
            </span>
            <span className="text-base font-bold text-[#101b4d] tracking-tight">
              Cresta Logistics
            </span>
          </div>
        </div>

        {/* Last Update */}
        <div className="flex gap-5 group">
          <div className="bg-amber-50 p-3.5 rounded-2xl text-amber-500 transition-colors h-fit">
            <Clock className="size-6" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Last Update
            </span>
            <span className="text-base font-bold text-[#101b4d] tracking-tight">
              Departed Regional Hub
            </span>
            <span className="text-xs font-semibold text-gray-500 mt-1">
              10:42 AM
            </span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="flex gap-5 group">
          <div className="bg-emerald-50 p-3.5 rounded-2xl text-emerald-600 transition-colors h-fit">
            <MapPin className="size-6" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Delivery Address
            </span>
            <span className="text-sm font-semibold text-[#101b4d] leading-relaxed">
              125 Logistical Blvd<br />
              Suite 400<br />
              Los Angeles, CA 90001
            </span>
          </div>
        </div>

      </div>

      {/* Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full mt-8 shrink-0 bg-[#101b4d] text-white font-bold text-sm py-4 rounded-xl hover:bg-[#e6127d] transition-colors duration-300 flex items-center justify-center gap-2 shadow-sm"
      >
        <Settings className="size-4" />
        <span className="tracking-wide uppercase">Manage Delivery</span>
      </button>
    </div>

    {/* Manage Delivery Modal */}
    {isModalOpen && (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <div 
          className="absolute inset-0 bg-white/20 backdrop-blur-md"
          onClick={() => setIsModalOpen(false)}
        />
        <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 flex flex-col animate-in fade-in zoom-in duration-200">
          <button 
            onClick={() => setIsModalOpen(false)}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-800 transition-colors"
          >
            <X className="size-6" />
          </button>

          <h3 className="font-heading font-bold text-[#101b4d] text-2xl mb-2">
            Manage Delivery
          </h3>
          <p className="text-gray-500 text-sm mb-8">
            Select how you would like to manage your current order.
          </p>

          <div className="flex flex-col gap-4">
            <button className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-[#101b4d] hover:shadow-md transition-all group text-left">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-xl group-hover:bg-[#101b4d] group-hover:text-white transition-colors">
                <Calendar className="size-5" />
              </div>
              <div>
                <div className="font-bold text-[#101b4d]">Reschedule Delivery</div>
                <div className="text-xs text-gray-500 mt-0.5">Choose a different date or time</div>
              </div>
            </button>

            <button className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-[#101b4d] hover:shadow-md transition-all group text-left">
              <div className="bg-green-50 text-green-600 p-3 rounded-xl group-hover:bg-[#101b4d] group-hover:text-white transition-colors">
                <Phone className="size-5" />
              </div>
              <div>
                <div className="font-bold text-[#101b4d]">Contact Courier</div>
                <div className="text-xs text-gray-500 mt-0.5">Call the delivery driver directly</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
});
