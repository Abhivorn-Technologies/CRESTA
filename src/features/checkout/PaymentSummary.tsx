"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Script from "next/script";
import { calculateOrderTotals } from "@/lib/calculations";

import { PaymentMethodType } from "./PaymentContainer";

import { toast } from "sonner";

// Define the Razorpay interface for TS
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentSummaryProps {
  selectedMethod: PaymentMethodType;
}

export function PaymentSummary({ selectedMethod }: PaymentSummaryProps) {
  const router = useRouter();
  const { cart, cartTotal, clearCart, buyNowItem, setBuyNowItem } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [savedAddress, setSavedAddress] = useState<any>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);

  useEffect(() => {
    setCheckoutEmail(sessionStorage.getItem("checkoutEmail") || "admin@crestaglobal.com");
    const addressStr = sessionStorage.getItem("checkoutAddress");
    const distanceStr = sessionStorage.getItem("checkoutDistanceKm");
    
    if (addressStr) {
      try {
        setSavedAddress(JSON.parse(addressStr));
      } catch (e) {}
    }
    if (distanceStr) {
      setDistanceKm(parseFloat(distanceStr));
    }
  }, []);

  const activeCart = buyNowItem ? [buyNowItem] : cart;

  const totals = calculateOrderTotals(
    activeCart.map(i => ({ price: i.product.price, quantity: i.quantity })),
    distanceKm
  );

  const handlePayClick = async () => {
    if (activeCart.length === 0) return;
    setIsProcessing(true);

    try {
      // 1. Format items for the API
      const items = activeCart.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        product: item.product.id
      }));

      // Read selected address from sessionStorage
      const savedAddressStr = sessionStorage.getItem("checkoutAddress");
      if (!savedAddressStr) {
        toast.error("No delivery address selected. Please go back and select an address.");
        setIsProcessing(false);
        router.push("/checkout");
        return;
      }
      const savedAddress = JSON.parse(savedAddressStr);

      const shippingAddress = {
        firstName: savedAddress.fullName.split(" ")[0] || "Guest",
        lastName: savedAddress.fullName.split(" ").slice(1).join(" ") || "",
        email: checkoutEmail,
        phone: savedAddress.phone,
        address: `${savedAddress.apartment ? savedAddress.apartment + ", " : ""}${savedAddress.street}${savedAddress.area ? ", " + savedAddress.area : ""}`,
        city: savedAddress.city,
        postalCode: savedAddress.postalCode,
        state: savedAddress.state || "",
        distanceKm: totals.deliveryDistanceKm
      };

      if (selectedMethod === "cod") {
        // --- CASH ON DELIVERY FLOW ---
        const res = await fetch("/api/payment/create-cod-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            shippingAddress,
          })
        });

        if (!res.ok) {
          throw new Error("Failed to create COD order");
        }
        
        const codData = await res.json();

        if (buyNowItem) {
          setBuyNowItem(null);
        } else {
          clearCart();
        }
        setIsSuccess(true);
        
        // Removed wa.me popup to prevent confusion. This must be handled by backend API.

        setTimeout(() => {
          router.push("/orders"); 
        }, 2000);
        return;
      }

      // --- RAZORPAY ONLINE FLOW ---
      // 2. Create Order on Backend
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingAddress,
          paymentMethod: "razorpay"
        })
      });

      if (!res.ok) throw new Error("Failed to create Razorpay order");

      const orderData = await res.json();

      // 3. Open Razorpay Checkout
        // Determine the logo URL. Razorpay's servers cannot fetch images from 'localhost'.
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const logoUrl = isLocalhost 
          ? "https://placehold.co/128x128/002B5C/FFF?text=Cresta" 
          : window.location.origin + "/cresta-logo.png";

        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Cresta Global",
          description: "Secure Payment",
          image: logoUrl,
          order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // 4. Verify Payment on Backend
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: orderData.dbOrderId
              })
            });

            if (verifyRes.ok) {
              if (buyNowItem) {
                setBuyNowItem(null);
              } else {
                clearCart();
              }
              setIsSuccess(true);
              
              // Removed wa.me popup to prevent confusion. This must be handled by backend API.

              setTimeout(() => {
                router.push("/orders"); 
              }, 2000);
            } else {
              toast.error("Payment verification failed.");
              setIsProcessing(false);
            }
          } catch (e) {
            console.error("Verification error", e);
            toast.error("Payment verification error.");
            setIsProcessing(false);
          }
        },
        prefill: {
          name: "John Doe",
          email: checkoutEmail,
          contact: "1234567890"
        },
        theme: {
          color: "#00113A"
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error("Payment failed: " + response.error.description);
        setIsProcessing(false);
      });
      
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

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
            <div className="flex items-center gap-1.5">
              <span className="text-white/70">Delivery</span>
              {totals.deliveryDistanceKm && (
                <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/90">
                  {totals.deliveryDistanceKm} km
                </span>
              )}
            </div>
            {totals.isFreeDelivery ? (
               <span className="text-green-400 font-bold">Free Delivery</span>
            ) : (
               <span className="text-white font-bold">₹{totals.deliveryCharge.toFixed(2)}</span>
            )}
          </div>
          
          <div className="flex justify-between items-center text-xs">
            <span className="text-white/70">GST (5%)</span>
            <span className="text-white font-bold">₹{totals.gstAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="w-full h-px bg-white/10 mb-4" />

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

        {/* Use this payment method button */}
        <button 
          onClick={handlePayClick}
          disabled={isProcessing || activeCart.length === 0 || isSuccess}
          className="w-full bg-[#F7CA00] hover:bg-[#F2C200] text-[#00113A] font-bold py-3.5 px-6 rounded-lg shadow-sm border border-[#F2C200] transition-colors flex items-center justify-center gap-2 mb-6 disabled:opacity-50"
        >
          {isProcessing && !isSuccess ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              PROCESSING...
            </>
          ) : isSuccess ? (
            <>
              <CheckCircle2 className="size-4" />
              SUCCESS
            </>
          ) : (
            <>Use this payment method</>
          )}
        </button>

        {/* Secure Badge */}
        <div className="flex items-center justify-center gap-2 text-white/70 text-[10px]">
          <Lock className="size-3" />
          <span>Secure, encrypted checkout</span>
        </div>

      </div>

      {/* Success Modal */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00113A]/70 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-[440px] w-full flex flex-col items-center text-center animate-in zoom-in-95 duration-200 border border-gray-100">
            
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                <CheckCircle2 className="size-8 text-white" />
              </div>
            </div>

            {/* Text */}
            <h3 className="font-heading text-2xl font-extrabold text-[#00113A] mb-3 tracking-tight">
              {selectedMethod === "cod" ? "Order Placed Successfully!" : "Payment Successful!"}
            </h3>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed px-4">
              {selectedMethod === "cod" 
                ? "Your order has been placed successfully. You can pay the courier upon delivery. We are preparing your items for shipment." 
                : "Your order has been placed successfully via Razorpay. We are preparing your items for shipment."}
            </p>

            {/* Loading / Redirecting state */}
            <div className="flex items-center gap-3 bg-gray-50 px-6 py-3 rounded-full border border-gray-100">
              <Loader2 className="size-4 animate-spin text-[#00113A]" />
              <span className="text-sm font-bold text-[#00113A]">Redirecting to invoice...</span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
