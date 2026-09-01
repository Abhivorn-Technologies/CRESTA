"use client";

import Image from "next/image";
import { Lock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { calculateOrderTotals } from "@/lib/calculations";

import { toast } from "sonner";

export function CheckoutSummary() {
  const { cart, buyNowItem } = useCart();
  
  const activeCart = buyNowItem ? [buyNowItem] : cart;

  const totals = calculateOrderTotals(
    activeCart.map(i => ({ price: i.product.price, quantity: i.quantity })),
    null // User hasn't finalized address yet in this view, so delivery is an estimate
  );

  return (
    <div className="w-full lg:w-[368px] shrink-0 bg-[#002B5C] rounded-[12px] p-6 lg:p-8 flex flex-col shadow-[0_30px_60px_rgba(0,43,92,0.15)] h-fit">
      
      <h2 className="text-white font-heading font-bold text-lg mb-6">Order Summary</h2>

      {/* Cart Items */}
      <div className="flex flex-col gap-6 mb-8 border-b border-white/10 pb-8">
        
        {activeCart.map((item) => (
          <div key={item.product.id} className="flex items-start gap-4">
            <div className="relative h-12 w-12 rounded bg-white/10 shrink-0 overflow-hidden border border-white/20">
              <Image src={item.product.image} alt={item.product.name} fill className="object-contain p-1" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            </div>
            <div className="flex-1 flex flex-col gap-0.5">
              <h3 className="text-white text-xs font-bold leading-tight">{item.product.name}</h3>
              <span className="text-white/70 text-[10px]">Qty {item.quantity}</span>
            </div>
            <div className="text-white text-xs font-bold shrink-0">₹{(item.product.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}

        {activeCart.length === 0 && (
          <div className="text-white/70 text-xs italic">Your cart is empty</div>
        )}

      </div>

      {/* Cost Breakdown */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center text-xs">
          <span className="text-white/70">Subtotal</span>
          <span className="text-white font-bold">₹{totals.productSubtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-white/70">Delivery (Estimate)</span>
          {totals.isFreeDelivery ? (
             <span className="text-green-400 font-bold">Free Delivery</span>
          ) : (
             <span className="text-white font-bold">₹{totals.deliveryCharge.toFixed(2)}</span>
          )}
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-white/70">Estimated GST (5%)</span>
          <span className="text-white font-bold">₹{totals.gstAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="w-full h-px bg-white/10 mb-6" />

      <div className="mb-6 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
         <span className="text-[10px] text-white/60 leading-tight block">
            <strong className="text-white/80 font-bold">Cancellation Policy:</strong> Orders can be cancelled within 5 minutes of placing the order. After 5 minutes, cancellation is no longer available as the order may already be prepared or dispatched.
         </span>
      </div>

      {/* Total */}
      <div className="flex justify-between items-end mb-8">
        <span className="text-white font-bold">Total</span>
        <div className="flex items-baseline gap-1">
          <span className="text-white/70 text-[10px]">INR</span>
          <span className="text-[#f5a623] text-2xl font-bold font-heading tracking-tight">₹{totals.grandTotal.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={() => {
          const deliverBtn = document.getElementById("deliver-button");
          if (deliverBtn) {
            deliverBtn.click();
          } else {
            toast.error("Please select a delivery address first to proceed.");
          }
        }}
        className="w-full bg-[#F7CA00] hover:bg-[#F2C200] text-[#00113A] font-bold py-3.5 px-6 rounded-lg shadow-sm border border-[#F2C200] transition-colors mb-6"
      >
        Proceed to Payment
      </button>

      {/* Secure Badge */}
      <div className="flex items-center justify-center gap-2 text-white/70 text-[10px]">
        <Lock className="size-3" />
        <span>Secure, encrypted checkout</span>
      </div>

    </div>
  );
}
