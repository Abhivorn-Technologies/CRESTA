"use client";

import { Navbar } from "@/components/layout/Navbar";
import { ProductsLayout } from "@/features/products/ProductsLayout";
import { Heart } from "lucide-react";
import Link from "next/link";

import { useWishlist } from "@/context/WishlistContext";

export default function ProductsPage() {
  const { wishlistCount } = useWishlist();

  return (
    <main className="flex min-h-screen flex-col bg-[#fdfdfd]">
      <Navbar />
      
      {/* Page Header */}
      <div className="relative w-full pt-40 pb-20 border-b border-gray-100 bg-[#101b4d] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
          <img 
            src="/api/images/products-banner" 
            alt="Products Banner" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#101b4d] via-[#101b4d]/80 to-transparent z-10" />

        <div className="relative z-20 mx-auto max-w-[1440px] px-6 lg:px-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="max-w-xl">
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
              Our Products
            </h1>
            <p className="text-gray-200 font-medium text-lg">
              Explore our premium selection of ice creams, sundaes, and frozen treats for every occasion.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="px-6 py-2.5 rounded-full bg-[#e6127d] text-white text-sm font-bold shadow-lg shadow-[#e6127d]/20 hover:bg-[#c90d6b] transition-all hover:-translate-y-0.5">
              All Products
            </button>
            <Link 
              href="/wishlist" 
              className="flex items-center gap-2 px-6 py-2.5 rounded-full border-0 text-[#101b4d] text-sm font-bold bg-white hover:bg-gray-50 transition-all shadow-lg hover:-translate-y-0.5"
            >
              <Heart className={`size-4 ${wishlistCount > 0 ? 'text-[#e6127d] fill-[#e6127d]' : 'text-gray-400'}`} />
              <span>Wishlist ({wishlistCount})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-[1440px] w-full px-6 lg:px-10 py-12 flex-1">
        <ProductsLayout />
      </div>
    </main>
  );
}
