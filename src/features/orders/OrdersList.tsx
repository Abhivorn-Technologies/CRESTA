"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Loader2, ChevronRight as ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { OrderCard } from "./OrderCard";

const ITEMS_PER_PAGE = 5;

const ORDER_STATUS_FILTERS = ["On the way", "Delivered", "Cancelled", "Returned"];
const currentYear = new Date().getFullYear();
const ORDER_TIME_FILTERS = ["Last 30 days", currentYear.toString(), (currentYear - 1).toString(), "Older"];

export function OrdersList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter States
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [timeFilters, setTimeFilters] = useState<string[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        if (res.ok) {
          const data = await res.json();
          const mappedOrders = data.orders.map((dbOrder: any) => ({
            id: dbOrder._id,
            items: dbOrder.items.length > 0 ? dbOrder.items.map((i: any) => i.name || i.product?.name).join(", ") : "Items",
            date: new Date(dbOrder.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            createdAt: dbOrder.createdAt,
            updatedAt: dbOrder.updatedAt,
            dbStatus: dbOrder.orderStatus,
            image: "/images/image 5.png",
            deliveryAddress: `${dbOrder.shippingAddress?.firstName || ""} ${dbOrder.shippingAddress?.lastName || ""}\n${dbOrder.shippingAddress?.address || ""}, ${dbOrder.shippingAddress?.city || ""}\n${dbOrder.shippingAddress?.postalCode || ""}`,
            status: 
              dbOrder.orderStatus === "delivered" ? "Delivered" :
              dbOrder.orderStatus === "cancelled" ? "Cancelled" : "Upcoming",
            statusTime: new Date(dbOrder.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
            totalAmount: dbOrder.totalAmount
          }));
          setOrders(mappedOrders);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const toggleStatusFilter = (status: string) => {
    setStatusFilters(prev => 
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
    setCurrentPage(1);
  };

  const toggleTimeFilter = (time: string) => {
    setTimeFilters(prev => 
      prev.includes(time) ? prev.filter(t => t !== time) : [...prev, time]
    );
    setCurrentPage(1);
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Status Filter
      if (statusFilters.length > 0) {
        // Map our simple status to the UI filter strings if needed
        let mappedStatus = order.status;
        if (order.status === "Upcoming") mappedStatus = "On the way";
        if (!statusFilters.includes(mappedStatus)) return false;
      }
      
      // Time Filter
      if (timeFilters.length > 0) {
        const orderDate = new Date(order.date);
        const orderYear = orderDate.getFullYear().toString();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const matchesTime = timeFilters.some(filter => {
          if (filter === "Last 30 days") {
            return orderDate >= thirtyDaysAgo;
          } else if (filter === currentYear.toString() || filter === (currentYear - 1).toString()) {
            return orderYear === filter;
          } else if (filter === "Older") {
            return parseInt(orderYear) < (currentYear - 1);
          }
          return false;
        });
        
        if (!matchesTime) return false;
      }
      
      // Search Filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        if (
          !order.id.toLowerCase().includes(query) && 
          !order.items.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [statusFilters, timeFilters, searchQuery, orders]);

  // Pagination Logic
  const totalItems = filteredOrders.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  return (
    <div className="w-full flex flex-col md:flex-row gap-8 items-start">
      
      {/* Left Sidebar - Filters */}
      <div className="w-full md:w-[280px] shrink-0 flex flex-col gap-5 md:sticky md:top-24">
        {/* Breadcrumb */}
        <div className="text-xs text-gray-500 flex items-center gap-2 mb-1 font-semibold uppercase tracking-wider">
          <Link href="/" className="hover:text-[#e6127d] transition-colors">Home</Link>
          <ChevronRightIcon className="size-3" />
          <Link href="/profile" className="hover:text-[#e6127d] transition-colors">My Account</Link>
          <ChevronRightIcon className="size-3" />
          <span className="text-[#101b4d]">My Orders</span>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-heading font-bold text-xl text-[#101b4d]">Filters</h2>
          </div>
          
          {/* Order Status */}
          <div className="px-4 md:px-6 py-3 md:py-5 border-b border-gray-100">
            <h3 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 md:mb-4">Order Status</h3>
            <div className="flex flex-row md:flex-col overflow-x-auto gap-2 md:gap-3.5 pb-1 md:pb-0 hide-scrollbar whitespace-nowrap">
              {ORDER_STATUS_FILTERS.map(status => (
                <label key={status} className="flex items-center gap-2.5 md:gap-3.5 cursor-pointer group shrink-0">
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={statusFilters.includes(status)}
                    onChange={() => toggleStatusFilter(status)}
                  />
                  <div className={`w-4 h-4 md:w-4.5 md:h-4.5 rounded shadow-sm border flex items-center justify-center transition-all ${statusFilters.includes(status) ? 'bg-[#101b4d] border-[#101b4d]' : 'bg-gray-50 border-gray-200 group-hover:border-[#101b4d]'}`}>
                    {statusFilters.includes(status) && <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-[1px]" />}
                  </div>
                  <span className={`text-[13px] md:text-[15px] font-medium transition-colors ${statusFilters.includes(status) ? 'text-[#101b4d]' : 'text-gray-600 group-hover:text-[#101b4d]'}`}>{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Order Time */}
          <div className="px-4 md:px-6 py-3 md:py-5">
            <h3 className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 md:mb-4">Order Time</h3>
            <div className="flex flex-row md:flex-col overflow-x-auto gap-2 md:gap-3.5 pb-1 md:pb-0 hide-scrollbar whitespace-nowrap">
              {ORDER_TIME_FILTERS.map(time => (
                <label key={time} className="flex items-center gap-2.5 md:gap-3.5 cursor-pointer group shrink-0">
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={timeFilters.includes(time)}
                    onChange={() => toggleTimeFilter(time)}
                  />
                  <div className={`w-4 h-4 md:w-4.5 md:h-4.5 rounded shadow-sm border flex items-center justify-center transition-all ${timeFilters.includes(time) ? 'bg-[#101b4d] border-[#101b4d]' : 'bg-gray-50 border-gray-200 group-hover:border-[#101b4d]'}`}>
                    {timeFilters.includes(time) && <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-[1px]" />}
                  </div>
                  <span className={`text-[13px] md:text-[15px] font-medium transition-colors ${timeFilters.includes(time) ? 'text-[#101b4d]' : 'text-gray-600 group-hover:text-[#101b4d]'}`}>{time}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-6 w-full mt-2 md:mt-7">
        
        {/* Search Bar */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex items-stretch focus-within:ring-[3px] focus-within:ring-[#101b4d]/10 focus-within:border-[#101b4d] transition-all">
          <div className="flex-1 flex items-center px-4 md:px-6 min-w-0">
            <Search className="size-4 md:size-5 text-gray-400 mr-2 md:mr-3 shrink-0" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-3 md:py-4 text-[13px] md:text-[15px] text-[#101b4d] font-medium outline-none placeholder:text-gray-400 placeholder:font-normal truncate"
            />
          </div>
          <button className="bg-[#101b4d] text-white px-4 sm:px-5 md:px-12 text-[13px] md:text-[15px] font-bold hover:bg-[#0a1133] transition-colors shrink-0">
            Search
          </button>
        </div>

        {/* Orders List */}
        <div className="flex flex-col gap-4 sm:gap-6 min-h-[500px]">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center bg-white border border-gray-100 rounded-2xl shadow-sm">
              <Loader2 className="size-8 animate-spin text-[#e6127d]" />
            </div>
          ) : currentOrders.length > 0 ? (
            currentOrders.map(order => (
              <OrderCard 
                key={order.id} 
                order={order} 
                onOrderUpdate={(id, status) => {
                  setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
                }}
              />
            ))
          ) : (
            <div className="flex-1 flex flex-col gap-4 items-center justify-center py-20 text-center bg-white border border-gray-100 rounded-2xl shadow-sm">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                <Search className="size-8 text-gray-300" />
              </div>
              <span className="text-xl font-heading font-bold text-[#101b4d]">No orders found</span>
              <p className="text-gray-500 text-sm max-w-[250px]">We couldn't find any orders matching your current filters.</p>
              <button 
                onClick={() => { setStatusFilters([]); setTimeFilters([]); setSearchQuery(""); }}
                className="mt-2 px-6 py-2.5 bg-[#f0f3fa] text-[#101b4d] font-bold text-sm rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-[14px] font-medium text-gray-500">
              Showing <span className="font-bold text-[#101b4d]">{startIndex + 1}</span> to <span className="font-bold text-[#101b4d]">{Math.min(endIndex, totalItems)}</span> of <span className="font-bold text-[#101b4d]">{totalItems}</span> orders
            </span>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#101b4d] disabled:opacity-50 disabled:hover:bg-white transition-colors"
              >
                <ChevronLeft className="size-5" />
              </button>
              
              <div className="flex items-center gap-1 mx-2">
                 {Array.from({ length: totalPages }).map((_, i) => (
                    <button 
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                        currentPage === i + 1 
                          ? "bg-[#101b4d] text-white shadow-md shadow-[#101b4d]/20" 
                          : "text-gray-500 hover:bg-gray-50 hover:text-[#101b4d]"
                      }`}
                    >
                      {i + 1}
                    </button>
                 ))}
              </div>

              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#101b4d] disabled:opacity-50 disabled:hover:bg-white transition-colors"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
