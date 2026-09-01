"use client";

import { Search } from "lucide-react";
import { ProductCategory } from "@/data/products";

interface ProductSidebarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: ProductCategory | "All Categories";
  setSelectedCategory: (c: ProductCategory | "All Categories") => void;
}



import { useState, useEffect } from "react";

export function ProductSidebar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}: ProductSidebarProps) {
  const [categories, setCategories] = useState<string[]>(["All Categories"]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          const fetchedCategories = data.categories.map((c: any) => c.label);
          setCategories(["All Categories", ...fetchedCategories]);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    }
    fetchCategories();
  }, []);

  return (
    <aside className="w-full lg:w-[280px] shrink-0 flex flex-col gap-8 bg-white border-r border-gray-100 pr-6">
      
      {/* Filters Title */}
      <div>
        <h3 className="font-heading font-bold text-[#101b4d] text-xl mb-4">Filters</h3>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-4" />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#101b4d] focus:ring-1 focus:ring-[#101b4d] transition-all"
          />
        </div>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-heading font-bold text-[#101b4d] text-sm mb-4">Categories</h4>
        <div className="flex flex-row overflow-x-auto pb-2 lg:pb-0 lg:flex-col gap-2 lg:gap-1.5 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category as ProductCategory | "All Categories")}
              className={`whitespace-nowrap text-left px-4 py-2 rounded-lg text-[13px] font-medium transition-colors border lg:border-transparent ${
                selectedCategory === category 
                  ? "bg-[#eef1ff] text-[#101b4d] font-bold border-[#101b4d]/20" 
                  : "text-[#6b7280] hover:bg-gray-50 hover:text-[#101b4d] border-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row lg:flex-col gap-8 w-full">
        {/* Price Range */}
        <div className="flex-1">
          <h4 className="font-heading font-bold text-[#101b4d] text-sm mb-4">Price Range</h4>
          <div className="flex items-center gap-2">
            <input 
              type="number" 
              placeholder="Min ₹" 
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#101b4d] text-center"
            />
            <span className="text-gray-400">-</span>
            <input 
              type="number" 
              placeholder="Max ₹" 
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#101b4d] text-center"
            />
          </div>
        </div>

        {/* Sort By */}
        <div className="flex-1">
          <h4 className="font-heading font-bold text-[#101b4d] text-sm mb-4">Sort By</h4>
          <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-[#101b4d] focus:outline-none focus:border-[#101b4d] appearance-none bg-white">
            <option>Recommended</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>
      
    </aside>
  );
}
