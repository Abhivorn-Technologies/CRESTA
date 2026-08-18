"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Check } from "lucide-react";
import { Product } from "@/data/products";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  if (products.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
        <p className="text-[#101b4d] font-heading text-xl font-bold mb-2">No products found</p>
        <p className="text-gray-500 text-sm">Try adjusting your search or category filters.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, i) => {
        const isWished = isInWishlist(product.id);
        const slug = product.name.toLowerCase().replace(/\s+/g, "-");
        
        return (
          <Link href={`/products/${slug}`} key={product.id} className="block group">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="relative bg-white rounded-2xl border border-gray-100/80 shadow-sm hover:shadow-xl hover:border-transparent transition-all duration-300 overflow-hidden flex flex-col p-4 h-full"
            >
            {/* Image Container with Badges */}
            <div className="relative w-full h-[240px] mb-5 rounded-[20px] bg-[#f8f9fa] flex items-center justify-center overflow-hidden transition-colors duration-300 group-hover:bg-[#f1f3f5]">
              
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
                {product.badges.map((badge, idx) => (
                  <span 
                    key={idx} 
                    className={`text-[9px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full text-white shadow-sm ${
                      badge.includes("OFF") ? "bg-[#e6127d]" : 
                      badge === "NEW" ? "bg-[#101b4d]" : "bg-[#f5a623]"
                    }`}
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Heart Icon */}
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWishlist(product.id);
                }}
                className={`absolute top-4 right-4 z-10 hover:scale-110 transition-all bg-white rounded-full p-2 shadow-sm ${
                  isWished ? 'text-[#e6127d]' : 'text-gray-400 hover:text-[#e6127d]'
                }`}
              >
                <Heart className="size-4" fill={isWished ? "#e6127d" : "none"} />
              </button>

              {/* Product Image */}
              <div className="relative w-[80%] h-[80%] transition-transform duration-500 group-hover:scale-110">
              <Image 
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain drop-shadow-xl"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col flex-1 px-1 items-center text-center sm:items-start sm:text-left">
            <span className="text-[10px] font-bold text-[#f5a623] tracking-[0.2em] uppercase mb-1.5">
              {product.category}
            </span>
            <h3 className="font-heading font-bold text-[#101b4d] text-lg leading-tight mb-1 group-hover:text-[#e6127d] transition-colors">
              {product.name}
            </h3>
            <span className="text-gray-400 text-xs font-medium mb-5">
              {product.volume}
            </span>

            <div className="mt-auto flex flex-col sm:flex-row items-center sm:items-end justify-center sm:justify-between relative w-full px-2 sm:px-0 gap-3 sm:gap-0">
              <div className="flex flex-col items-center sm:items-start">
                <span className="text-gray-400 text-xs line-through font-medium mb-0.5">
                  ₹{product.originalPrice.toFixed(2)}
                </span>
                <span className="text-[#101b4d] font-bold text-xl">
                  ₹{product.price.toFixed(2)}
                </span>
              </div>
              
              {/* Add Button */}
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  addToCart(product, 1);
                  setAddedItems(prev => ({ ...prev, [product.id]: true }));
                  setTimeout(() => {
                    setAddedItems(prev => ({ ...prev, [product.id]: false }));
                  }, 2000);
                }}
                className={`flex h-10 items-center justify-center rounded-full transition-all duration-300 ${
                  addedItems[product.id]
                    ? "w-[88px] bg-[#10b981] text-white shadow-md shadow-[#10b981]/20 scale-105"
                    : "w-10 bg-[#101b4d] text-white hover:bg-[#e6127d] hover:scale-110 hover:shadow-lg"
                }`}
              >
                {addedItems[product.id] ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Check className="size-3.5 stroke-[3]" /> Added
                  </motion.div>
                ) : (
                  <Plus className="size-5" />
                )}
              </button>
            </div>
          </div>
          </motion.div>
        </Link>
      );
      })}
    </div>
  );
}
