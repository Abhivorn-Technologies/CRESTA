"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, Minus, Plus, ShoppingCart, Snowflake, Truck, ChevronDown, ChevronUp } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

export const ProductHero = React.memo(function ProductHero({ product }: { product: Product }) {
  const { cart, addToCart, setBuyNowItem, updateQuantity } = useCart();
  const [activeSize, setActiveSize] = useState("1 Litre");
  const [activeImage, setActiveImage] = useState(0);
  const [isDescOpen, setIsDescOpen] = useState(true);
  const [isNutriOpen, setIsNutriOpen] = useState(false);

  const images = [
    product.image,
    product.image,
    product.image,
    product.image
  ];



  return (
    <div className="w-full max-w-[1152px] mx-auto flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
      
      {/* Left Column: Images (544px) */}
      <div className="w-full lg:w-[544px] flex flex-col gap-4 shrink-0">
        
        {/* Main Image */}
        <div className="w-full h-[544px] relative bg-[#f8f9fa] border border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
          
          {/* Badges */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <div className="bg-[#1a1a1a] text-[#f5a623] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
              <Star className="size-3 fill-[#f5a623]" /> Bestseller
            </div>
            <div className="bg-[#00113A] text-[#f5a623] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full flex items-center gap-1">
              <Snowflake className="size-3" /> Cold Chain
            </div>
          </div>

          <Image 
            src={images[activeImage]} 
            alt={product.name} 
            fill 
            className="object-contain p-8"
            priority
           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        </div>

        {/* Thumbnails */}
        <div className="grid grid-cols-4 gap-4">
          {images.map((img, index) => (
            <button 
              key={index}
              onClick={() => setActiveImage(index)}
              className={`aspect-square relative bg-[#F8F3F2] border rounded-lg overflow-hidden transition-all ${
                activeImage === index ? 'border-[#00113A] ring-1 ring-[#00113A]' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image src={img} alt={`Thumbnail ${index + 1}`} fill className="object-contain p-2"  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            </button>
          ))}
        </div>

      </div>

      {/* Right Column: Product Info (544px) */}
      <div className="w-full lg:w-[544px] flex flex-col pt-2 lg:pt-0">
        
        {/* Breadcrumbs & Title */}
        <span className="text-xs font-bold text-[#00113A] uppercase tracking-[0.1em] mb-3">{product.category}</span>
        <h1 className="font-heading text-4xl md:text-[40px] font-bold text-[#00113A] leading-tight mb-4">
          {product.name}
        </h1>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Experience the finest {product.name} crafted with premium ingredients. A signature Cresta Global delicacy designed for perfect indulgence.
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="size-4 text-[#f5a623] fill-[#f5a623]" />
            ))}
          </div>
          <span className="text-xs text-gray-500 font-medium">124 Reviews</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3 mb-8">
          <span className="font-heading text-3xl font-bold text-[#00113A]">₹{product.price.toFixed(2)}</span>
          <span className="text-sm text-gray-400 line-through">₹{product.originalPrice.toFixed(2)}</span>
        </div>

        {/* Size Variant */}
        <div className="flex flex-col gap-3 mb-8">
          <span className="text-xs font-bold text-[#00113A]">Size Variant</span>
          <div className="flex flex-wrap gap-3">
            {[product.volume, '1 Litre (Bulk)'].map((size) => (
              <button
                key={size}
                onClick={() => setActiveSize(size)}
                className={`px-5 py-2.5 rounded text-xs font-bold transition-all border ${
                  activeSize === size 
                    ? 'border-[#00113A] bg-white text-[#00113A] ring-1 ring-[#00113A]'
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity & Actions */}
        <div className="flex flex-col gap-3 mb-10">
          
          <div className="w-[140px]">
            {(() => {
              const cartItem = cart.find(item => item.product.id === product.id);
              return cartItem ? (
                <div className="w-full h-12 flex items-center justify-between rounded-lg bg-[#e6127d] text-white shadow-sm overflow-hidden">
                  <button onClick={() => updateQuantity(product.id, cartItem.quantity - 1)} className="w-12 h-full flex items-center justify-center hover:bg-white/20 transition-colors font-bold text-lg">
                    <Minus className="size-5" />
                  </button>
                  <span className="text-base font-bold">{cartItem.quantity}</span>
                  <button onClick={() => updateQuantity(product.id, cartItem.quantity + 1)} className="w-12 h-full flex items-center justify-center hover:bg-white/20 transition-colors font-bold text-lg">
                    <Plus className="size-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => addToCart(product, 1)}
                  className="w-full h-12 flex items-center justify-center rounded-lg border border-[#e6127d] text-[#e6127d] bg-[#fdf2f8] hover:bg-[#e6127d] hover:text-white text-sm font-bold transition-colors shadow-sm"
                >
                  ADD TO CART
                </button>
              );
            })()}
          </div>
        </div>

        {/* Feature Badges */}
        <div className="flex flex-col sm:flex-row gap-6 mb-10 border-y border-gray-200 py-6">
          <div className="flex gap-3 flex-1">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <Snowflake className="size-4 text-[#00113A]" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-[#00113A]">100% Cold Chain</span>
              <span className="text-[10px] text-gray-500 leading-tight">Maintained at -18°C from warehouse to your door.</span>
            </div>
          </div>
          <div className="flex gap-3 flex-1">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <Truck className="size-4 text-[#00113A]" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-[#00113A]">Delivery</span>
              <span className="text-[10px] text-gray-500 leading-tight">Order by 4 PM for professional next day delivery.</span>
            </div>
          </div>
        </div>

        {/* Accordions */}
        <div className="flex flex-col gap-0 border-b border-gray-200">
          
          {/* Detailed Description */}
          <div className="flex flex-col border-t border-gray-200">
            <button 
              onClick={() => setIsDescOpen(!isDescOpen)}
              className="py-4 flex justify-between items-center text-sm font-bold text-[#00113A] hover:text-[#e6127d] transition-colors"
            >
              Detailed Description
              {isDescOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
            {isDescOpen && (
              <div className="pb-4 text-xs text-gray-600 leading-relaxed flex flex-col gap-3">
                <p>
                  Perfect for catering events, high-end dessert menus, or simply treating yourself to a professional-grade dessert at home. Packaged in our proprietary insulated tubs to ensure perfect texture upon arrival.
                </p>
              </div>
            )}
          </div>

          {/* Ingredients & Nutrition */}
          <div className="flex flex-col border-t border-gray-200">
            <button 
              onClick={() => setIsNutriOpen(!isNutriOpen)}
              className="py-4 flex justify-between items-center text-sm font-bold text-[#00113A] hover:text-[#e6127d] transition-colors"
            >
              Ingredients & Nutrition
              {isNutriOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
            {isNutriOpen && (
              <div className="pb-4 text-xs text-gray-600 leading-relaxed">
                Contains Milk, Soy, and Tree Nuts (Almonds). Made in a facility that also processes Peanuts and Wheat.
                <br /><br />
                Calories per serving: 280<br />
                Total Fat: 16g<br />
                Sugars: 24g
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
});
