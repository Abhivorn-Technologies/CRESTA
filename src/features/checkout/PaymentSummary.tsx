"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Loader2, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export function PaymentSummary() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // OTP States
  const [showOTP, setShowOTP] = useState(false);
  const [userOTP, setUserOTP] = useState("");
  const [otpError, setOtpError] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setCheckoutEmail(sessionStorage.getItem("checkoutEmail") || "your email");
  }, []);

  const gst = cartTotal * 0.18;
  const delivery = cartTotal > 0 ? 150 : 0;
  const grandTotal = cartTotal + gst + delivery;

  const handlePayClick = async () => {
    if (cart.length === 0) return;
    
    setIsProcessing(true);
    try {
      const targetEmail = checkoutEmail === "your email" ? "admin@crestaglobal.com" : checkoutEmail;
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail })
      });

      if (res.ok) {
        setUserOTP("");
        setOtpError("");
        setShowOTP(true);
      } else {
        alert("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  const verifyOTPAndCheckout = async () => {
    if (userOTP.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP.");
      return;
    }
    
    setOtpError("");
    setIsProcessing(true); // Re-use isProcessing to disable the button while verifying

    try {
      const targetEmail = checkoutEmail === "your email" ? "admin@crestaglobal.com" : checkoutEmail;
      const otpRes = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, otp: userOTP })
      });

      if (!otpRes.ok) {
        const data = await otpRes.json();
        setOtpError(data.error || "Incorrect OTP. Please try again.");
        setIsProcessing(false);
        return;
      }

      // 1. Format items for the API
      const items = cart.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        product: item.product.id
      }));

      // 2. Post to our database!
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          totalAmount: grandTotal,
          shippingAddress: {
            firstName: "John", // Hardcoded dummy since we didn't hook up the shipping form state
            lastName: "Doe",
            email: targetEmail,
            phone: "1234567890",
            address: "G-30 & 31, Aparna Neo Mall",
            city: "Hyderabad",
            postalCode: "500019"
          },
          paymentMethod: "razorpay"
        })
      });

      if (res.ok) {
        clearCart();
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/orders"); // Go to orders so they can see the dynamic invoice!
        }, 2000);
      } else {
        alert("Payment failed.");
        setIsProcessing(false);
      }
    } catch (e) {
      console.error(e);
      alert("Something went wrong");
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="w-full lg:w-[368px] shrink-0 bg-[#F6F3F2] rounded-[12px] p-6 lg:p-8 flex flex-col shadow-sm h-fit">
        
        <h2 className="text-[#00113A] font-heading font-bold text-lg mb-6">Order Summary</h2>

        {/* Cart Items */}
        <div className="flex flex-col gap-6 mb-8 border-b border-gray-200 pb-8">
          
          {cart.map((item) => (
            <div key={item.product.id} className="flex items-start gap-4">
              <div className="relative h-12 w-12 rounded shrink-0 overflow-hidden border border-gray-200 bg-white">
                <Image src={item.product.image} alt={item.product.name} fill className="object-contain p-1" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              </div>
              <div className="flex-1 flex flex-col gap-0.5">
                <h3 className="text-[#00113A] text-xs font-bold leading-tight">{item.product.name}</h3>
                <span className="text-gray-500 text-[10px]">Qty: {item.quantity}</span>
              </div>
              <div className="text-[#00113A] text-xs font-bold shrink-0">₹{(item.product.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="text-gray-500 text-xs italic">Your cart is empty</div>
          )}

        </div>

        {/* Cost Breakdown */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Subtotal</span>
            <span className="text-[#00113A] font-bold">₹{cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Shipping (Standard)</span>
            <span className="text-[#00113A] font-bold">₹{delivery.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Estimated GST (18%)</span>
            <span className="text-[#00113A] font-bold">₹{gst.toFixed(2)}</span>
          </div>
        </div>

        <div className="w-full h-px bg-gray-200 mb-6" />

        {/* Total */}
        <div className="flex justify-between items-end mb-8">
          <span className="text-[#00113A] font-bold">Total</span>
          <span className="text-[#00113A] text-2xl font-bold font-heading tracking-tight">₹{grandTotal.toFixed(2)}</span>
        </div>

        {/* Action Button */}
        <button 
          onClick={handlePayClick}
          disabled={isProcessing || cart.length === 0}
          className="w-full bg-[#f5a623] hover:bg-[#d9921e] text-white text-[11px] font-bold tracking-wider uppercase py-4 rounded-md shadow-md transition-colors flex items-center justify-center gap-2 mb-4 disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              PROCESSING RAZORPAY...
            </>
          ) : (
            <>
              <Lock className="size-3" />
              PAY ₹{grandTotal.toFixed(2)}
            </>
          )}
        </button>

        {/* Secure Badge */}
        <div className="flex items-center justify-center gap-2 text-gray-500 text-[10px]">
          <Lock className="size-3" />
          <span>Payments are secure and encrypted via Razorpay.</span>
        </div>

      </div>

      {/* OTP Modal */}
      {showOTP && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-[400px] w-full flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            
            {isSuccess ? (
              <div className="flex flex-col items-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="size-10 text-green-500" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-[#00113A] mb-2">Payment Successful!</h3>
                <p className="text-gray-500 text-sm mb-2">
                  Your order has been placed.
                </p>
                <p className="text-gray-400 text-xs flex items-center gap-2">
                  <Loader2 className="size-3 animate-spin" /> Redirecting to your invoice...
                </p>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 bg-[#00113A] rounded-full flex items-center justify-center mb-6 shadow-lg">
                  <Lock className="size-8 text-white" />
                </div>

                <h3 className="font-heading text-2xl font-bold text-[#00113A] mb-2">Bank Verification</h3>
                <p className="text-gray-500 text-sm mb-6">
                  An OTP has been sent to <strong className="text-[#00113A]">{checkoutEmail}</strong>. Please enter it below to complete your payment of <strong className="text-[#00113A]">₹{grandTotal.toFixed(2)}</strong>.
                </p>

                <div className="w-full flex flex-col gap-2 mb-8">
                  <input 
                    type="text" 
                    value={userOTP}
                    onChange={(e) => setUserOTP(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className={`w-full text-center px-4 py-3 border-2 rounded-lg text-lg font-mono tracking-widest outline-none transition-colors ${otpError ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-[#00113A]'}`}
                  />
                  {otpError && <span className="text-xs text-red-500 font-bold">{otpError}</span>}
                </div>

                <div className="flex gap-4 w-full">
                  <button 
                    onClick={() => setShowOTP(false)}
                    disabled={isProcessing}
                    className="flex-1 px-4 py-3 rounded-lg font-bold text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={verifyOTPAndCheckout}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#00113A] hover:bg-[#1a2b7c] text-white rounded-lg font-bold transition-colors shadow-md disabled:opacity-50"
                  >
                    {isProcessing ? <Loader2 className="size-4 animate-spin" /> : 'Verify & Pay'}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </>
  );
}
