"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Check } from "lucide-react";
import { Product } from "@/data/products";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid = React.memo(function ProductGrid({ products }: ProductGridProps) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { cart, addToCart, updateQuantity, setBuyNowItem } = useCart();
  const { user } = useAuth();
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
            <div className="relative w-full h-[240px] mb-5 rounded-[20px] bg-transparent flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-[1.02]">
              
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
                {product.badges.map((badge, idx) => (
                  <span 
                    key={idx} 
                    className={`text-[9px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm ${
                      badge.includes("OFF") ? "bg-[#fdeef6] text-[#e6127d]" : 
                      badge === "NEW" ? "bg-[#eef1ff] text-[#101b4d]" : "bg-[#fff7ed] text-[#f5a623]"
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
                className="object-contain"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col flex-1 px-1 items-center text-center lg:items-start lg:text-left">
            <span className="text-[10px] font-bold text-[#f5a623] tracking-[0.2em] uppercase mb-1.5">
              {product.category}
            </span>
            <h3 className="font-heading font-bold text-[#101b4d] text-lg leading-tight mb-1 group-hover:text-[#e6127d] transition-colors">
              {product.name}
            </h3>
            <span className="text-gray-400 text-xs font-medium mb-5">
              {product.volume}
            </span>

            <div className="mt-auto flex flex-row justify-between items-center w-full pt-2">
              <div className="flex flex-col">
                <span className="text-[#101b4d] font-bold text-lg">
                  ₹{product.price.toFixed(2)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-gray-400 text-xs line-through font-medium">
                    ₹{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              <div className="w-[84px]">
                {(() => {
                  const cartItem = cart.find(item => item.product.id === product.id);
                  return cartItem ? (
                    <div className="w-full h-8 flex items-center justify-between rounded-lg bg-[#e6127d] text-white shadow-sm overflow-hidden" onClick={(e) => e.preventDefault()}>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          updateQuantity(product.id, cartItem.quantity - 1);
                        }}
                        className="w-7 h-full flex items-center justify-center hover:bg-white/20 transition-colors font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold">{cartItem.quantity}</span>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          updateQuantity(product.id, cartItem.quantity + 1);
                        }}
                        className="w-7 h-full flex items-center justify-center hover:bg-white/20 transition-colors font-bold text-sm"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        addToCart(product, 1);
                      }}
                      className="w-full h-8 flex items-center justify-center rounded-lg border border-[#e6127d] text-[#e6127d] bg-[#fdf2f8] hover:bg-[#e6127d] hover:text-white text-[12px] font-bold transition-colors shadow-sm"
                    >
                      ADD
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
          </motion.div>
        </Link>
      );
      })}
    </div>
  );
});
