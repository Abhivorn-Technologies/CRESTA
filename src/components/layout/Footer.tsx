"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, Star, MapPin, Phone, Mail } from "lucide-react";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/signup" || pathname.startsWith("/admin") || pathname.startsWith("/driver") || pathname.startsWith("/seller")) {
    return null;
  }

  const hideTrustBanner = pathname === "/gallery";


  return (
    <footer className="w-full print:hidden">
      {/* Premium Trust Banner — hidden on Gallery page */}
      {!hideTrustBanner && (
      <div className="w-full bg-gradient-to-br from-white via-[#f8fafc] to-[#f1f5f9] border-y border-gray-200/60 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        
        <div className="mx-auto max-w-[1200px] px-6 py-16 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            {/* Feature 1 */}
            <div className="flex flex-col items-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-white hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-[#f5a623] text-white shadow-lg shadow-orange-500/30 mb-6">
                <ShieldCheck className="size-8" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#101b4d] mb-3 tracking-tight">100% Authentic</h3>
              <p className="text-sm font-medium text-gray-500 leading-relaxed">
                As an official Baskin Robbins partner, we guarantee premium quality and authentic taste in every single scoop you order.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-white hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-400 to-[#101b4d] text-white shadow-lg shadow-blue-900/30 mb-6">
                <Truck className="size-8" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#101b4d] mb-3 tracking-tight">Perfectly Frozen</h3>
              <p className="text-sm font-medium text-gray-500 leading-relaxed">
                Our specialized cold-chain delivery network ensures your favorite ice cream arrives perfectly frozen, right to your doorstep.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm border border-white hover:shadow-md hover:-translate-y-1 transition-all duration-300">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-[#e6127d] text-white shadow-lg shadow-pink-500/30 mb-6">
                <Star className="size-8" />
              </div>
              <h3 className="font-heading font-bold text-xl text-[#101b4d] mb-3 tracking-tight">Premium Experience</h3>
              <p className="text-sm font-medium text-gray-500 leading-relaxed">
                From elegant protective packaging to real-time tracking, we treat every order like the special celebration it truly is.
              </p>
            </div>

          </div>
        </div>
      </div>
      )}



      {/* Bottom Section - Links & Info */}
      <div className="w-full bg-white text-[#101b4d] border-t border-gray-200">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-6">
            <div className="relative w-fit -mt-6">
               <Image 
                 src="/cresta-logo.png" 
                 alt="Cresta Global Logo" 
                 width={124} 
                 height={112} 
                 className="object-contain" 
               />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              Authorized distributor of premium Baskin Robbins ice cream. Delivering joy, celebration, and uncompromising quality straight to your door.
            </p>
            <div className="flex items-center gap-4 mt-2 text-[#101b4d]">
              <Link 
                href="https://www.facebook.com/people/Cresta-Global-PVT-LTD/61592587134013/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Facebook" 
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-gray-200 hover:border-[#e6127d] hover:bg-[#e6127d] hover:text-white transition-colors shadow-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </Link>
              <Link 
                href="https://www.instagram.com/crestaglobal/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram" 
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-gray-200 hover:border-[#e6127d] hover:bg-[#e6127d] hover:text-white transition-colors shadow-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h3 className="font-heading font-semibold text-[#101b4d] text-lg">Quick Links</h3>
            <div className="flex flex-col gap-4 text-sm font-medium text-gray-500">
              <Link href="/" className="hover:text-[#e6127d] transition-colors w-fit">Home</Link>
              <Link href="/products" className="hover:text-[#e6127d] transition-colors w-fit">Shop All</Link>
              <Link href="/about" className="hover:text-[#e6127d] transition-colors w-fit">About Us</Link>
              <Link href="/gallery" className="hover:text-[#e6127d] transition-colors w-fit">Gallery</Link>
            </div>
          </div>

          {/* My Account */}
          <div className="flex flex-col gap-6">
            <h3 className="font-heading font-semibold text-[#101b4d] text-lg">My Account</h3>
            <div className="flex flex-col gap-4 text-sm font-medium text-gray-500">
              <Link href="/profile" className="hover:text-[#e6127d] transition-colors w-fit">My Profile</Link>
              <Link href="/orders" className="hover:text-[#e6127d] transition-colors w-fit">My Orders</Link>
              <Link href="/cart" className="hover:text-[#e6127d] transition-colors w-fit">Your Cart</Link>
              <Link href="/wishlist" className="hover:text-[#e6127d] transition-colors w-fit">Wishlist</Link>
            </div>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col gap-6">
            <h3 className="font-heading font-semibold text-[#101b4d] text-lg">Contact Us</h3>
            <div className="flex flex-col gap-4 text-sm font-medium text-gray-500">
              {/* Store Address */}
              <div className="flex items-start gap-3">
                <MapPin className="size-5 shrink-0 text-[#f5a623] mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-[#101b4d] uppercase tracking-wider">Store Location:</span>
                  <span className="leading-snug text-gray-600">Aparna Neo Mall, Nallagandla, Hyderabad</span>
                </div>
              </div>

              {/* Registered Address */}
              <div className="flex items-start gap-3">
                <MapPin className="size-5 shrink-0 text-[#e6127d] mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-[#101b4d] uppercase tracking-wider">Registered Address:</span>
                  <span className="leading-snug text-gray-600">1-93/3, Prabhath Nagar, Malakpet Colony, Hyderabad, Amberpet, Telangana, 500036 (near ICICI Bank)</span>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3 pt-1">
                <Phone className="size-5 shrink-0 text-[#f5a623]" />
                <a href="tel:+919000199047" className="hover:text-[#e6127d] transition-colors">
                  +91 9000199047
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <Mail className="size-5 shrink-0 text-[#f5a623]" />
                <a href="mailto:crestaglobalpvtltd@gmail.com" className="hover:text-[#e6127d] transition-colors break-all">
                  crestaglobalpvtltd@gmail.com
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    </footer>
  );
}
