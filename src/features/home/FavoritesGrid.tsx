"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, Plus } from "lucide-react";

import { useWishlist } from "@/context/WishlistContext";

const products = [
  {
    id: "1",
    name: "Strawberry Paleta",
    category: "ICE-CREAM - TUBS",
    volume: "100 ml",
    price: 59.00,
    originalPrice: 99.00,
    image: "/images/paleta-strawberry.png",
    badges: ["BEST SELLER", "15% OFF"]
  },
  {
    id: "2",
    name: "Mango Yogurt Paleta",
    category: "ICE-CREAM - TUBS",
    volume: "100 ml",
    price: 59.00,
    originalPrice: 99.00,
    image: "/images/paleta-mango.png",
    badges: ["NEW", "15% OFF"]
  },
  {
    id: "3",
    name: "Blueberry Paleta",
    category: "ICE-CREAM - TUBS",
    volume: "100 ml",
    price: 59.00,
    originalPrice: 99.00,
    image: "/images/paleta-blueberry.png",
    badges: ["BEST SELLER", "15% OFF"]
  },
  {
    id: "4",
    name: "Deliciousness",
    category: "ICE-CREAM",
    volume: "200ml",
    price: 159.00,
    originalPrice: 259.00,
    image: "/images/sundae-deliciousness.png",
    badges: ["BEST SELLER", "15% OFF"]
  }
];

export function FavoritesGrid() {
  const { toggleWishlist, isInWishlist } = useWishlist();

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
                key={product.id}
                className="relative group bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 overflow-hidden flex flex-col p-5"
              >
                {/* Badges */}
                <div className="absolute top-5 left-5 z-10 flex flex-col gap-1.5 items-start">
                  {product.badges.map((badge, idx) => (
                    <span 
                      key={idx} 
                      className={`text-[8px] font-bold tracking-wider uppercase px-2 py-1 rounded-full text-white shadow-sm ${
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
                  className={`absolute top-5 right-5 z-10 hover:text-[#e6127d] transition-colors bg-white rounded-full p-1.5 shadow-sm border border-gray-50 ${
                    isWished ? 'text-[#e6127d]' : 'text-gray-300'
                  }`}
                >
                  <Heart className="size-4" fill={isWished ? "#e6127d" : "none"} />
                </button>

                {/* Image */}
                <div className="relative w-full h-[180px] mt-8 mb-6 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                <Image 
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
              </div>

              {/* Details */}
              <div className="flex flex-col flex-1 items-center text-center sm:items-start sm:text-left">
                <span className="text-[10px] font-bold text-[#f5a623] tracking-widest uppercase mb-1">
                  {product.category}
                </span>
                <h3 className="font-heading font-bold text-[#101b4d] text-lg leading-tight mb-1">
                  {product.name}
                </h3>
                <span className="text-gray-400 text-xs font-medium mb-4">
                  {product.volume}
                </span>

                <div className="mt-auto flex items-end justify-between relative w-full px-2 sm:px-0">
                  <div className="flex flex-col items-start">
                    <span className="text-gray-400 text-xs line-through font-medium">
                      ₹{product.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-[#101b4d] font-bold text-xl">
                      ₹{product.price.toFixed(2)}
                    </span>
                  </div>
                  
                  {/* Add Button */}
                  <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#101b4d] text-white hover:bg-[#e6127d] hover:scale-110 shadow-md transition-all">
                    <Plus className="size-5" />
                  </button>
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
