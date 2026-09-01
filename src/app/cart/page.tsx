"use client";

import { Navbar } from "@/components/layout/Navbar";
import dynamic from "next/dynamic";

const CartItemList = dynamic(() => import("@/features/cart/CartItemList").then(m => m.CartItemList));
const OrderSummary = dynamic(() => import("@/features/cart/OrderSummary").then(m => m.OrderSummary));
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart } = useCart();

  if (cart.length === 0) {
    return (
      <main className="flex flex-1 flex-col bg-[#fcfdff]">
        <Navbar />
        <div className="mx-auto max-w-[1376px] w-full px-6 lg:px-10 pt-32 pb-10 md:pb-24 flex-1 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-[#101b4d] mb-4">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any premium treats yet.</p>
          <Link href="/products" className="bg-[#101b4d] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#e6127d] transition-colors">
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col bg-[#fcfdff]">
      <Navbar />
      
      <div className="mx-auto max-w-[1376px] w-full px-6 lg:px-10 pt-32 pb-10 md:pb-24 flex-1">
        
        {/* Cart Title */}
        <h1 className="font-heading text-sm text-gray-400 font-bold tracking-widest uppercase mb-8">
          CART
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column - Item List */}
          <div className="flex-1 max-w-[760px] w-full h-fit flex flex-col gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <CartItemList items={cart} />
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-[467px] flex-shrink-0">
            <OrderSummary />
          </div>

        </div>
      </div>
    </main>
  );
}
