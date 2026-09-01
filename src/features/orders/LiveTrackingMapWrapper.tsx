"use client";

import React from "react";
import dynamic from "next/dynamic";

const LiveTrackingMap = dynamic(() => import("@/features/orders/LiveTrackingMap"), { 
  ssr: false,
  loading: () => <div className="w-full h-[400px] mt-8 bg-gray-50 animate-pulse rounded-xl border border-gray-100 flex items-center justify-center text-gray-400 font-medium">Loading Live Map...</div>
});

export const LiveTrackingMapWrapper = React.memo(function LiveTrackingMapWrapper(props: any) {
  return <LiveTrackingMap {...props} />;
}
