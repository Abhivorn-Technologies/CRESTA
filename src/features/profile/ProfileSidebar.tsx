"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FolderIcon, 
  UserCircleIcon, 
  PowerIcon, 
  ChevronRightIcon,
  LogOut
} from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export const ProfileSidebar = React.memo(function ProfileSidebar() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Body scroll lock
  useEffect(() => {
    if (showLogoutModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showLogoutModal]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full md:w-[300px] shrink-0 flex flex-col gap-4">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded shadow-sm border border-gray-100 p-3.5 flex items-center gap-4">
        <div className="relative w-[50px] h-[50px] shrink-0">
          <Image 
            src="/cresta-logo.png" 
            alt="Profile Avatar"
            fill
            className="object-contain p-1 rounded-full bg-blue-50"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-gray-500">Hello,</span>
          <span className="text-[15px] font-bold text-[#101b4d]">
            {user?.name || "Cresta User"}
          </span>
        </div>
      </div>

      {/* Navigation Card */}
      <div className="bg-white rounded shadow-sm border border-gray-100 flex flex-col overflow-hidden text-sm">
        
        {/* MY ORDERS */}
        <Link href="/orders" className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-blue-50/50 transition-colors group">
          <div className="flex items-center gap-4">
            <FolderIcon className="size-[18px] text-[#e6127d]" />
            <span className="font-bold text-gray-500 group-hover:text-[#e6127d] transition-colors">MY ORDERS</span>
          </div>
          <ChevronRightIcon className="size-5 text-gray-400 group-hover:text-[#e6127d] transition-colors" />
        </Link>

        {/* ACCOUNT SETTINGS */}
        <div className="flex flex-col border-b border-gray-100">
          <div className="flex items-center gap-4 p-4 pb-2">
            <UserCircleIcon className="size-[18px] text-[#e6127d]" />
            <span className="font-bold text-gray-500">ACCOUNT SETTINGS</span>
          </div>
          <div className="flex flex-col">
            <div className="py-3 px-[50px] bg-blue-50/30 text-[#e6127d] font-bold cursor-default">
              Profile Information
            </div>
          </div>
        </div>

        {/* LOGOUT */}
        <button onClick={() => setShowLogoutModal(true)} className="flex items-center gap-4 p-4 hover:bg-red-50/50 transition-colors group w-full text-left">
          <LogOut className="size-[18px] text-red-500" />
          <span className="font-bold text-red-600 group-hover:text-red-700 transition-colors">Logout</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-red-100 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-heading font-bold text-red-600 text-center w-full mb-3">
              Sign Out
            </h3>
            <p className="text-[15px] text-gray-500 leading-relaxed text-center w-full mb-8">
              Are you sure you want to log out of your account? You will need to enter your credentials to access it again.
            </p>

            <div className="flex flex-row items-center justify-center gap-4 w-full">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="rounded-full px-8 py-3 text-sm font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
                className="rounded-full px-8 py-3 text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-colors shadow-md"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
