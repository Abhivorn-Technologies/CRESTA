"use client";

import * as React from "react";
import { CartProvider } from "@/features/cart/cart-context";
import { WishlistProvider } from "@/features/wishlist/wishlist-context";

export function SiteProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </CartProvider>
  );
}
