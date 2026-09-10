"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Eye, EyeOff, ShieldCheck, Lock, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, setUser, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // If already logged in as admin, redirect to admin dashboard immediately
  useEffect(() => {
    if (!authLoading && user && user.role === "admin") {
      router.replace("/admin");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: "Admin" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed. Please verify your credentials.");
      }

      // Strictly verify that the account has admin authority
      if (data.user?.role !== "admin") {
        await fetch("/api/auth/me?action=logout", { method: "POST" });
        throw new Error("Access Denied: This portal is strictly restricted to system administrators.");
      }

      setUser(data.user);
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#f8f9fa] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="w-full max-w-[1000px] min-h-[640px] flex flex-col lg:flex-row rounded-[2rem] overflow-hidden bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 relative my-auto">
        
        {/* Left Side: Branding / Visual (Matches Image 2) */}
        <div className="hidden lg:flex lg:w-[45%] relative bg-gradient-to-b from-[#f8f9fa] to-[#f1f5f9] flex-col overflow-hidden border-r border-gray-100">
          <div className="relative z-10 flex flex-col h-full w-full p-10 lg:p-12">
            
            {/* Back Button */}
            <Link 
              href="/" 
              className="absolute top-8 left-8 flex items-center justify-center p-2.5 bg-white text-[#101b4d] rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300 group z-50 border border-gray-100"
              title="Return to Store"
            >
              <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
            </Link>

            {/* Top Section: Logo & Text */}
            <div className="flex flex-col items-center text-center w-full max-w-[360px] mx-auto">
              {/* Clickable Logo */}
              <Link href="/" className="group relative transition-transform hover:scale-105 duration-300 w-fit mb-8">
                <Image 
                  src="/cresta-logo.png" 
                  alt="Cresta Global Logo" 
                  width={130} 
                  height={130} 
                  className="object-contain drop-shadow-sm"
                  priority
                />
              </Link>

              {/* Title */}
              <h1 className="text-[2rem] leading-tight font-heading font-extrabold text-[#101b4d] mb-4 tracking-tight">
                Admin Management <br/> Portal
              </h1>
              <p className="text-gray-500 text-[15px] leading-relaxed font-medium">
                The secure and dedicated platform for managing operations, catalog, orders, and system controls.
              </p>
            </div>

            {/* Bottom Section: Product Visual */}
            <div className="relative w-full flex-1 mt-6 flex items-center justify-center mix-blend-multiply">
              <div className="relative w-full max-w-[280px] aspect-square group -mt-4">
                <Image
                  src="/images/CottonCandy--450ml---1043sq_414x.png.png"
                  alt="Cresta Premium"
                  fill
                  className="object-contain group-hover:scale-110 transition-transform duration-700 origin-center drop-shadow-2xl"
                  priority
                />
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: Form Area (Matches Image 2) */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-12 relative bg-white">
          <div className="w-full max-w-[420px] mx-auto flex flex-col justify-center">
            
            {/* Mobile Header */}
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <Link 
                href="/" 
                className="flex items-center justify-center p-2 bg-gray-50 text-[#101b4d] rounded-full border border-gray-100"
              >
                <ArrowLeft className="size-4" />
              </Link>
              <Image src="/cresta-logo.png" alt="Cresta" width={80} height={80} className="object-contain" priority />
              <div className="w-8" />
            </div>

            {/* Heading & Subtitle */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4">
              <h1 className="text-3xl font-heading font-bold text-[#101b4d]">Welcome Back</h1>
              <p className="text-gray-500 mt-2 text-sm">Sign in to continue to your Admin Dashboard</p>
            </motion.div>

            {/* Dedicated Admin Portal Badge */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-5">
              <div className="inline-flex items-center gap-2 bg-[#101b4d]/5 border border-[#101b4d]/10 px-4 py-2 rounded-xl text-xs font-bold text-[#101b4d]">
                <ShieldCheck className="size-4 text-[#e6127d]" />
                <span>Authorized Administrative Console</span>
              </div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-3 mb-6 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm text-center font-bold">
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">
              {/* Email Address */}
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-1.5 relative">
                <label className="text-[13px] font-bold text-[#101b4d]">
                  Admin Email <span className="text-[#e6127d]">*</span>
                </label>
                <input 
                  type="email" 
                  name="admin-email"
                  autoComplete="new-password"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-[3px] focus:ring-[#e6127d]/20 focus:border-[#e6127d] transition-all bg-gray-50/50 hover:bg-white focus:bg-white text-[15px] shadow-sm text-gray-800"
                  placeholder="Enter admin email"
                />
              </motion.div>

              {/* Password */}
              <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex flex-col gap-1.5 relative">
                <label className="text-[13px] font-bold text-[#101b4d]">
                  Password <span className="text-[#e6127d]">*</span>
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="admin-password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-[3px] focus:ring-[#e6127d]/20 focus:border-[#e6127d] transition-all bg-gray-50/50 hover:bg-white focus:bg-white text-[15px] shadow-sm text-gray-800 pr-12"
                    placeholder="Enter admin password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#101b4d] transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </motion.div>

              {/* Security Hint */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                  <Lock className="size-3 text-emerald-500" />
                  <span>256-Bit Encrypted Session</span>
                </span>
                <button type="button" className="text-xs font-bold text-gray-400 hover:text-[#e6127d] transition-colors">
                  Need Help?
                </button>
              </motion.div>

              {/* Submit Button */}
              <motion.button 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-[#e6127d] text-white hover:bg-[#101b4d] hover:-translate-y-0.5 rounded-xl py-3 text-[15px] font-bold transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(230,18,125,0.5)] hover:shadow-xl disabled:opacity-70 mt-2 flex items-center justify-center overflow-hidden relative group"
              >
                <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                {isLoading ? (
                  <div className="flex items-center gap-2 relative z-10">
                    <Loader2 className="size-4 animate-spin" />
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <span className="relative z-10">Sign In To Dashboard</span>
                )}
              </motion.button>
            </form>

            {/* Bottom Confidentiality Text */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 text-center text-xs font-medium text-gray-400 leading-relaxed">
              Restricted Area: Access is strictly limited to authorized administrators. All activities are monitored.
            </motion.p>

          </div>
        </div>

      </div>
    </div>
  );
}
