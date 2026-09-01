"use client";

import { Eye } from "lucide-react";
import Link from "next/link";

interface RecentOrdersTableProps {
  orders: any[];
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-50 text-green-700";
      case "processing":
        return "bg-blue-50 text-blue-700";
      case "shipped":
        return "bg-purple-50 text-purple-700";
      case "cancelled":
        return "bg-red-50 text-red-700";
      default:
        return "bg-orange-50 text-orange-700";
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-[#101b4d] text-lg">Recent Orders</h3>
        <Link href="/admin/orders" className="text-[#e6127d] text-sm font-semibold hover:underline">
          View All
        </Link>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="text-gray-500 border-b border-gray-100">
            <tr>
              <th className="px-4 pb-3 font-semibold">Order ID</th>
              <th className="px-4 pb-3 font-semibold">Customer</th>
              <th className="px-4 pb-3 font-semibold">Date</th>
              <th className="px-4 pb-3 font-semibold">Amount</th>
              <th className="px-4 pb-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-4 py-4 font-bold text-[#101b4d]">{order.id}</td>
                <td className="px-4 py-4 font-medium text-gray-700">{order.customer}</td>
                <td className="px-4 py-4 text-gray-500">{order.date}</td>
                <td className="px-4 py-4 font-bold text-gray-900">₹{order.amount.toFixed(2)}</td>
                <td className="px-4 py-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-500">No recent orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
