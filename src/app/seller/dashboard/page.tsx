"use client";

import { useEffect, useState } from "react";
import { 
  IndianRupee, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Activity, 
  Banknote,
  AlertTriangle,
  ChevronDown,
  Download
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { SalesChart } from "@/components/admin/charts/SalesChart";
import { ProductPieChart } from "@/components/admin/charts/ProductPieChart";
import { RecentOrdersTable } from "@/components/admin/RecentOrdersTable";
import { Navbar } from "@/components/layout/Navbar";

export default function SellerDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("7days");

  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const response = await fetch(`/api/seller/dashboard?timeframe=${timeframe}&_cb=${Date.now()}`, { cache: "no-store" });
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();

    const onFocus = () => fetchDashboardData();
    window.addEventListener("focus", onFocus);
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === 'visible') fetchDashboardData();
    });

    const intervalId = setInterval(fetchDashboardData, 10000);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("visibilitychange", onFocus);
      clearInterval(intervalId);
    };
  }, [timeframe]);

  const handleExport = async (type: 'orders' | 'dashboard') => {
    try {
      window.open(`/api/admin/export?type=${type}`, "_blank");
      setIsExportMenuOpen(false);
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#f0f3fa]">
      <Navbar />
      
      <div className="flex-1 w-full max-w-[1400px] mx-auto px-4 md:px-6 pt-[120px] pb-24">
        {loading && !data ? (
          <div className="flex-1 w-full h-full flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e6127d]"></div>
          </div>
        ) : !data ? (
          <div className="flex-1 w-full flex items-center justify-center text-red-500 font-medium min-h-[400px]">
            Failed to load dashboard data. Please try again.
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-extrabold text-[#101b4d] tracking-tight">
                  Seller Dashboard
                </h1>
                <p className="text-gray-500 text-base mt-2">
                  Welcome back! Here's what's happening with your store today.
                </p>
              </div>
              <div className="hidden sm:flex gap-3 relative">
                <button 
                  onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                  className="px-5 py-2.5 bg-white text-[#101b4d] font-semibold text-sm rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 flex items-center gap-2"
                >
                  <Download className="size-4" />
                  Export Report
                  <ChevronDown className={`size-4 transition-transform ${isExportMenuOpen ? "rotate-180" : ""}`} />
                </button>
                
                {isExportMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setIsExportMenuOpen(false)}
                    />
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                      <button 
                        onClick={() => handleExport("orders")}
                        className="px-4 py-3 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium transition-colors"
                      >
                        Export Orders Data
                      </button>
                      <button 
                        onClick={() => handleExport("dashboard")}
                        className="px-4 py-3 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium border-t border-gray-50 transition-colors"
                      >
                        Export Dashboard Summary
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <StatCard 
                title="Total Sales" 
                value={`₹${data.kpis.totalSales.toLocaleString()}`} 
                icon={<IndianRupee className="size-5" />} 
                trend={{ value: data.trends.salesTrend, label: "from last week" }}
              />
              <StatCard 
                title="Total Orders" 
                value={data.kpis.totalOrders.toLocaleString()} 
                icon={<ShoppingCart className="size-5" />} 
                trend={{ value: data.trends.ordersTrend, label: "from last week" }}
              />
              <StatCard 
                title="Average Order Value" 
                value={`₹${data.kpis.averageOrderValue.toFixed(2)}`} 
                icon={<TrendingUp className="size-5" />} 
              />
              <StatCard 
                title="Total Customers" 
                value={data.kpis.customers.toLocaleString()} 
                icon={<Users className="size-5" />} 
                trend={{ value: data.trends.customersTrend, label: "from last week" }}
              />
              <StatCard 
                title="Active Orders" 
                value={data.kpis.activeOrders} 
                icon={<Activity className="size-5" />} 
              />
              <StatCard 
                title="Total Refund Amount" 
                value={`₹${data.kpis.totalRefunds.toFixed(2)}`} 
                icon={<Banknote className="size-5" />} 
                trend={{ value: data.trends.refundsTrend, label: "from last week" }}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 relative">
                {loading && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e6127d]"></div>
                  </div>
                )}
                <SalesChart 
                  data={data.salesData} 
                  timeframe={timeframe} 
                  onTimeframeChange={setTimeframe} 
                />
              </div>
              <div className="xl:col-span-1 relative">
                {loading && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl"></div>
                )}
                <ProductPieChart data={data.topProducts} />
              </div>
            </div>

            {/* Tables Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2">
                <RecentOrdersTable orders={data.recentOrders} />
              </div>
              
              {/* Low Stock Widget */}
              <div className="xl:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-[#101b4d] text-lg">Low Stock Alerts</h3>
                  <button className="text-[#e6127d] text-sm font-semibold hover:underline">View Inventory</button>
                </div>
                
                <div className="flex flex-col gap-3">
                  {data.lowStockProducts.map((product: any) => (
                    <div key={product.id} className="flex justify-between items-start p-3.5 border border-orange-200/60 bg-orange-50/30 rounded-xl hover:bg-orange-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 p-1.5 bg-orange-100 text-orange-600 rounded-md">
                          <AlertTriangle className="size-4" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <h4 className="text-sm font-semibold text-gray-900 leading-tight">{product.name}</h4>
                          <p className="text-[11px] text-orange-600 font-bold">{product.stock} units left</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {data.lowStockProducts.length === 0 && (
                    <div className="text-center py-6 text-gray-500 text-sm border border-dashed border-gray-200 rounded-xl">
                      Inventory levels look good.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
