"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";

export function RelatedProducts({ currentProductId }: { currentProductId?: string }) {
  const { cart, addToCart, setBuyNowItem, updateQuantity } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
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
          {relatedItems.map((item, i) => {
            const slug = item.name.toLowerCase().replace(/[\s-]/g, "");
            const isWished = isInWishlist(item.id);
            return (
            <Link 
              href={`/products/${slug}`}
              key={item.id}
              className="relative group bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden flex flex-col p-5"
            >
              {/* Badges */}
              <div className="absolute top-5 left-5 z-10 flex flex-col gap-1.5 items-start">
                {item.badges.length > 0 && (
                  <span className={`text-[8px] font-bold tracking-wider uppercase px-2 py-1 rounded-full shadow-sm ${
                    item.badges[0].includes("OFF") ? "bg-[#fdeef6] text-[#e6127d]" : "bg-[#eef1ff] text-[#101b4d]"
                  }`}>
                    {item.badges[0]}
                  </span>
                )}
              </div>

              {/* Heart Icon */}
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWishlist(item.id);
                }}
                className={`absolute top-5 right-5 z-10 hover:text-[#e6127d] transition-colors bg-white rounded-full p-1.5 shadow-sm border border-gray-50 ${
                  isWished ? 'text-[#e6127d]' : 'text-gray-300'
                }`}
              >
                <Heart className="size-4" fill={isWished ? "#e6127d" : "none"} />
              </button>

              {/* Product Image */}
              <div className="relative w-full h-[180px] mt-8 mb-6 flex items-center justify-center transition-transform duration-500 group-hover:scale-[1.02]">
                <Image 
                  src={item.image} 
                  alt={item.name} 
                  fill 
                  className="object-contain" 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                />
              </div>

              {/* Product Info */}
              <div className="flex flex-col flex-1 items-center text-center">
                <span className="text-[10px] font-bold text-[#f5a623] tracking-widest uppercase mb-1">
                  {item.category}
                </span>
                <h3 className="font-heading font-bold text-[#101b4d] text-lg leading-tight mb-1">{item.name}</h3>
                <span className="text-gray-400 text-xs font-medium mb-4">
                  {item.volume}
                </span>
                
                <div className="mt-auto flex flex-row justify-between items-center w-full pt-2">
                  <div className="flex flex-col">
                    <span className="text-[#101b4d] font-bold text-lg">
                      ₹{item.price.toFixed(2)}
                    </span>
                    {item.originalPrice > item.price && (
                      <span className="text-gray-400 text-xs line-through font-medium">
                        ₹{item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  
                  <div className="w-[84px]">
                    {(() => {
                      const cartItem = cart.find(i => i.product.id === item.id);
                      return cartItem ? (
                        <div className="w-full h-8 flex items-center justify-between rounded-lg bg-[#e6127d] text-white shadow-sm overflow-hidden" onClick={(e) => e.preventDefault()}>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              updateQuantity(item.id, cartItem.quantity - 1);
                            }}
                            className="w-7 h-full flex items-center justify-center hover:bg-white/20 transition-colors font-bold text-sm"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold">{cartItem.quantity}</span>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              updateQuantity(item.id, cartItem.quantity + 1);
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
                            addToCart(item, 1);
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
            </Link>
          )})}
        </div>

      </div>
    </div>
  );
}
