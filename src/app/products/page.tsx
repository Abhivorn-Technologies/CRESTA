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
      <div className="w-full pt-32 pb-12 border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-[1440px] px-6 lg:px-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-[#101b4d] mb-2 tracking-tight">
              Our Products
            </h1>
            <p className="text-gray-500 font-medium">
              Explore our premium selection of ice creams and treats.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="px-6 py-2.5 rounded-full bg-[#101b4d] text-white text-sm font-bold shadow-md hover:bg-[#e6127d] transition-colors">
              All Products
            </button>
            <Link 
              href="/wishlist" 
              className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-200 text-[#101b4d] text-sm font-bold bg-white hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Heart className={`size-4 ${wishlistCount > 0 ? 'text-[#e6127d] fill-[#e6127d]' : ''}`} />
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
