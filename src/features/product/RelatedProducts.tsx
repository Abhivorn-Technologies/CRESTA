"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

export function RelatedProducts({ currentProductId }: { currentProductId?: string }) {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);

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
      }
    }
    fetchProducts();
  }, []);
  
  // Get 4 random products or fallback
  const relatedItems = products
    .filter((p) => p.id !== currentProductId)
    .slice(0, 4);

  return (
    <div className="w-full bg-white mt-16 lg:mt-24 pb-24 border-t border-gray-100 pt-16">
      <div className="w-full max-w-[1280px] mx-auto px-6 flex flex-col">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#00113A]">
              You May Also Like
            </h2>
            <p className="text-sm text-gray-500">
              Discover other premium flavors from our curated collection.
            </p>
          </div>
          <Link 
            href="/products" 
            className="text-xs font-bold text-[#00113A] hover:text-[#e6127d] transition-colors flex items-center gap-1 uppercase tracking-wider"
          >
            View Full Catalog <span className="text-lg leading-none">+</span>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedItems.map((item) => {
            const slug = item.name.toLowerCase().replace(/[\s-]/g, "");
            return (
            <Link 
              href={`/products/${slug}`}
              key={item.id}
              className="w-full max-w-[270px] mx-auto h-[362px] bg-[#FCF9F8] border border-[#E5E2E1] rounded-[12px] flex flex-col overflow-hidden group hover:shadow-md transition-shadow relative"
            >
              {/* Product Image */}
              <div className="w-full h-[200px] relative p-4 flex items-center justify-center shrink-0">
                {item.badges.length > 0 && (
                  <div className="absolute top-3 left-3 bg-[#00113A] text-white text-[8px] font-bold uppercase tracking-wider px-2 py-1 rounded">
                    {item.badges[0]}
                  </div>
                )}
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  fill 
                  className="object-contain p-8 group-hover:scale-105 transition-transform duration-500" 
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col flex-1 border-t border-[#E5E2E1]">
                <h3 className="font-bold text-sm text-[#00113A] mb-1 line-clamp-1">{item.name}</h3>
                <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2 mb-auto">
                  Experience the finest {item.name}.
                </p>
                
                <div className="flex items-center justify-between mt-4">
                  <span className="font-heading font-bold text-lg text-[#00113A]">₹{item.price.toFixed(2)}</span>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(item, 1);
                    }}
                    className="w-8 h-8 rounded-full bg-white border border-[#E5E2E1] flex items-center justify-center text-[#00113A] hover:bg-[#00113A] hover:text-white transition-colors shadow-sm"
                  >
                    <ShoppingCart className="size-3.5" />
                  </button>
                </div>
              </div>
            </Link>
          )})}
        </div>

      </div>
    </div>
  );
}
