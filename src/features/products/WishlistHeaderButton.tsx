"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

export function WishlistHeaderButton() {
  const { wishlistCount } = useWishlist();

  return (
    <Link 
      href="/wishlist" 
      className="flex items-center gap-2 px-6 py-2.5 rounded-full border-0 text-[#101b4d] text-sm font-bold bg-white hover:bg-gray-50 transition-all shadow-lg hover:-translate-y-0.5"
    >
      <Heart className={`size-4 ${wishlistCount > 0 ? 'text-[#e6127d] fill-[#e6127d]' : 'text-gray-400'}`} />
      <span>Wishlist ({wishlistCount})</span>
    </Link>
  );
}
