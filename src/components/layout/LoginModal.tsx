"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      toast.error("Please enter a valid 10-digit number");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/phone-otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("OTP sent to WhatsApp!");
        
        // In development mode, the API returns the OTP so we don't have to check the terminal
        if (data.devOtp) {
          toast("Development Mode: Your OTP is " + data.devOtp, {
            duration: 10000,
            style: { backgroundColor: '#101b4d', color: 'white', border: 'none' }
          });
        }
        
        setStep("otp");
      } else {
        toast.error(data.error || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/phone-otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Logged in successfully!");
        onClose();
        window.location.reload(); // Quick way to rehydrate auth context and ui
      } else {
        toast.error(data.error || "Invalid OTP");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-0">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header Image */}
        <div className="w-full h-32 bg-pink-50 flex items-center justify-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <Image src="/cresta-logo.png" alt="Logo" width={100} height={80} className="object-contain h-16 w-auto" />
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="text-2xl font-heading font-bold text-[#101b4d] text-center mb-1">
            {step === "phone" ? "India's last minute app" : "Verify Number"}
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            {step === "phone" ? "Log in or Sign up" : `OTP sent to +91 ${phone}`}
          </p>

          {step === "phone" ? (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-sm">+91</span>
                <input 
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="Enter mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-gray-50/50 pl-12 pr-4 py-3.5 border border-gray-200 focus:border-[#101b4d] focus:ring-1 focus:ring-[#101b4d] rounded-xl outline-none transition-all text-sm font-medium"
                />
              </div>
              <button 
                type="submit"
                disabled={isSubmitting || phone.length !== 10}
                className="w-full bg-gray-400 hover:bg-gray-500 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 mt-2 flex justify-center items-center gap-2"
                style={{ backgroundColor: phone.length === 10 ? '#e6127d' : '' }}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Continue
              </button>
              
              <p className="text-[11px] text-gray-400 text-center mt-2">
                By continuing, you agree to our <a href="#" className="underline">Terms of service</a> & <a href="#" className="underline">Privacy policy</a>
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <input 
                type="text"
                required
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-gray-50/50 px-4 py-3.5 border border-gray-200 focus:border-[#101b4d] focus:ring-1 focus:ring-[#101b4d] rounded-xl outline-none transition-all text-center tracking-widest text-lg font-bold"
              />
              <button 
                type="submit"
                disabled={isSubmitting || otp.length !== 6}
                className="w-full bg-[#101b4d] hover:bg-[#0a1133] text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 mt-2 flex justify-center items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Verify & Login
              </button>
              <button 
                type="button"
                onClick={() => setStep("phone")}
                className="text-xs font-medium text-gray-500 hover:text-gray-900 mt-2"
              >
                Edit phone number
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
