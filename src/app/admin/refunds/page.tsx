"use client";

import React, { useEffect, useState } from "react";
import { Inbox } from "lucide-react";
import Link from "next/link";

export default function RefundsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch(`/api/admin/orders?_cb=${Date.now()}`, { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          // Filter for cancelled or refunded orders that actually require/have a refund
          const refundCandidates = data.filter((o: any) => 
            o.paymentStatus === "refunded" || (o.orderStatus === "cancelled" && o.cancellationInfo?.eligibleForRefund === true)
          );
          setOrders(refundCandidates);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();

    const onFocus = () => fetchOrders();
    window.addEventListener("focus", onFocus);
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === 'visible') fetchOrders();
    });

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e6127d]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#101b4d]">Refunds</h1>
        <p className="text-gray-500 text-sm mt-1">Manage and track customer refunds.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold w-[120px]">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Date Cancelled</th>
                <th className="px-6 py-4 font-semibold">Refund Amount</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="size-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 border border-gray-100">
                        <Inbox className="size-5" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">No Pending Refunds</h3>
                      <p className="text-sm text-gray-500">There are currently no cancelled orders that require a refund processing.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-[#101b4d]">
                      #{order._id.substring(order._id.length - 6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 group-hover:text-[#e6127d] transition-colors">
                          {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                        </span>
                        <span className="text-xs text-gray-500">{order.shippingAddress?.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(order.updatedAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 font-semibold text-red-600">
                      ₹{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {order.paymentStatus === "refunded" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-50 text-green-700">Refunded</span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-700 animate-pulse">Pending Refund</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/refunds/${order._id}`}
                        className="inline-flex items-center text-xs font-semibold px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-[#101b4d] hover:text-white hover:border-[#101b4d] transition-colors"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
