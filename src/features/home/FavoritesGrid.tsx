"use client";

import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, Plus } from "lucide-react";

import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export function FavoritesGrid() {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { cart, addToCart, setBuyNowItem, updateQuantity } = useCart();
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchProducts() {
      try {
        const res = await fetch(`/api/products?_cb=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (!mounted) return;
          // Just take the first 4 products as featured favorites
          setProducts(data.products.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch featured products:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchProducts();

    const onFocus = () => fetchProducts();
    window.addEventListener("focus", onFocus);
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === 'visible') fetchProducts();
    });

    return () => {
      mounted = false;
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  return (
    <section className="relative w-full py-16 bg-[#fdfdfd]">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center mb-12"
        >
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-[#101b4d] mb-3">
            Baskin Robbins Favorites
          </h2>
          <p className="text-[#6b7280] font-medium text-[13px] md:text-[14px] max-w-[500px]">
            Our hand-picked selection of premium flavors and signature creations that keep our customers coming back for more.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => {
            const isWished = isInWishlist(product.id);
            
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                key={product._id}
                className="relative group bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden flex flex-col p-5"
              >
                {/* Badges */}
                <div className="absolute top-5 left-5 z-10 flex flex-col gap-1.5 items-start">
                  <span className="text-[8px] font-bold tracking-wider uppercase px-2 py-1 rounded-full shadow-sm bg-[#fdeef6] text-[#e6127d]">
                    BEST SELLER
                  </span>
                  {!product.inStock && (
                    <span className="text-[8px] font-bold tracking-wider uppercase px-2 py-1 rounded-full text-white shadow-sm bg-gray-500">
                      SOLD OUT
                    </span>
                  )}
                </div>

                {/* Heart Icon */}
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product._id);
                  }}
                  className={`absolute top-5 right-5 z-10 hover:text-[#e6127d] transition-colors bg-white rounded-full p-1.5 shadow-sm border border-gray-50 ${
                    isWished ? 'text-[#e6127d]' : 'text-gray-300'
                  }`}
                >
                  <Heart className="size-4" fill={isWished ? "#e6127d" : "none"} />
                </button>

                {/* Image */}
                <div className="relative w-full h-[180px] mt-8 mb-6 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                {product.image ? (
                  <Image 
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                  />
                ) : (
                  <div className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 text-xs font-medium">
                    No Image
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col flex-1 items-center text-center">
                <span className="text-[10px] font-bold text-[#f5a623] tracking-widest uppercase mb-1">
                  {product.category}
                </span>
                <h3 className="font-heading font-bold text-[#101b4d] text-lg leading-tight mb-1">
                  {product.name}
                </h3>
                <span className="text-gray-400 text-xs font-medium mb-4">
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
                      const cartItem = cart.find(item => item.product.id === product._id);
                      return cartItem ? (
                        <div className="w-full h-8 flex items-center justify-between rounded-lg bg-[#e6127d] text-white shadow-sm overflow-hidden" onClick={(e) => e.preventDefault()}>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              updateQuantity(product._id, cartItem.quantity - 1);
                            }}
                            className="w-7 h-full flex items-center justify-center hover:bg-white/20 transition-colors font-bold text-sm"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold">{cartItem.quantity}</span>
                          <button 
                            onClick={(e) => {
                              e.preventDefault();
                              updateQuantity(product._id, cartItem.quantity + 1);
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
                            addToCart({
                              id: product._id,
                              name: product.name,
                              price: product.price,
                              originalPrice: product.originalPrice || product.price,
                              image: product.image,
                              category: product.category,
                              volume: product.volume,
                              badges: product.badges || []
                            }, 1);
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
            );
          })}
        </div>
      </div>
    </section>
  );
}
