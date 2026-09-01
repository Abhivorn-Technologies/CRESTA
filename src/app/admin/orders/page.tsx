"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { ShoppingCart } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch(`/api/admin/orders?_cb=${Date.now()}`, { cache: "no-store" });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-700";
      case "processing": return "bg-blue-100 text-blue-700";
      case "shipped": return "bg-purple-100 text-purple-700";
      case "cancelled": return "bg-red-100 text-red-700";
      case "refunded": return "bg-gray-100 text-gray-700";
      default: return "bg-orange-100 text-orange-700";
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(orders.map(o => o._id === orderId ? updatedOrder : o));
      }
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e6127d]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-[#101b4d]">Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track customer orders.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-semibold w-[120px]">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Payment</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="size-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 border border-gray-100">
                        <ShoppingCart className="size-5" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900">No Orders Found</h3>
                      <p className="text-sm text-gray-500">There are currently no orders in the system.</p>
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
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ₹{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-0 capitalize text-[11px] font-semibold px-2.5 py-0.5">
                        {order.paymentStatus || "pending"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`${getStatusColor(order.orderStatus)} capitalize text-[11px] font-bold px-2.5 py-0.5 border-0`}>
                        {order.orderStatus || "pending"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select 
                        className="text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-[#e6127d]/20 focus:border-[#e6127d]/50 transition-all cursor-pointer hover:border-gray-300 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-[length:14px_14px] bg-no-repeat bg-[position:right_8px_center] pr-8"
                        value={order.orderStatus || "pending"}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
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
