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
            <div className="flex items-center gap-3 mt-2 text-[#101b4d]">
              {/* WhatsApp — Cresta Global */}
              <div className="relative group/wa">
                <a 
                  href="https://wa.me/919000199047" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="WhatsApp — Cresta Global" 
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-gray-200 hover:border-[#25D366] hover:bg-[#25D366] hover:text-white text-[#25D366] transition-all shadow-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.414z"/>
                  </svg>
                </a>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-[#1a1a2e] text-white text-[11px] font-semibold rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover/wa:opacity-100 transition-opacity duration-200 shadow-lg">
                  WhatsApp
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a2e]" />
                </div>
              </div>

              {/* Facebook */}
              <div className="relative group/fb">
                <a 
                  href="https://www.facebook.com/people/Cresta-Global-PVT-LTD/61592587134013/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Facebook" 
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-gray-200 hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-colors shadow-sm"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-[#1a1a2e] text-white text-[11px] font-semibold rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover/fb:opacity-100 transition-opacity duration-200 shadow-lg">
                  Facebook
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a2e]" />
                </div>
              </div>

              {/* Instagram 1 — Baskin Robbins Hyderabad */}
              <div className="relative group/ig1">
                <a
                  href="https://www.instagram.com/baskin7806/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram — Baskin Robbins Hyderabad"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-gray-200 hover:border-[#e6127d] hover:bg-gradient-to-br hover:from-[#e6127d] hover:to-[#f59e0b] hover:text-white transition-all shadow-sm"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-[#1a1a2e] text-white text-[11px] font-semibold rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover/ig1:opacity-100 transition-opacity duration-200 shadow-lg">
                  @baskin7806
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a2e]" />
                </div>
              </div>

              {/* Instagram 2 — Cresta Global */}
              <div className="relative group/ig2">
                <a
                  href="https://www.instagram.com/crestaglobal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram — Cresta Global"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-gray-200 hover:border-[#e6127d] hover:bg-gradient-to-br hover:from-[#e6127d] hover:to-[#f59e0b] hover:text-white transition-all shadow-sm"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 bg-[#1a1a2e] text-white text-[11px] font-semibold rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover/ig2:opacity-100 transition-opacity duration-200 shadow-lg">
                  @crestaglobal
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a2e]" />
                </div>
              </div>
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
                <MapPin className="size-5 shrink-0 text-[#f5a623] mt-0.5" />
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
