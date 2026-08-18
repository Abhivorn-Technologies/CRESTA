"use client";

import { useState, useMemo, useEffect } from "react";
import { ProductSidebar } from "./ProductSidebar";
import { ProductGrid } from "./ProductGrid";
import { ProductCategory, Product } from "@/data/products";

export function ProductsLayout() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | "All Categories">("All Categories");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
      }
    }
    fetchProducts();
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
      <ProductGrid products={filteredProducts} />
    </div>
  );
}
