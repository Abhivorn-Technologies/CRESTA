"use client";

import React, { useEffect, useState } from "react";
import { ArrowLeft, User, MapPin, Package, CreditCard, MessageCircle } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { Badge } from "@/components/ui/badge";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`/api/admin/orders/${id}`, { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        }
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e6127d]"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <h2 className="text-xl font-bold text-gray-900">Order details not found</h2>
        <Link href="/admin/orders" className="text-[#101b4d] font-semibold hover:underline">
          Return to Orders
        </Link>
      </div>
    );
  }

  const { shippingAddress, items, totalAmount, orderStatus, paymentStatus, paymentMethod, createdAt } = order;

  return (
    <div className="flex flex-col gap-6 pb-10 max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/orders" 
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#101b4d]">
            Order Details
          </h1>
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-2">
            #{order._id.substring(order._id.length - 6).toUpperCase()}
            <span>•</span>
            {new Date(createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        
        <div className="ml-auto flex items-center gap-3">
          <Badge className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border-0 ${
            orderStatus === 'delivered' ? 'bg-green-100 text-green-800' :
            orderStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
            orderStatus === 'shipped' ? 'bg-purple-100 text-purple-800' :
            'bg-orange-100 text-orange-800'
          }`}>
            {orderStatus}
          </Badge>
          <Badge className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg border-0 ${
            paymentStatus === 'completed' ? 'bg-blue-100 text-blue-800' :
            paymentStatus === 'refunded' ? 'bg-gray-100 text-gray-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
          </Badge>
          
          {shippingAddress?.phone && (
            <button
              onClick={() => {
                const message = `*Cresta Global*\n✅ *Order Successfully Placed!*\n\nGreat news! We have successfully received your order for premium desserts.\n\n*Order Details:*\n📦 Order ID: #${order._id.substring(order._id.length - 6).toUpperCase()}\n💰 Total Amount: ₹${totalAmount.toFixed(2)}\n\nYour order is currently being processed and will be dispatched shortly. We will notify you once it is out for delivery! 🚚\n\nTo track your order, visit your Cresta Dashboard.`;
                const whatsappUrl = `https://wa.me/91${shippingAddress.phone.replace("+91", "").trim()}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
              }}
              className="ml-2 flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              <MessageCircle className="size-4" /> WhatsApp
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Order Items */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Package className="size-4" /> Ordered Items ({items.length})
            </h3>
            <div className="flex flex-col gap-4">
              {items.map((item: any, i: number) => (
                <div key={i} className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="size-16 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Package className="size-6 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h4 className="font-bold text-gray-900">{item.name}</h4>
                    <span className="text-xs text-gray-500">{item.category} • {item.volume}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-[#101b4d]">₹{item.price.toFixed(2)}</span>
                    <span className="text-xs text-gray-500 font-medium">Qty: {item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <CreditCard className="size-4" /> Payment Summary
            </h3>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Shipping</span>
                <span className="font-medium text-gray-900">₹0.00</span>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-[#e6127d]">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 uppercase">
                  {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Shipping */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <User className="size-4" /> Customer Details
            </h3>
            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-bold text-gray-900">{shippingAddress?.firstName} {shippingAddress?.lastName}</p>
              <p className="text-sm text-gray-600">{shippingAddress?.email}</p>
              <p className="text-sm text-gray-600">{shippingAddress?.phone}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <MapPin className="size-4" /> Shipping Address
            </h3>
            <div className="flex flex-col gap-1 text-sm text-gray-700 leading-relaxed">
              <p>{shippingAddress?.address}</p>
              <p>{shippingAddress?.city}</p>
              <p>PIN: <span className="font-bold">{shippingAddress?.postalCode}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
