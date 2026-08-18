"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export function OrderSummary() {
  const router = useRouter();
  const { cartTotal, cartCount } = useCart();
  const gst = cartTotal * 0.18;
  const delivery = cartTotal > 0 ? 150 : 0;
  const grandTotal = cartTotal + gst + delivery;
  return (
    <div className="bg-[#101b4d] rounded-[24px] p-8 text-white h-full flex flex-col drop-shadow-xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#1a2b7c] to-transparent rounded-full blur-3xl opacity-50 -mr-20 -mt-20 pointer-events-none" />

      {/* Breakdown */}
      <div className="flex flex-col gap-4 text-sm font-medium text-white/80 mb-6 relative z-10">
        <div className="flex justify-between items-center">
          <span>Subtotal</span>
          <span className="text-white">₹{cartTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>GST (18%)</span>
          <span className="text-white">₹{gst.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Delivery Charge</span>
          <span className="text-white">₹{delivery.toFixed(2)}</span>
        </div>
      </div>

      <div className="w-full h-px bg-white/20 mb-8 relative z-10" />

      {/* Grand Total */}
      <div className="flex justify-between items-center mb-10 relative z-10">
        <span className="font-semibold">Grand Total</span>
        <span className="font-heading font-bold text-3xl text-[#f5a623]">
          ₹{grandTotal.toFixed(2)}
        </span>
      </div>

      {/* Coupon Code */}
      <div className="flex flex-col gap-2 mb-10 relative z-10">
        <label className="text-xs text-white/70">Have a coupon code?</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Enter code" 
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/50 focus:outline-none focus:border-[#f5a623] transition-colors"
          />
          <button className="bg-white text-[#101b4d] font-bold text-xs px-5 rounded-lg hover:bg-gray-100 transition-colors">
            Apply
          </button>
        </div>
      </div>

      {/* Checkout Button */}
      <button 
        onClick={() => router.push('/checkout')}
        disabled={cartCount === 0}
        className="w-full bg-[#f5a623] text-[#101b4d] font-bold text-sm py-4 rounded-xl hover:bg-[#ffb53a] hover:shadow-lg transition-all mb-4 relative z-10 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:shadow-none"
      >
        <span>Proceed to Checkout</span>
        <span>→</span>
      </button>

      {/* Terms */}
      <p className="text-center text-[10px] text-white/50 relative z-10 max-w-[280px] mx-auto">
        By proceeding, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}
