import { Navbar } from "@/components/layout/Navbar";
import { TrackingProgressBar } from "@/features/orders/TrackingProgressBar";
import { LiveTrackingMapWrapper } from "@/features/orders/LiveTrackingMapWrapper";
import { ShipmentDetails } from "@/features/orders/ShipmentDetails";

export default function OrderTrackingPage() {
  return (
    <main className="flex h-screen overflow-hidden flex-col bg-white">
      <Navbar />
      
      <div className="flex-1 w-full max-w-[1280px] mx-auto px-6 pt-28 pb-6 flex flex-col min-h-0">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6 border-b border-gray-100 pb-6 shrink-0">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-[#101b4d] tracking-tight mb-3">
              Track Order
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">Order #CO 88291</span>
              <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm border border-blue-100">
                In Transit
              </span>
            </div>
          </div>
          
          <div className="flex flex-col md:items-end">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Estimated Delivery
            </span>
            <span className="text-2xl font-bold text-[#101b4d]">
              30 Min
            </span>
          </div>
        </div>

        {/* Two Column Layout for Map and Details */}
        <div className="flex-1 flex flex-col lg:flex-row gap-8 items-stretch min-h-0 overflow-y-auto pb-4">
          
          {/* Left Column - Progress & Map */}
          <div className="flex-1 lg:max-w-[760px] flex flex-col border border-gray-100/60 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] min-h-0 bg-white">
            <TrackingProgressBar />
            <LiveTrackingMapWrapper />
          </div>

          {/* Right Column - Shipment Details */}
          <div className="w-full lg:w-[400px] flex-shrink-0 h-full">
            <ShipmentDetails />
          </div>

        </div>

      </div>
    </main>
  );
}
