"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bike, Loader2, LogOut, X } from "lucide-react";
import Image from "next/image";

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login?redirect=/driver");
      } else if (user.role !== "delivery_partner") {
        router.push("/");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || !user || user.role !== "delivery_partner") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="size-10 text-[#e6127d] animate-spin mb-4" />
        <p className="text-gray-700 font-medium font-heading">Loading Driver Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      {/* Driver Top Nav */}
      <header className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 shadow-sm relative z-50">
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-pink-50 p-2 rounded-full">
              <Bike className="size-5 text-[#e6127d]" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-lg leading-tight tracking-wide text-gray-900">Cresta Delivery</h1>
              <p className="text-[11px] text-gray-500 font-medium tracking-wide">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="hidden sm:inline text-[11px] font-bold text-green-700 tracking-wider uppercase">Online</span>
            </div>
            
            <button 
              onClick={() => setShowLogoutModal(true)} 
              className="text-gray-500 hover:text-[#e6127d] bg-gray-50 hover:bg-pink-50 transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg"
              title="Logout"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline text-sm font-bold">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto pb-10">
        {children}
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowLogoutModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="size-5" />
            </button>
            
            <div className="p-6 pt-8 flex flex-col items-center text-center">
              <div className="bg-red-50 p-3 rounded-full mb-4">
                <LogOut className="size-6 text-red-500" />
              </div>
              <h2 className="text-xl font-bold font-heading text-gray-900 mb-2">Sign Out</h2>
              <p className="text-gray-500 text-sm">Are you sure you want to sign out of the Driver Dashboard?</p>
            </div>
            
            <div className="flex border-t border-gray-100">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-50 transition-colors border-r border-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowLogoutModal(false);
                  logout();
                }}
                className="flex-1 py-4 text-red-600 font-bold hover:bg-red-50 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
