"use client";

import { useEffect, useState, useRef } from "react";
import { MapPin, Navigation, KeyRound } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useRouter } from "next/navigation";

// Create custom icons to avoid Next.js image path issues with default Leaflet icons
const driverIconHtml = `<div style="background-color: #e6127d; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg></div>`;
const destIconHtml = `<div style="background-color: #10b981; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`;
const storeIconHtml = `<div style="background-color: #F7CA00; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00113A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg></div>`;

const driverIcon = L.divIcon({ html: driverIconHtml, className: "", iconSize: [32, 32], iconAnchor: [16, 16] });
const destIcon = L.divIcon({ html: destIconHtml, className: "", iconSize: [32, 32], iconAnchor: [16, 32] });
const storeIcon = L.divIcon({ html: storeIconHtml, className: "", iconSize: [32, 32], iconAnchor: [16, 32] });

const STORE_LOC = { lat: 17.4665816, lng: 78.3099937 };

// Component to dynamically fit bounds
function MapUpdater({ driverLoc, destLoc }: { driverLoc: any, destLoc: any }) {
  const map = useMap();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (driverLoc && destLoc && !hasInitialized.current) {
      const bounds = L.latLngBounds(
        [driverLoc.lat, driverLoc.lng], 
        [destLoc.lat, destLoc.lng]
      );
      // Extend bounds to always include the store so the user sees where it came from
      bounds.extend([STORE_LOC.lat, STORE_LOC.lng]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      hasInitialized.current = true;
    }
  }, [driverLoc, destLoc, map]);
  return null;
}

export default function LiveTrackingMap({ 
  orderId, 
  initialLocation, 
  otp 
}: { 
  orderId: string, 
  initialLocation?: { lat: number, lng: number },
  otp?: string
}) {
  const router = useRouter();
  const [location, setLocation] = useState(initialLocation);
  const [destination, setDestination] = useState<{lat: number, lng: number} | null>(null);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const fetchLocation = async () => {
      if (!orderId || orderId === "undefined") return;
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        
        // Dynamic Update: If the driver confirmed the OTP, refresh the page to hide the map!
        if (data.order?.orderStatus === "delivered") {
          router.refresh();
          return; // Stop polling here
        }
        
        if (data.order?.liveLocation) {
          setLocation(data.order.liveLocation);
        }
        if (data.order?.shippingAddress) {
          setDestination({
            lat: data.order.shippingAddress.lat || 17.4834,
            lng: data.order.shippingAddress.lng || 78.3182
          });
        }
        
        // Setup OTP Countdown (15 mins from when it went out for delivery for quick-commerce)
        if (data.order?.updatedAt) {
          const startTime = new Date(data.order.updatedAt).getTime();
          const expireTime = startTime + 15 * 60 * 1000;
          
          const updateTimer = () => {
            const now = new Date().getTime();
            const diff = expireTime - now;
            if (diff <= 0) {
              setTimeLeft("Expired");
            } else {
              const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
              const seconds = Math.floor((diff % (1000 * 60)) / 1000);
              setTimeLeft(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
            }
          };
          updateTimer();
          setInterval(updateTimer, 1000);
        }
        
        // Fetch Real-Road Route Line (OSRM)
        if (data.order?.liveLocation && data.order?.shippingAddress?.lat) {
          const routeRes = await fetch(
            `https://router.project-osrm.org/route/v1/driving/${data.order.liveLocation.lng},${data.order.liveLocation.lat};${data.order.shippingAddress.lng},${data.order.shippingAddress.lat}?overview=full&geometries=geojson`
          );
          const routeData = await routeRes.json();
          if (routeData.routes && routeData.routes[0]) {
            // GeoJSON returns [lng, lat], Leaflet needs [lat, lng]
            const coords = routeData.routes[0].geometry.coordinates.map((c: any) => [c[1], c[0]]);
            setRouteCoords(coords);
          }
        }
      } catch (e) {
        console.error("Failed to poll location");
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 3000);
    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <div className="flex flex-col gap-4 mb-8">
      {/* Premium OTP Display for Customer */}
      {otp && (
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-[#00113A] p-[2px] rounded-2xl shadow-sm">
          <div className="bg-white rounded-[14px] p-5 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-pink-50 p-4 rounded-xl shrink-0 border border-pink-100">
                <KeyRound className="size-6 text-[#e6127d]" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-[#00113A] text-lg">Delivery OTP</h3>
                <p className="text-[13px] text-gray-500 font-medium">Share this secure code with your driver</p>
                {timeLeft && (
                  <span className={`text-xs font-bold mt-1 ${timeLeft === 'Expired' ? 'text-red-500' : 'text-orange-500 animate-pulse'}`}>
                    {timeLeft === 'Expired' ? 'OTP Expired' : `Expires in ${timeLeft}`}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="text-4xl font-heading font-black text-[#101b4d] tracking-[0.25em] bg-gray-50 px-8 py-4 rounded-xl border border-gray-200 shadow-inner">
                {otp}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Map */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-3">
        <div className="flex justify-between items-center px-2">
          <h3 className="font-bold text-[#00113A] flex items-center gap-2">
            <Navigation className="size-4 text-blue-500" /> Live Driver Tracking
          </h3>
          <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full animate-pulse border border-green-200">
            Live
          </span>
        </div>
        
        <div className="w-full h-[300px] md:h-[400px] bg-gray-100 rounded-lg relative overflow-hidden border border-gray-200">
          {location ? (
            <MapContainer 
              center={[location.lat, location.lng]} 
              zoom={15} 
              style={{ height: '100%', width: '100%', zIndex: 10 }}
            >
              <TileLayer
                url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
                attribution="&copy; Google Maps"
              />
              
              {/* Store Marker */}
              <Marker position={[STORE_LOC.lat, STORE_LOC.lng]} icon={storeIcon}>
                <Tooltip direction="top" offset={[0, -16]}>
                  <span className="font-bold text-[#F7CA00]">Cresta Global Hub</span>
                </Tooltip>
              </Marker>

              {/* Dynamic Routing Line */}
              {routeCoords.length > 0 && (
                <Polyline 
                  positions={routeCoords} 
                  color="#e6127d" 
                  weight={5} 
                  opacity={0.8}
                  dashArray="10, 10" 
                />
              )}

              {/* Driver Marker */}
              <Marker position={[location.lat, location.lng]} icon={driverIcon}>
                <Tooltip permanent direction="top" offset={[0, -16]}>
                  <span className="font-bold text-[#e6127d]">Driver is on the way!</span>
                </Tooltip>
              </Marker>

              {/* Destination Marker */}
              {destination && (
                <Marker position={[destination.lat, destination.lng]} icon={destIcon}>
                  <Tooltip direction="top" offset={[0, -16]}>
                    <span className="font-bold text-[#00113A]">Delivery Location</span>
                  </Tooltip>
                </Marker>
              )}

              <MapUpdater driverLoc={location} destLoc={destination} />
            </MapContainer>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 bg-[#f8f9fa]">
              <MapPin className="size-10 mb-3 opacity-50 animate-bounce" />
              <p className="font-medium text-sm">Connecting to Driver GPS...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
