"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export function UpiPaymentSummary() {
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleProceed = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            { name: "Premium Vanilla Bean Bulk", quantity: 2, price: 60 },
            { name: "Dark Chocolate Truffle Bulk", quantity: 1, price: 65 },
            { name: "Strawberry Ribbon Bulk", quantity: 1, price: 55 }
          ],
          totalAmount: 258.00,
          shippingAddress: {
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            phone: "1234567890",
            address: "G-30 & 31, Aparna Neo Mall",
            city: "Hyderabad",
            postalCode: "500019"
          },
          paymentMethod: "upi"
        })
      });
      
      if (res.ok) {
        router.push("/checkout/success");
      } else {
        alert("Payment failed. Please try again.");
      }
    } catch (e) {
      alert("Something went wrong");
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
        
        {/* Item 1 */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-white text-xs font-bold leading-tight">Premium Vanilla Bean Bulk</h3>
            <span className="text-white/70 text-[10px]">Qty: 2 x 3 Gallon Tubs</span>
          </div>
          <div className="text-white text-xs font-bold shrink-0">$120.00</div>
        </div>

        {/* Item 2 */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-white text-xs font-bold leading-tight">Dark Chocolate Truffle Bulk</h3>
            <span className="text-white/70 text-[10px]">Qty: 1 x 5 Gallon Tub</span>
          </div>
          <div className="text-white text-xs font-bold shrink-0">$65.00</div>
        </div>

        {/* Item 3 */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-white text-xs font-bold leading-tight">Strawberry Ribbon Bulk</h3>
            <span className="text-white/70 text-[10px]">Qty: 1 x 5 Gallon Tub</span>
          </div>
          <div className="text-white text-xs font-bold shrink-0">$55.00</div>
        </div>

      </div>

      {/* Cost Breakdown */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center text-xs">
          <span className="text-white/70">Subtotal</span>
          <span className="text-white font-bold">$240.00</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-white/70">Taxes (7.5%)</span>
          <span className="text-white font-bold">$18.00</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-white/70">Shipping</span>
          <span className="text-white font-bold text-[10px]">Calculated</span>
        </div>
      </div>

      <div className="w-full h-px bg-white/10 mb-6" />

      {/* Total */}
      <div className="flex justify-between items-end mb-8">
        <span className="text-white font-bold">Total</span>
        <span className="text-white text-2xl font-bold font-heading tracking-tight">$258.00</span>
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
