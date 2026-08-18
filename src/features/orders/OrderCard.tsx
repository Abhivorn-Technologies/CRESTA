"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Navigation2, X } from "lucide-react";
import { Order } from "@/data/orders";

interface OrderCardProps {
  order: Order;
  onOrderUpdate?: (id: string, status: string) => void;
}

export function OrderCard({ order, onOrderUpdate }: OrderCardProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelError, setCancelError] = useState("");

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
      <div className="flex flex-col sm:flex-row gap-6 p-5 sm:p-7 border-b border-gray-100 hover:bg-slate-50/50 transition-colors bg-white relative group cursor-pointer overflow-hidden">
        
        {/* Subtle hover effect bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#101b4d] opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Clickable Overlay to go to Details */}
        <Link href={`/orders/${order.id}`} className="absolute inset-0 z-0" aria-label="View Order Details" />

        {/* Image */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center bg-[#f8f9fa] rounded-xl border border-gray-100 z-10 pointer-events-none shadow-sm group-hover:shadow-md transition-shadow">
          <Image 
            src={order.image} 
            alt={order.items}
            fill
            className="object-contain p-2"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
          />
        </div>

        {/* Details (Middle Left) */}
        <div className="flex-1 flex flex-col gap-1.5 z-10 pointer-events-none min-w-[200px] justify-center">
          <h3 className="text-[16px] font-bold text-[#101b4d] line-clamp-2 leading-snug group-hover:text-[#e6127d] transition-colors">
            {order.items}
          </h3>
          <div className="flex flex-col gap-1 mt-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Order ID</span>
            <span className="text-sm font-medium text-gray-700 font-mono bg-gray-100 px-2 py-0.5 rounded w-fit">{order.id}</span>
          </div>
        </div>

        {/* Price (Middle Right) */}
        <div className="w-24 shrink-0 z-10 pointer-events-none flex items-center justify-start sm:justify-center">
          <span className="text-[18px] font-bold text-[#101b4d]">₹{order.totalAmount.toFixed(0)}</span>
        </div>

        {/* Status & Actions (Far Right) */}
        <div className="w-full sm:w-[280px] shrink-0 flex flex-col gap-3 z-10 justify-center">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <div className={`w-3 h-3 rounded-full ${status.dot}`} />
              <span className="text-[14px] font-bold text-gray-900">{status.title}</span>
            </div>
            <p className="text-[13px] text-gray-500 ml-5.5 font-medium">
              {status.subtitle}
            </p>
          </div>

          <div className="ml-5.5 flex items-center gap-3 mt-1">
            {order.status === "Delivered" && (
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#101b4d] text-[#101b4d] text-sm font-bold rounded-lg hover:bg-[#101b4d] hover:text-white transition-all shadow-sm relative z-20 w-full sm:w-auto">
                <Star className="size-4" />
                Rate & Review
              </button>
            )}
            
            {(order.status === "Upcoming" || order.status === "Out for Delivery") && (
              <div className="flex flex-row gap-3 relative z-20 w-full sm:w-auto">
                <Link 
                  href="/orders/track" 
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#101b4d] text-white text-sm font-bold rounded-lg hover:bg-[#e6127d] transition-all shadow-sm shadow-[#101b4d]/20 hover:shadow-md hover:-translate-y-0.5 flex-1 sm:flex-none"
                >
                  <Navigation2 className="size-4" />
                  Track
                </Link>
                <button 
                  onClick={handleCancelClick}
                  disabled={isCancelling}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-red-500 text-red-500 text-sm font-bold rounded-lg hover:bg-red-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 flex-1 sm:flex-none"
                >
                  <X className="size-4" />
                  Cancel
                </button>
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
