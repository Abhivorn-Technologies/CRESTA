"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";

type Role = "User" | "Seller";

export default function SignupPage() {
  const [role, setRole] = useState<Role>("User");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Signup failed");
      }

      // Show success, then redirect to login after 1.5s
      setSuccess("Account created! Redirecting to sign in...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
      className="flex flex-col"
    >
      {/* Brand Logo for Mobile */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-3 lg:hidden">
        <Image src="/cresta-logo.png" alt="Cresta" width={90} height={90} className="object-contain" priority />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-4">
        <h1 className="text-3xl font-heading font-bold text-[#101b4d]">Create Account</h1>
        <p className="text-gray-500 mt-2 text-sm">Register a new {role} account</p>
      </motion.div>

      {/* Role Selector Tabs */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex bg-gray-50 p-1.5 rounded-xl mb-5 relative shadow-inner">
        {["User", "Seller"].map((r) => (
          <button
            key={r}
            onClick={() => setRole(r as Role)}
            className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all relative z-10 ${
              role === r ? "text-[#101b4d]" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {role === r && (
              <motion.div
                layoutId="signup-role-tab"
                className="absolute inset-0 bg-white rounded-lg shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-gray-100 -z-10"
                transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
              />
            )}
            {r}
          </button>
        ))}
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-3 mb-6 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm text-center font-bold">
          {error}
        </motion.div>
      )}

      {success && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-3 mb-6 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm text-center font-bold flex items-center justify-center gap-2">
          <CheckCircle2 className="size-4 shrink-0" />
          {success}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-1.5 relative">
          <label className="text-[13px] font-bold text-[#101b4d]">Full Name <span className="text-[#e6127d]">*</span></label>
          <input 
            type="text" 
            name="new-name"
            autoComplete="new-password"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-[3px] focus:ring-[#e6127d]/20 focus:border-[#e6127d] transition-all bg-gray-50/50 hover:bg-white focus:bg-white text-[15px] shadow-sm autofill-fix"
            placeholder="John Doe"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex flex-col gap-1.5 relative">
          <label className="text-[13px] font-bold text-[#101b4d]">Email Address <span className="text-[#e6127d]">*</span></label>
          <input 
            type="email" 
            name="new-email"
            autoComplete="new-password"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-[3px] focus:ring-[#e6127d]/20 focus:border-[#e6127d] transition-all bg-gray-50/50 hover:bg-white focus:bg-white text-[15px] shadow-sm autofill-fix"
            placeholder="Enter the email"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex flex-col gap-1.5 relative">
          <label className="text-[13px] font-bold text-[#101b4d]">Password <span className="text-[#e6127d]">*</span></label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              name="new-password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-[3px] focus:ring-[#e6127d]/20 focus:border-[#e6127d] transition-all bg-gray-50/50 hover:bg-white focus:bg-white text-[15px] shadow-sm autofill-fix pr-12"
              placeholder="Enter password"
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

        <motion.button 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          type="submit" 
          disabled={isLoading} 
          className="w-full bg-[#e6127d] text-white hover:bg-[#101b4d] hover:-translate-y-0.5 rounded-xl py-3 text-[15px] font-bold transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(230,18,125,0.5)] hover:shadow-xl disabled:opacity-70 mt-2 flex items-center justify-center overflow-hidden relative group"
        >
          <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
          <span className="relative z-10">{isLoading ? "Creating Account..." : "Create Account"}</span>
        </motion.button>
      </form>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-5 text-center text-sm font-medium text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-[#101b4d] hover:text-[#e6127d] transition-colors">
          Log in
        </Link>
      </motion.p>
    </motion.div>
  );
}
