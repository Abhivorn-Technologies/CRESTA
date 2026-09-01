"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Heart, MapPin, Search, ShoppingBag, Menu, User, LogOut, X, Package } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPincodeModal, setShowPincodeModal] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<"idle" | "checking" | "success" | "error">("idle");
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Body scroll lock
  useEffect(() => {
    if (isMobileMenuOpen || showLogoutModal || showPincodeModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen, showLogoutModal, showPincodeModal]);

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/95 border-b border-gray-100'}`}>
      <div className="mx-auto flex h-[80px] max-w-[1440px] items-center justify-between px-6 lg:px-10">
        
        {/* Logo Area */}
        <Link href="/" className="flex flex-col items-center justify-center relative z-10 group mt-1 lg:mt-2">
          <Image 
            src="/cresta-logo.png" 
            alt="Cresta Global Logo" 
            width={124} 
            height={112} 
            className="group-hover:scale-105 transition-transform duration-300 object-contain w-auto h-[50px] lg:h-[70px]"
            priority
          />
        </Link>

        {/* Center Links */}
        <div className="hidden lg:flex items-center gap-12 font-medium text-[15px] text-[#4b5563]">
          <Link 
            href="/" 
            className={`transition-colors hover:text-[#101b4d] hover:shadow-sm ${pathname === "/" ? "relative text-[#101b4d] font-semibold after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-[#e6127d]" : ""}`}
          >
            Home
          </Link>
          <Link 
            href="/products" 
            className={`transition-colors hover:text-[#101b4d] hover:shadow-sm ${pathname === "/products" ? "relative text-[#101b4d] font-semibold after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-[#e6127d]" : ""}`}
          >
            Products
          </Link>
          <Link 
            href="/delivery" 
            className={`transition-colors hover:text-[#101b4d] hover:shadow-sm ${pathname === "/delivery" ? "relative text-[#101b4d] font-semibold after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-[#e6127d]" : ""}`}
          >
            Delivery
          </Link>
          <Link 
            href="/about" 
            className={`transition-colors hover:text-[#101b4d] hover:shadow-sm ${pathname === "/about" ? "relative text-[#101b4d] font-semibold after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-[#e6127d]" : ""}`}
          >
            About Us
          </Link>
          <Link 
            href="/contact" 
            className={`transition-colors hover:text-[#101b4d] hover:shadow-sm ${pathname === "/contact" ? "relative text-[#101b4d] font-semibold after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-[#e6127d]" : ""}`}
          >
            Contact Us
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-5 lg:gap-6 text-[#4b5563]">
          <button onClick={() => setShowPincodeModal(true)} className="hidden lg:flex items-center gap-1.5 text-[14px] hover:text-[#101b4d] transition-colors font-medium">
            <MapPin className="size-4.5" />
            <span>Check Pincode</span>
          </button>
          
          <div className="h-5 w-[1px] bg-black/10 hidden lg:block" />

          {user ? (
            <div className="hidden lg:block relative group">
              <Link href="/profile" className="flex items-center gap-1.5 text-[14px] hover:text-[#e6127d] transition-colors font-medium py-2">
                <User className="size-4.5" />
                <span>{user.name.split(' ')[0]}</span>
              </Link>
              {/* Hover Dropdown */}
              <div className="absolute top-full right-0 mt-0 w-48 bg-white border border-gray-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden flex flex-col">
                <Link href="/profile" className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                  <User className="size-4 text-gray-400" />
                  My Profile
                </Link>
                <Link href="/orders" className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 border-t border-gray-50">
                  <Package className="size-4 text-gray-400" />
                  Orders
                </Link>
                <button onClick={() => setShowLogoutModal(true)} className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 border-t border-gray-50 transition-colors">
                  <LogOut className="size-4 text-red-400" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link href="/login" className="hidden lg:flex items-center gap-1.5 text-[14px] hover:text-[#e6127d] transition-colors font-medium">
              <User className="size-4.5" />
              <span>Sign In</span>
            </Link>
          )}

          <div className="h-5 w-[1px] bg-black/10 hidden lg:block" />

          <Link href="/wishlist" className="relative hover:text-[#e6127d] transition-colors group p-1" title="Wishlist">
            <Heart className="size-[22px] group-hover:scale-110 transition-transform" />
          </Link>
          
          <Link href="/cart" className="relative hover:text-[#e6127d] transition-colors group p-1">
            <ShoppingBag className="size-[22px] group-hover:scale-110 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#e6127d] text-[9px] font-bold text-white shadow-sm ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </Link>

          <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2 -mr-2 text-[#1F2937]">
            <Menu className="size-7" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm" 
              onClick={() => setIsMobileMenuOpen(false)} 
            />
            
            {/* Panel */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-y-0 right-0 z-[101] w-full max-w-[300px] overflow-y-auto bg-white px-6 py-6 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Image 
                    src="/cresta-logo.png" 
                    alt="Cresta Global Logo" 
                    width={100} 
                    height={80} 
                    className="w-auto h-[40px] object-contain"
                  />
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Links */}
              <div className="flex flex-col gap-2 flex-1">
                <Link
                  href="/"
                  className={`block rounded-lg px-3 py-3 text-base font-semibold transition-colors ${pathname === "/" ? "bg-pink-50 text-[#e6127d]" : "text-gray-900 hover:bg-gray-50"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/products"
                  className={`block rounded-lg px-3 py-3 text-base font-semibold transition-colors ${pathname === "/products" ? "bg-pink-50 text-[#e6127d]" : "text-gray-900 hover:bg-gray-50"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  href="/delivery"
                  className={`block rounded-lg px-3 py-3 text-base font-semibold transition-colors ${pathname === "/delivery" ? "bg-pink-50 text-[#e6127d]" : "text-gray-900 hover:bg-gray-50"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Delivery
                </Link>
                <Link
                  href="/about"
                  className={`block rounded-lg px-3 py-3 text-base font-semibold transition-colors ${pathname === "/about" ? "bg-pink-50 text-[#e6127d]" : "text-gray-900 hover:bg-gray-50"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className={`block rounded-lg px-3 py-3 text-base font-semibold transition-colors ${pathname === "/contact" ? "bg-pink-50 text-[#e6127d]" : "text-gray-900 hover:bg-gray-50"}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact Us
                </Link>
                
                <div className="h-[1px] bg-gray-100 my-4" />

                <Link
                  href="/orders"
                  className="block rounded-lg px-3 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Package className="size-5 text-gray-500" />
                  My Orders
                </Link>

                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="block rounded-lg px-3 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="size-5 text-gray-500" />
                      My Profile ({user.name.split(' ')[0]})
                    </Link>
                    <button
                      onClick={() => {
                        setShowLogoutModal(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left rounded-lg px-3 py-3 text-base font-semibold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                    >
                      <LogOut className="size-5" />
                      Log out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="block rounded-lg px-3 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="size-5 text-gray-500" />
                    Sign in
                  </Link>
                )}
              </div>
              
              {/* Footer */}
              <div className="pt-6 border-t border-gray-100 mt-auto">
                <button 
                  onClick={() => {
                    setShowPincodeModal(true);
                    setIsMobileMenuOpen(false);
                  }} 
                  className="flex items-center gap-3 text-base font-semibold text-gray-900 hover:text-[#101b4d] w-full px-3 py-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <MapPin className="size-5 text-gray-500" />
                  Check Pincode
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
                  logout();
                }}
                className="rounded-full px-8 py-3 text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-colors shadow-md"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Check Pincode Modal */}
      {showPincodeModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-white/40 backdrop-blur-md"
            onClick={() => {
              setShowPincodeModal(false);
              setPincode("");
              setPincodeStatus("idle");
            }}
          />
          <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-100 flex flex-col items-center text-center animate-in fade-in zoom-in duration-200">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 transition-colors"
              onClick={() => {
                setShowPincodeModal(false);
                setPincode("");
                setPincodeStatus("idle");
              }}
            >
              <X className="size-5" />
            </button>
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-5 border border-blue-100">
              <MapPin className="size-7 text-[#e6127d]" />
            </div>
            
            <h3 className="font-heading font-bold text-[#101b4d] text-2xl mb-2">
              Delivery Availability
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Enter your 6-digit pincode to check if we deliver to your location.
            </p>

            <div className="w-full relative mb-4">
              <input 
                type="text" 
                maxLength={6}
                placeholder="Enter Pincode"
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value.replace(/\D/g, ''));
                  setPincodeStatus("idle");
                }}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-center text-lg font-bold tracking-[0.2em] focus:outline-none focus:border-[#e6127d] focus:ring-1 focus:ring-[#e6127d] transition-all"
              />
            </div>

            {pincodeStatus === "idle" && (
              <button 
                onClick={() => {
                  if (pincode.length !== 6) return;
                  setPincodeStatus("checking");
                  setTimeout(() => {
                    // Mock logic: Hyderabad pincodes start with 500
                    if (pincode.startsWith("50")) {
                      setPincodeStatus("success");
                    } else {
                      setPincodeStatus("error");
                    }
                  }, 1000);
                }}
                disabled={pincode.length !== 6}
                className="w-full px-4 py-3.5 rounded-xl bg-[#101b4d] text-white font-bold text-sm hover:bg-[#e6127d] transition-colors disabled:opacity-50 disabled:hover:bg-[#101b4d]"
              >
                Check Availability
              </button>
            )}

            {pincodeStatus === "checking" && (
              <div className="w-full px-4 py-3.5 rounded-xl bg-gray-100 text-gray-500 font-bold text-sm flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Checking...
              </div>
            )}

            {pincodeStatus === "success" && (
              <div className="w-full px-4 py-3.5 rounded-xl bg-green-50 border border-green-200 text-green-700 font-bold text-sm flex items-center justify-center">
                🎉 Yes! We deliver to {pincode}.
              </div>
            )}

            {pincodeStatus === "error" && (
              <div className="w-full px-4 py-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 font-bold text-sm flex items-center justify-center flex-col gap-1">
                <span>Sorry, we don't deliver here yet.</span>
                <span className="text-xs font-normal text-red-400">Currently serving Hyderabad (500xxx)</span>
              </div>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}
