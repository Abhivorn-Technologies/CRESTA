"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { Product } from "@/data/products";
import { mockProducts as allProducts } from "@/data/products";
import { useAuth } from "@/context/AuthContext";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user, isLoading } = useAuth();
  
  // Ref to track if we just merged to prevent infinite loops
  const hasMergedRef = useRef(false);

  // Initialize and sync
  useEffect(() => {
    if (isLoading) return;

    const initCart = async () => {
      // 1. Get local cart
      let localCart: CartItem[] = [];
      const savedCart = localStorage.getItem("cresta_cart");
      if (savedCart) {
        try {
          localCart = JSON.parse(savedCart);
        } catch (e) {
          console.error("Failed to parse local cart", e);
        }
      }

      // 2. If guest, just use local cart
      if (!user) {
        setCart(localCart);
        setIsInitialized(true);
        return;
      }

      // 3. If logged in and haven't merged yet this session
      if (user && !hasMergedRef.current) {
        hasMergedRef.current = true;
        try {
          // Fetch DB cart
          const res = await fetch("/api/cart");
          const data = await res.json();
          let dbItems = data.items || [];

          // Merge local items into DB items
          if (localCart.length > 0) {
            const mergedMap = new Map<string, number>();
            
            // Add DB items to map
            dbItems.forEach((item: any) => {
              mergedMap.set(item.productId, item.quantity);
            });

            // Add local items to map
            localCart.forEach((item: CartItem) => {
              const current = mergedMap.get(item.product.id) || 0;
              mergedMap.set(item.product.id, current + item.quantity);
            });

            // Reconstruct payload
            const payloadItems = Array.from(mergedMap.entries()).map(([productId, quantity]) => ({
              productId,
              quantity
            }));

            // Sync merged to DB
            const postRes = await fetch("/api/cart", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ items: payloadItems })
            });
            const postData = await postRes.json();
            dbItems = postData.items || [];
            
            // Clear local cart as it's merged
            localStorage.removeItem("cresta_cart");
          }

          // Resolve DB items to full CartItem objects
          const resolvedCart: CartItem[] = dbItems.map((item: any) => {
            const product = allProducts.find(p => p.id === item.productId);
            return product ? { product, quantity: item.quantity } : null;
          }).filter(Boolean);

          setCart(resolvedCart);
        } catch (error) {
          console.error("Failed to sync cart", error);
        }
      }
      
      setIsInitialized(true);
    };

    initCart();
  }, [user, isLoading]);

  // Sync mutations
  const syncCart = async (newCart: CartItem[]) => {
    setCart(newCart);
    if (!isInitialized) return;

    if (user) {
      // Sync to DB
      try {
        const payloadItems = newCart.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }));
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: payloadItems })
        });
      } catch (e) {
        console.error("Failed to update remote cart", e);
      }
    } else {
      // Sync to local
      localStorage.setItem("cresta_cart", JSON.stringify(newCart));
    }
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    const existing = cart.find(item => item.product.id === product.id);
    let newCart;
    if (existing) {
      newCart = cart.map(item => 
        item.product.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCart = [...cart, { product, quantity }];
    }
    syncCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(item => item.product.id !== productId);
    syncCart(newCart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const newCart = cart.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    );
    syncCart(newCart);
  };

  const clearCart = () => {
    syncCart([]);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
