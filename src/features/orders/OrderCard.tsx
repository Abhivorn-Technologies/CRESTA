"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Navigation2, X, Lock } from "lucide-react";
import { Order } from "@/data/orders";

interface OrderCardProps {
  order: Order;
  onOrderUpdate?: (id: string, status: string) => void;
}

export function OrderCard({ order, onOrderUpdate }: OrderCardProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    // Track time using updatedAt so the 5 minutes starts AFTER checkout completion
    const startTime = order.updatedAt || order.createdAt;
    if (!startTime || (order.dbStatus !== "processing" && order.dbStatus !== "pending")) return;

    const createdTime = new Date(startTime).getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const elapsed = now - createdTime;
      const remaining = (5 * 60 * 1000) - elapsed;
      if (remaining > 0) {
        setTimeLeft(remaining);
      } else {
        setTimeLeft(0);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [order.createdAt, order.dbStatus]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const canCancel = timeLeft !== null && timeLeft > 0;
  const isPastCancelWindow = timeLeft === 0;

  const handleCancelClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowCancelModal(true);
    setCancelError("");
  };

  const confirmCancel = async () => {
    setIsCancelling(true);
    setCancelError("");
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: "cancelled" })
      });
      if (res.ok) {
        setIsCancelling(false);
        setShowCancelModal(false);
        if (onOrderUpdate) {
          onOrderUpdate(order.id, "Cancelled");
        } else {
          window.location.reload();
        }
      } else {
        setCancelError("Failed to cancel order. Please try again.");
        setIsCancelling(false);
      }
    } catch (e) {
      console.error(e);
      setCancelError("Something went wrong. Please check your connection.");
      setIsCancelling(false);
    }
  };

  const getStatusDisplay = () => {
    if (order.status === "Delivered") {
      return { dot: "bg-[#26a541] shadow-[0_0_8px_rgba(38,165,65,0.4)]", title: `Delivered on ${order.statusTime}`, subtitle: "Your item has been delivered" };
    }
    if (order.status === "Cancelled") {
      return { dot: "bg-[#ff6161] shadow-[0_0_8px_rgba(255,97,97,0.4)]", title: `Cancelled on ${order.statusTime}`, subtitle: "Your order was cancelled." };
    }
    return { dot: "bg-[#f5a623] shadow-[0_0_8px_rgba(245,166,35,0.4)]", title: `Delivery expected by ${order.statusTime}`, subtitle: "Your order is on the way" };
  };

  const status = getStatusDisplay();

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (showCancelModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [showCancelModal]);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-4 sm:p-7 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all relative group cursor-pointer overflow-hidden">
        
        {/* Subtle hover effect bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#101b4d] opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Clickable Overlay to go to Details */}
        <Link href={`/orders/${order.id}`} className="absolute inset-0 z-0" aria-label="View Order Details" />

        {/* Top/Left Section (Image & Details) */}
        <div className="flex flex-row gap-3 sm:gap-6 flex-1 w-full sm:w-auto">
          {/* Image */}
          <div className="relative w-20 h-20 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center bg-[#f8f9fa] rounded-xl border border-gray-100 z-10 pointer-events-none shadow-sm group-hover:shadow-md transition-shadow">
            <Image 
              src={order.image} 
              alt={order.items}
              fill
              className="object-contain p-2"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
            />
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col gap-1 sm:gap-1.5 z-10 pointer-events-none justify-center">
            <h3 className="text-sm sm:text-[16px] font-bold text-[#101b4d] line-clamp-2 leading-snug group-hover:text-[#e6127d] transition-colors">
              {order.items}
            </h3>
            <div className="flex flex-col gap-0.5 sm:gap-1 mt-0.5 sm:mt-1">
              <span className="text-[10px] sm:text-xs font-semibold text-gray-400 uppercase tracking-wider">Order ID</span>
              <span className="text-[11px] sm:text-sm font-medium text-gray-700 font-mono bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded w-fit truncate max-w-[150px] sm:max-w-none">{order.id}</span>
            </div>
            {/* Mobile Price */}
            <div className="flex sm:hidden mt-1 z-10 pointer-events-none items-center justify-start">
              <span className="text-[15px] font-bold text-[#101b4d]">₹{order.totalAmount.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Price (Desktop Right) */}
        <div className="hidden sm:flex w-24 shrink-0 z-10 pointer-events-none items-center justify-center">
          <span className="text-[18px] font-bold text-[#101b4d]">₹{order.totalAmount.toFixed(0)}</span>
        </div>

        {/* Status & Actions (Bottom on Mobile, Far Right on Desktop) */}
        <div className="w-full sm:w-[280px] shrink-0 flex flex-col gap-3 z-10 justify-center border-t sm:border-t-0 border-gray-100/80 pt-4 sm:pt-0 mt-2 sm:mt-0">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${status.dot}`} />
              <span className="text-[13px] sm:text-[14px] font-bold text-gray-900 leading-none">{status.title}</span>
            </div>
            <p className="text-[12px] sm:text-[13px] text-gray-500 ml-4.5 sm:ml-5.5 font-medium leading-tight">
              {status.subtitle}
            </p>
          </div>

          <div className="ml-0 sm:ml-5.5 flex items-center gap-2 sm:gap-3 mt-1 sm:mt-1">
            {order.status === "Delivered" && (
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#101b4d] text-[#101b4d] text-sm font-bold rounded-lg hover:bg-[#101b4d] hover:text-white transition-all shadow-sm relative z-20 w-full sm:w-auto">
                <Star className="size-4" />
                Rate & Review
              </button>
            )}
            
            {(order.status === "Upcoming" || order.status === "Out for Delivery") && (
              <div className="flex flex-row gap-2 sm:gap-3 relative z-20 w-full sm:w-auto">
                <Link 
                  href={`/orders/${order.id}`} 
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#101b4d] text-white text-[13px] sm:text-sm font-bold rounded-lg hover:bg-[#e6127d] transition-all shadow-sm shadow-[#101b4d]/20 hover:shadow-md hover:-translate-y-0.5 flex-1 sm:flex-none h-10"
                >
                  <Navigation2 className="size-3.5 sm:size-4" />
                  Track
                </Link>
                {canCancel && (
                  <button 
                    onClick={handleCancelClick}
                    disabled={isCancelling}
                    className="flex items-center justify-center gap-1 px-3 sm:px-4 py-2 bg-white border border-gray-200 text-gray-700 text-[13px] sm:text-sm font-bold rounded-lg hover:border-red-500 hover:text-red-500 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex-1 sm:flex-none h-10 group"
                  >
                    <X className="size-3.5 sm:size-4 transition-colors" />
                    Cancel
                    <span className="text-[10px] sm:text-[11px] font-mono font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded ml-0.5 sm:ml-1 group-hover:bg-red-100">{formatTime(timeLeft!)}</span>
                  </button>
                )}
                {isPastCancelWindow && (order.dbStatus === "processing" || order.dbStatus === "pending") && (
                  <div className="relative group flex-1 sm:flex-none">
                    <div className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 text-gray-500 text-[12px] sm:text-[13px] font-bold rounded-lg cursor-not-allowed h-10 select-none">
                      <Lock className="size-3.5" />
                      Prep Started
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-[220px] p-2.5 bg-[#101b4d] text-white text-[11px] leading-tight text-center rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                      Cancellation window (5m) has closed. Your order is now being prepared for delivery.
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#101b4d]"></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative z-[101] flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
              <X className="size-6 text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-[#101b4d] mb-2">Cancel Order?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            
            {cancelError && (
              <p className="text-sm text-red-500 font-bold mb-4 bg-red-50 py-2 px-3 rounded-lg w-full">{cancelError}</p>
            )}

            <div className="flex w-full gap-3">
              <button 
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                No, Keep It
              </button>
              <button 
                onClick={confirmCancel}
                disabled={isCancelling}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isCancelling ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
