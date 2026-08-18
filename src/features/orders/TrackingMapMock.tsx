import Image from "next/image";
import { Truck, MapPin, Navigation } from "lucide-react";

export function TrackingMapMock() {
  return (
    <div className="relative w-full flex-1 min-h-[300px] rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm mt-8 group">
      {/* Base Map Image */}
      <Image 
        src="/images/tracking-map-bg.png" 
        alt="Tracking Map" 
        fill 
        className="object-cover opacity-80"
        priority
       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />

      {/* Decorative Route Line (SVG overlay) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-md z-10" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path 
          d="M 20,70 Q 30,75 40,65 T 60,50 T 80,30" 
          fill="none" 
          stroke="#101b4d" 
          strokeWidth="1.5" 
          strokeDasharray="4 4" 
          className="animate-[dash_1s_linear_infinite]"
        />
      </svg>

      {/* Start Pin (Store) */}
      <div className="absolute left-[18%] top-[66%] z-20 flex flex-col items-center">
        <div className="bg-[#f5a623] p-1.5 rounded-full shadow-md text-white mb-1">
          <MapPin className="size-4" />
        </div>
        <span className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded shadow text-[10px] font-bold text-[#101b4d]">
          Cresta Hub
        </span>
      </div>

      {/* End Pin (Home) */}
      <div className="absolute left-[78%] top-[26%] z-20 flex flex-col items-center">
        <div className="bg-[#101b4d] p-1.5 rounded-full shadow-md text-white mb-1">
          <MapPin className="size-4" />
        </div>
        <span className="bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded shadow text-[10px] font-bold text-[#101b4d]">
          Delivery Address
        </span>
      </div>

      {/* Moving Truck Icon */}
      <div className="absolute left-[56%] top-[45%] z-30 flex items-center justify-center">
        <div className="bg-white p-2 rounded-full shadow-lg border-2 border-[#101b4d] text-[#101b4d] animate-bounce">
          <Truck className="size-5" />
        </div>
      </div>

      {/* Bottom Left Status Pill */}
      <div className="absolute bottom-4 left-4 z-40 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-gray-100 flex items-center gap-3">
        <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
          <Navigation className="size-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-[#101b4d]">Vehicle 403</span>
          <span className="text-[10px] font-medium text-gray-500">2.1 miles away</span>
        </div>
      </div>

      {/* Top Right Live Indicator */}
      <div className="absolute top-4 right-4 z-40 bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 shadow-md border border-gray-100 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f5a623] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#f5a623]"></span>
        </span>
        <span className="text-[10px] font-bold tracking-wider text-[#f5a623] uppercase">
          Updating Live
        </span>
      </div>
      
      {/* CSS for dashed line animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dash {
          to { stroke-dashoffset: -8; }
        }
      `}} />
    </div>
  );
}
