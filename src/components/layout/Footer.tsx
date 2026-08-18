"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Truck, Star, MapPin, Phone, Mail } from "lucide-react";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/signup") {
    return null;
  }

  return (
    <footer className="w-full bg-[#1b2c8d] text-white print:hidden">
      {/* Top Section - Features */}
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          
          <div className="flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-[#f5a623] shadow-sm">
              <ShieldCheck className="size-6" />
            </div>
            <p className="text-sm font-medium text-white/80 leading-relaxed max-w-[300px]">
              As an official Baskin Robbins partner, we guarantee 100% authentic, premium quality products in every order.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-[#f5a623] shadow-sm">
              <Truck className="size-6" />
            </div>
            <p className="text-sm font-medium text-white/80 leading-relaxed max-w-[300px]">
              Our specialized delivery network ensures your ice cream arrives perfectly frozen, exactly as it should be.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-[#f5a623] shadow-sm">
              <Star className="size-6" />
            </div>
            <p className="text-sm font-medium text-white/80 leading-relaxed max-w-[300px]">
              From elegant packaging to timely updates, we treat every order like the special celebration it is.
            </p>
          </div>

        </div>
      </div>

      {/* Gold Divider Line */}
      <div className="w-full border-t border-[#f5a623] opacity-80" />

      {/* Bottom Section - Links & Info */}
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-6">
            <div className="relative w-fit">
               <Image 
                 src="/cresta-logo.png" 
                 alt="Cresta Global Logo" 
                 width={124} 
                 height={112} 
                 className="object-contain" 
               />
            </div>
            <p className="text-sm text-white/80 leading-relaxed font-medium">
              Authorized distributor of premium Baskin Robbins ice cream. Delivering joy, celebration, and uncompromising quality straight to your door.
            </p>
            <div className="flex items-center gap-4 mt-2 text-white">
              <Link href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-[#e6127d] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </Link>
              <Link href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-[#e6127d] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </Link>
              <Link href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-[#e6127d] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-6">
            <h3 className="font-heading font-semibold text-[#f5a623] text-lg">Quick Links</h3>
            <div className="flex flex-col gap-4 text-sm font-medium text-white/80">
              <Link href="/" className="hover:text-white transition-colors w-fit">Home</Link>
              <Link href="/products" className="hover:text-white transition-colors w-fit">Shop All</Link>
              <Link href="/about" className="hover:text-white transition-colors w-fit">About Us</Link>
              <Link href="/delivery" className="hover:text-white transition-colors w-fit">Delivery Info</Link>
            </div>
          </div>

          {/* My Account */}
          <div className="flex flex-col gap-6">
            <h3 className="font-heading font-semibold text-[#f5a623] text-lg">My Account</h3>
            <div className="flex flex-col gap-4 text-sm font-medium text-white/80">
              <Link href="/profile" className="hover:text-white transition-colors w-fit">My Profile</Link>
              <Link href="/orders" className="hover:text-white transition-colors w-fit">My Orders</Link>
              <Link href="/cart" className="hover:text-white transition-colors w-fit">Your Cart</Link>
              <Link href="/wishlist" className="hover:text-white transition-colors w-fit">Wishlist</Link>
            </div>
          </div>

          {/* Contact Us */}
          <div className="flex flex-col gap-6">
            <h3 className="font-heading font-semibold text-[#f5a623] text-lg">Contact Us</h3>
            <div className="flex flex-col gap-5 text-sm font-medium text-white/80">
              <div className="flex items-start gap-3">
                <MapPin className="size-5 shrink-0 text-[#f5a623] mt-0.5" />
                <span>Aparna Neo Mall, Nallagandla, Hyderabad</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="size-5 shrink-0 text-[#f5a623]" />
                <span>+91 9000199047</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="size-5 shrink-0 text-[#f5a623]" />
                <span>crestaglobalpvtltd@gmail.com</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
