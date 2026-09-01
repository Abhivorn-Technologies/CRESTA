"use client";
import React from "react";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { calculateOrderTotals } from "@/lib/calculations";

export const OrderSummary = React.memo(function OrderSummary() {
  const router = useRouter();
  const { cart, cartCount, setBuyNowItem } = useCart();
  
  const totals = calculateOrderTotals(
    cart.map(i => ({ price: i.product.price, quantity: i.quantity })),
    null // Address not selected in cart yet
  );

  return (
    <div className="w-full lg:w-[368px] shrink-0 bg-[#002B5C] rounded-[12px] p-6 lg:p-8 flex flex-col shadow-[0_30px_60px_rgba(0,43,92,0.15)] h-fit">
      
      <h2 className="text-white font-heading font-bold text-lg mb-6">Order Summary</h2>

      {/* Breakdown */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center text-xs">
          <span className="text-white/70">Subtotal</span>
          <span className="text-white font-bold">₹{totals.productSubtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-white/70">Estimated GST (5%)</span>
          <span className="text-white font-bold">₹{totals.gstAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-white/70">Delivery (Estimate)</span>
          {totals.isFreeDelivery ? (
             <span className="text-green-400 font-bold">Free Delivery</span>
          ) : (
             <span className="text-white font-bold">₹{totals.deliveryCharge.toFixed(2)}</span>
          )}
        </div>
      </div>

      <div className="w-full h-px bg-white/10 mb-6" />

      {/* Grand Total */}
      <div className="flex justify-between items-end mb-8">
        <span className="text-white font-bold">Total</span>
        <div className="flex items-baseline gap-1">
          <span className="text-white/70 text-[10px]">INR</span>
          <span className="text-[#f5a623] text-2xl font-bold font-heading tracking-tight">₹{totals.grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Coupon Code */}
      <div className="flex flex-col gap-2 mb-8">
        <label className="text-xs text-white/70">Have a coupon code?</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Enter code" 
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/50 focus:outline-none focus:border-[#F7CA00] transition-colors"
          />
          <button className="bg-white text-[#00113A] font-bold text-xs px-5 rounded-lg hover:bg-gray-100 transition-colors">
            Apply
          </button>
        </div>
      </div>

      {/* Checkout Button */}
      <button 
        onClick={() => {
          setBuyNowItem(null);
          router.push('/checkout');
        }}
        disabled={cartCount === 0}
        className="w-full bg-[#F7CA00] hover:bg-[#F2C200] text-[#00113A] font-bold py-3.5 px-6 rounded-lg shadow-sm border border-[#F2C200] transition-colors mb-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:shadow-none"
      >
        <span>Proceed to Checkout</span>
      </button>

      {/* Terms */}
      <p className="text-center text-[10px] text-white/50 max-w-[280px] mx-auto">
        By proceeding, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
});
