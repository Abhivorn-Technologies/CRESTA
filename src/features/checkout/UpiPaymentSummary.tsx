"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

import { useCart } from "@/context/CartContext";
import { calculateOrderTotals } from "@/lib/calculations";
import { toast } from "sonner";

export function UpiPaymentSummary() {
  const router = useRouter();
  const { cart, buyNowItem, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [savedAddress, setSavedAddress] = useState<any>(null);

  useEffect(() => {
    const addressStr = sessionStorage.getItem("checkoutAddress");
    const distanceStr = sessionStorage.getItem("checkoutDistanceKm");
    if (addressStr) {
      try {
        setSavedAddress(JSON.parse(addressStr));
      } catch(e) {}
    }
    if (distanceStr) {
      setDistanceKm(parseFloat(distanceStr));
    }
  }, []);

  const activeCart = buyNowItem ? [buyNowItem] : cart;

  const totals = calculateOrderTotals(
    activeCart.map((item) => ({
      price: item.product.price,
      quantity: item.quantity,
    })),
    distanceKm
  );

  const handleProceed = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: activeCart.map(i => ({
            productId: i.product.id,
            name: i.product.name,
            quantity: i.quantity,
            price: i.product.price,
            image: i.product.image
          })),
          totalAmount: totals.grandTotal,
          shippingAddress: {
            firstName: savedAddress?.fullName?.split(" ")[0] || "",
            lastName: savedAddress?.fullName?.split(" ").slice(1).join(" ") || "",
            email: sessionStorage.getItem("checkoutEmail") || "customer@example.com",
            phone: savedAddress?.phone || "",
            address: `${savedAddress?.apartment ? savedAddress.apartment + ", " : ""}${savedAddress?.street || ""}${savedAddress?.area ? ", " + savedAddress.area : ""}`,
            city: savedAddress?.city || "",
            postalCode: savedAddress?.postalCode || "",
            area: savedAddress?.area || "",
            lat: savedAddress?.lat || 0,
            lng: savedAddress?.lng || 0
          },
          paymentMethod: "upi",
          distanceKm: distanceKm,
          deliveryCharge: totals.deliveryCharge,
        })
      });
      
      if (res.ok) {
        if (!buyNowItem) clearCart();
        router.push("/checkout/success");
      } else {
        toast.error("Payment failed. Please try again.");
      }
    } catch (e) {
      toast.error("Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    router.push("/checkout/payment");
  };

  return (
    <div className="w-full lg:w-[376px] shrink-0 bg-[#002B5C] rounded-[12px] p-6 lg:p-8 flex flex-col shadow-[0_30px_60px_rgba(0,43,92,0.15)] h-fit">
      
      <h2 className="text-white font-heading font-bold text-lg mb-6">Order Summary</h2>

      {/* Cart Items */}
      <div className="flex flex-col gap-6 mb-8 border-b border-white/10 pb-8">
        
        {activeCart.map((item) => (
          <div key={item.product.id} className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <h3 className="text-white text-xs font-bold leading-tight">{item.product.name}</h3>
              <span className="text-white/70 text-[10px]">Qty: {item.quantity}</span>
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
          <span className="text-white/70">Estimated GST (5%)</span>
          <span className="text-white font-bold">₹{totals.gstAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-white/70">Delivery</span>
          {totals.isFreeDelivery ? (
             <span className="text-green-400 font-bold text-[10px]">Free Delivery</span>
          ) : (
             <span className="text-white font-bold">₹{totals.deliveryCharge.toFixed(2)}</span>
          )}
        </div>
      </div>

      <div className="w-full h-px bg-white/10 mb-6" />

      {/* Total */}
      <div className="flex justify-between items-end mb-8">
        <span className="text-white font-bold">Total</span>
        <span className="text-[#f5a623] text-2xl font-bold font-heading tracking-tight">₹{totals.grandTotal.toFixed(2)}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={handleProceed}
          disabled={isProcessing}
          className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white text-[11px] font-bold tracking-wider uppercase py-4 rounded-md shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Lock className="size-3" />
          {isProcessing ? "Processing..." : "Proceed to Pay"}
        </button>

        <button 
          onClick={handleCancel}
          className="w-full text-white/70 hover:text-white text-[11px] font-bold tracking-wider uppercase py-2 transition-colors"
        >
          Cancel Payment
        </button>
      </div>

    </div>
  );
}
