"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

interface WishlistContextType {
  wishlist: string[]; // Array of product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth(); // Depend on auth state

  // Load wishlist on mount & when user changes
  useEffect(() => {
    async function loadWishlist() {
      setIsLoading(true);
      try {
        // First try to load from local storage to be fast and handle guests
        const local = localStorage.getItem("cresta_wishlist");
        let localItems: string[] = local ? JSON.parse(local) : [];
        
        // Optimistically set to local storage items
        setWishlist(localItems);

        // Fetch from API to sync
        const res = await fetch("/api/wishlist");
        if (res.ok) {
          const data = await res.json();
          const serverItems = data.items || [];
          
          // Merge local and server items (unique)
          const merged = Array.from(new Set([...localItems, ...serverItems]));
          setWishlist(merged);
          localStorage.setItem("cresta_wishlist", JSON.stringify(merged));
          
          // If merged is different from server, we should push to server (optional, but good for login)
          if (user && serverItems.length !== merged.length) {
            await fetch("/api/wishlist/sync", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items: merged }),
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch wishlist", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadWishlist();
  }, [user]); // Re-run when user logs in/out

  const toggleWishlist = async (productId: string) => {
    // Optimistic UI update
    const updateWishlist = (prev: string[]) => {
      let newWishlist;
      if (prev.includes(productId)) {
        newWishlist = prev.filter((id) => id !== productId);
      } else {
        newWishlist = [...prev, productId];
      }
      localStorage.setItem("cresta_wishlist", JSON.stringify(newWishlist));
      return newWishlist;
    };
    
    setWishlist(updateWishlist);

    // Background sync with API
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data.items) {
           setWishlist(data.items);
           localStorage.setItem("cresta_wishlist", JSON.stringify(data.items));
        }
      }
    } catch (error) {
      console.error("Failed to sync wishlist", error);
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlist.length,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
