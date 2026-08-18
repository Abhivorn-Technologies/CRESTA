import Image from "next/image";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface CartItemProps {
  product: Product;
  quantity: number;
}

export function CartItem({ product, quantity }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex py-5 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-4 sm:px-6 -mx-4 sm:-mx-6 gap-4 sm:gap-6 items-start">
      
      {/* Left: Product Image */}
      <div className="relative w-24 sm:w-32 h-28 sm:h-36 rounded-xl bg-[#f8f9fa] flex-shrink-0 flex items-center justify-center p-2 border border-gray-100 shadow-sm">
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

      {/* Middle: Details & Actions */}
      <div className="flex-1 flex flex-col gap-1 mt-1">
        <span className="text-[10px] font-bold text-[#f5a623] tracking-[0.2em] uppercase">
          {product.category}
        </span>
        <h3 className="font-heading font-semibold text-[#101b4d] text-base sm:text-lg leading-snug hover:text-[#e6127d] transition-colors cursor-pointer truncate-2-lines">
          {product.name}
        </h3>
        
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold text-[#101b4d] text-lg sm:text-xl">
            ₹{(product.price * quantity).toFixed(2)}
          </span>
          <span className="text-gray-400 text-sm font-medium line-through">
            ₹{(product.originalPrice * quantity).toFixed(2)}
          </span>
          <span className="text-emerald-600 text-sm font-bold">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off
          </span>
        </div>

        {/* Quantity & Actions (Merged into main column) */}
        <div className="flex items-center gap-6 mt-5 pt-4 border-t border-gray-100 flex-wrap w-fit">
          {/* Quantity Selector */}
          <div className="flex items-center gap-3 border border-gray-200 rounded shadow-sm shrink-0 bg-white">
            <button 
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="flex h-7 w-8 items-center justify-center text-gray-500 hover:text-[#101b4d] hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg leading-none -mt-0.5">-</span>
            </button>
            <span className="text-sm font-bold w-8 text-center text-[#101b4d] bg-gray-50 py-1 border-x border-gray-100">
              {quantity}
            </span>
            <button 
              onClick={() => updateQuantity(product.id, quantity + 1)}
              className="flex h-7 w-8 items-center justify-center text-gray-500 hover:text-[#101b4d] hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg leading-none -mt-0.5">+</span>
            </button>
          </div>

          {/* Action Links */}
          <div className="flex items-center gap-4 text-[13px] sm:text-sm font-bold tracking-wide">
            <button className="text-[#101b4d] hover:text-[#e6127d] transition-colors uppercase">
              Save for later
            </button>
            <button 
              onClick={() => removeFromCart(product.id)}
              className="text-[#101b4d] hover:text-red-500 transition-colors uppercase"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      {/* Right: Delivery Information (Using the empty space) */}
      <div className="hidden sm:flex flex-col w-32 shrink-0 mt-1 pl-4 border-l border-gray-100 h-full">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
          Delivery Info
        </span>
        <span className="text-sm font-bold text-emerald-600">
          Expected by
        </span>
        <span className="text-sm font-bold text-gray-700">
          Tomorrow
        </span>
      </div>

    </div>
  );
}
