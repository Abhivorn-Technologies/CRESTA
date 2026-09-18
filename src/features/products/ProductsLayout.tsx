"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductSidebar } from "./ProductSidebar";
import { ProductGrid } from "./ProductGrid";
import { ProductCategory, Product } from "@/data/products";

export function ProductsLayout({ initialProducts = [] }: { initialProducts?: Product[] }) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "All Categories">(
    (categoryParam as ProductCategory) || "All Categories"
  );
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync category when query param changes
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam as ProductCategory);
    }
  }, [categoryParam]);

  // Reset page when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Keep state in sync with server initialProducts if provided
  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
    }
  }, [initialProducts]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`/api/products?_cb=${Date.now()}`, { 
        cache: "no-store",
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  }, []);

  useEffect(() => {
    // If no initial products, fetch immediately
    if (!initialProducts || initialProducts.length === 0) {
      fetchProducts();
    }

    // 1. Cross-tab real-time sync via BroadcastChannel
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== "undefined" && "BroadcastChannel" in window) {
        bc = new BroadcastChannel("products_sync");
        bc.onmessage = (event) => {
          if (event.data?.type === "PRODUCT_UPDATED" && event.data.product) {
            const updated = event.data.product;
            setProducts((prev) =>
              prev.map((p) =>
                (p.id === updated.id || (p as any)._id === updated._id || (p as any)._id === updated.id)
                  ? { ...p, ...updated }
                  : p
              )
            );
          }
          fetchProducts();
        };
      }
    } catch (e) {
      console.error("BroadcastChannel error:", e);
    }

    // 2. Storage event sync
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cresta_products_last_update") {
        fetchProducts();
      }
    };
    window.addEventListener("storage", handleStorage);

    // 3. Custom in-tab event sync
    const handleCustomUpdate = () => fetchProducts();
    window.addEventListener("cresta_products_update", handleCustomUpdate);

    // 4. Focus & visibility change sync
    const onFocus = () => fetchProducts();
    window.addEventListener("focus", onFocus);
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") fetchProducts();
    });

    // 5. Light poll every 3.5s for instant updates
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        fetchProducts();
      }
    }, 3500);

    return () => {
      if (bc) bc.close();
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cresta_products_update", handleCustomUpdate);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("visibilitychange", onFocus);
      clearInterval(interval);
    };
  }, [fetchProducts, initialProducts]);

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

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
