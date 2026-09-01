"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductSidebar } from "./ProductSidebar";
import { ProductGrid } from "./ProductGrid";
import { ProductCategory, Product } from "@/data/products";

export function ProductsLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "All Categories">("All Categories");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`/api/products?_cb=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();

    const onFocus = () => fetchProducts();
    window.addEventListener("focus", onFocus);
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === 'visible') fetchProducts();
    });

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Filter by category
      if (selectedCategory !== "All Categories" && product.category !== selectedCategory) {
        return false;
      }
      
      // 2. Filter by search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        if (!product.name.toLowerCase().includes(query) && !product.category.toLowerCase().includes(query)) {
          return false;
        }
      }
      
      return true;
    });
  }, [searchQuery, selectedCategory, products]);

  const itemsPerPage = 6; // Or however many products per page
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading) {
    return (
      <div className="w-full flex-1 py-32 flex flex-col items-center justify-center">
        <div className="h-10 w-10 border-4 border-[#101b4d] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[#101b4d] font-semibold text-lg animate-pulse">Loading amazing flavors...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full items-stretch lg:items-start">
      <ProductSidebar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <div className="flex-1 w-full flex flex-col">
        <ProductGrid products={currentItems} />
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 mb-8">
            <button 
              onClick={() => {
                setCurrentPage(Math.max(1, currentPage - 1));
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white text-[#101b4d] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="size-5" />
            </button>
            
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => {
                    setCurrentPage(i + 1);
                    window.scrollTo({ top: 300, behavior: 'smooth' });
                  }}
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
              onClick={() => {
                setCurrentPage(Math.min(totalPages, currentPage + 1));
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white text-[#101b4d] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
