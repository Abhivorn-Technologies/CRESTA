import React from "react";
import Image from "next/image";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface CartItemProps {
  product: Product;
  quantity: number;
}

export const CartItem = React.memo(function CartItem({ product, quantity }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] mb-4 p-4 gap-4 transition-all hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
      
      {/* Top Section: Image & Details */}
      <div className="flex flex-row gap-4 w-full">
        
        {/* Left: Product Image */}
        <div className="relative w-20 h-24 sm:w-28 sm:h-28 bg-transparent flex-shrink-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image 
              src={product.image} 
              alt={product.name} 
              fill 
              className="object-contain drop-shadow-sm" 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
            />
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex-1 flex flex-col justify-between pt-1">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-start gap-2">
              <span className="text-[10px] font-bold text-[#f5a623] tracking-widest uppercase line-clamp-1">
                {product.category}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                Instant (30m)
              </span>
            </div>
            <h3 className="font-heading font-bold text-[#101b4d] text-sm sm:text-base leading-snug hover:text-[#e6127d] transition-colors cursor-pointer line-clamp-2">
              {product.name}
            </h3>
          </div>
          
          <div className="flex items-center flex-wrap gap-2 mt-2">
            <span className="font-bold text-[#101b4d] text-base sm:text-lg">
              ₹{(product.price * quantity).toFixed(2)}
            </span>
            {product.originalPrice > product.price && (
              <>
                <span className="text-gray-400 text-xs font-medium line-through">
                  ₹{(product.originalPrice * quantity).toFixed(2)}
                </span>
                <span className="text-[#e6127d] text-[10px] font-bold bg-[#fdeef6] px-1.5 py-0.5 rounded-full">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Quantity & Actions */}
      <div className="flex items-center justify-between w-full pt-3 border-t border-gray-100/80">
        
        {/* Quantity Selector */}
        <div className="flex items-center gap-1 border border-gray-200 rounded-full shadow-sm shrink-0 bg-white p-0.5">
          <button 
            onClick={() => updateQuantity(product.id, quantity - 1)}
            className="flex h-7 w-7 rounded-full items-center justify-center text-gray-500 hover:text-[#101b4d] hover:bg-gray-100 transition-colors"
          >
            <span className="text-lg leading-none -mt-0.5">-</span>
          </button>
          <span className="text-xs font-bold w-6 text-center text-[#101b4d]">
            {quantity}
          </span>
          <button 
            onClick={() => updateQuantity(product.id, quantity + 1)}
            className="flex h-7 w-7 rounded-full items-center justify-center text-gray-500 hover:text-[#101b4d] hover:bg-gray-100 transition-colors"
          >
            <span className="text-lg leading-none -mt-0.5">+</span>
          </button>
        </div>

        {/* Action Links */}
        <div className="flex items-center gap-4 text-[11px] font-bold tracking-wider uppercase">
          <button className="text-gray-400 hover:text-[#101b4d] transition-colors flex items-center gap-1">
            Save <span className="hidden sm:inline">for later</span>
          </button>
          <button 
            onClick={() => removeFromCart(product.id)}
            className="text-[#e6127d] hover:opacity-70 transition-opacity"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
});
