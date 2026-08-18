"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Create custom icons
const destinationIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const vehicleIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function LiveTrackingMap() {
  const destination: [number, number] = [17.4948, 78.3996]; // KPHB
  const start: [number, number] = [17.4504, 78.3808]; // Cyber Towers
  
  const [currentPos, setCurrentPos] = useState<[number, number]>(start);

  useEffect(() => {
    // Simple animation moving vehicle towards destination
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.02; // Move 2% every tick
      if (progress >= 1) {
        clearInterval(interval);
        setCurrentPos(destination);
      } else {
        const lat = start[0] + (destination[0] - start[0]) * progress;
        const lng = start[1] + (destination[1] - start[1]) * progress;
        setCurrentPos([lat, lng]);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [start, destination]);

  return (
    <div className="w-full h-[400px] mt-4 rounded-3xl overflow-hidden border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-0">
      <MapContainer 
        center={[17.4726, 78.3902]} 
        zoom={14} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {/* Route Line */}
        <Polyline 
          positions={[start, destination]} 
          pathOptions={{ color: '#101b4d', weight: 4, dashArray: '8, 8' }} 
        />

        {/* Destination Marker */}
        <Marker position={destination} icon={destinationIcon}>
          <Popup>
            <div className="text-sm font-bold text-[#101b4d]">Delivery Address</div>
          </Popup>
        </Marker>

        {/* Vehicle Marker */}
        <Marker position={currentPos} icon={vehicleIcon}>
          <Popup>
            <div className="text-sm font-bold text-[#e6127d]">Delivery Vehicle</div>
            <div className="text-xs text-gray-500">In Transit</div>
          </Popup>
        </Marker>
      </MapContainer>
      
      {/* Live Indicator overlay */}
      <div className="absolute top-4 right-4 z-[400] bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-[0_4px_12px_rgb(0,0,0,0.08)] border border-gray-100 flex items-center gap-2.5">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
        <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Live Updates</span>
      </div>
    </div>
  );
}
