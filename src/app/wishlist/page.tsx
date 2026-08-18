"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ProductGrid } from "@/features/products/ProductGrid";
import { Product } from "@/data/products";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistPage() {
  const { wishlist, wishlistCount, isLoading: wishlistLoading } = useWishlist();
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setIsProductsLoading(false);
      }
    }
    fetchProducts();
  }, []);
  
  // Filter the full product catalog based on the dynamic wishlist IDs
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));
  const isLoading = wishlistLoading || isProductsLoading;
  
  // Pagination logic
  const itemsPerPage = 3;
  const totalPages = Math.ceil(wishlistProducts.length / itemsPerPage) || 1;
  const currentItems = wishlistProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <main className="flex min-h-screen flex-col bg-[#fdfdfd]">
      <Navbar />
      
      {/* Page Header */}
      <div className="w-full pt-32 pb-8 bg-[#fdfdfd]">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-gray-100 pb-6">
          <div>
            <h1 className="font-heading text-3xl lg:text-[34px] font-bold text-[#101b4d] mb-1.5 tracking-tight">
              Your Wishlist
            </h1>
            <p className="text-gray-500 font-medium text-sm">
              Products you've saved for later.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/products"
              className="px-6 py-2.5 rounded-full border border-gray-200 text-[#101b4d] text-sm font-bold bg-white hover:bg-gray-50 transition-colors shadow-sm"
            >
              All Products
            </Link>
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-[#101b4d] text-[#101b4d] text-sm font-bold bg-white transition-colors shadow-sm cursor-default">
              <Heart className={`size-4 ${wishlistCount > 0 ? 'text-[#e6127d] fill-[#e6127d]' : ''}`} />
              <span>Wishlist ({wishlistCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-[1280px] w-full px-6 lg:px-10 pb-20 flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#101b4d] mb-4"></div>
            <p className="text-gray-500 font-medium">Loading your wishlist...</p>
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
            <Heart className="size-12 text-gray-300 mb-4" />
            <p className="text-[#101b4d] font-heading text-xl font-bold mb-2">Your wishlist is empty</p>
            <p className="text-gray-500 text-sm mb-6">Looks like you haven't added anything to your wishlist yet.</p>
            <Link 
              href="/products"
              className="px-8 py-3 rounded-full bg-[#101b4d] text-white text-sm font-bold shadow-md hover:bg-[#e6127d] transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            <ProductGrid products={currentItems} />
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white text-[#101b4d] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="size-5" />
                </button>
                
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-bold transition-colors ${
                        currentPage === i + 1 
                          ? 'bg-[#101b4d] text-white' 
                          : 'border border-gray-200 bg-white text-[#101b4d] hover:bg-gray-50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white text-[#101b4d] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
