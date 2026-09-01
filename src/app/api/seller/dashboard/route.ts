import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const timeframe = searchParams.get("timeframe") || "7days";

    await connectToDatabase();

    // Determine the date filter based on timeframe
    const now = new Date();
    let startDate = new Date();
    
    if (timeframe === "today") {
      startDate.setHours(0, 0, 0, 0);
    } else if (timeframe === "7days") {
      startDate.setDate(now.getDate() - 7);
    } else if (timeframe === "30days") {
      startDate.setDate(now.getDate() - 30);
    } else if (timeframe === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else {
      startDate.setDate(now.getDate() - 7); // Default
    }

    // Previous period for trend calculation
    const duration = now.getTime() - startDate.getTime();
    const prevStartDate = new Date(startDate.getTime() - duration);

    // Fetch all needed base metrics concurrently
    const [
      currentOrders,
      prevOrders,
      totalUsers,
      prevUsers,
      activeOrdersCount,
      recentOrdersList,
      lowStockList,
      topProductsAgg,
      salesAgg
    ] = await Promise.all([
      // Current Period Orders
      Order.find({ createdAt: { $gte: startDate, $lte: now } }),
      // Previous Period Orders
      Order.find({ createdAt: { $gte: prevStartDate, $lt: startDate } }),
      // Total Users
      User.countDocuments(),
      // Previous Users
      User.countDocuments({ createdAt: { $lt: startDate } }),
      // Active Orders
      Order.countDocuments({ orderStatus: { $in: ["processing", "shipped", "pending"] } }),
      // Recent Orders
      Order.find().sort({ createdAt: -1 }).limit(5).lean(),
      // Low Stock Products
      Product.find({ inStock: false }).limit(5).lean(),
      // Top Products Aggregation
      Order.aggregate([
        { $match: { orderStatus: { $ne: "cancelled" } } },
        { $unwind: "$items" },
        { $group: { _id: "$items.name", value: { $sum: "$items.quantity" } } },
        { $sort: { value: -1 } },
        { $limit: 5 }
      ]),
      // Sales Chart Data Aggregation
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: now }, orderStatus: { $ne: "cancelled" } } },
        {
          $group: {
            _id: {
              $dateToString: { 
                format: timeframe === 'today' ? "%H:00" : (timeframe === 'year' ? "%Y-%m" : "%Y-%m-%d"), 
                date: "$createdAt" 
              }
            },
            sales: { $sum: "$totalAmount" },
            orders: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    // KPI Calculations
    const calculateSales = (orders: any[]) => orders.filter(o => o.orderStatus !== "cancelled").reduce((sum, o) => sum + o.totalAmount, 0);
    const calculateRefunds = (orders: any[]) => orders.filter(o => o.orderStatus === "cancelled" && o.cancellationInfo?.refundAmount).reduce((sum, o) => sum + o.cancellationInfo.refundAmount, 0);
    const calculateCount = (orders: any[]) => orders.filter(o => o.orderStatus !== "cancelled").length;

    const currentSales = calculateSales(currentOrders);
    const prevSales = calculateSales(prevOrders);
    const currentOrderCount = calculateCount(currentOrders);
    const prevOrderCount = calculateCount(prevOrders);
    const currentRefunds = calculateRefunds(currentOrders);
    const prevRefunds = calculateRefunds(prevOrders);

    // Trend Calculations
    const calcTrend = (current: number, prev: number) => prev === 0 ? (current > 0 ? 100 : 0) : Number((((current - prev) / prev) * 100).toFixed(1));

    // Colors for top products
    const colors = ["#4A2511", "#F3E5AB", "#E09540", "#FC5A8D", "#9CA3AF"];
    let topProducts = topProductsAgg.map((p, i) => ({
      name: p._id,
      value: p.value,
      color: colors[i % colors.length]
    }));

    // If no products, fallback
    if (topProducts.length === 0) {
      topProducts = [
        { name: "No Data", value: 1, color: "#e5e7eb" }
      ];
    }

    // Format Sales Data
    const generateDateLabels = (time: string, start: Date, end: Date) => {
      const labels = [];
      if (time === "today") {
        for (let i = 0; i < 24; i++) {
          labels.push(`${i.toString().padStart(2, '0')}:00`);
        }
      } else if (time === "year") {
        for (let i = 0; i < 12; i++) {
          const d = new Date(end.getFullYear(), i, 1);
          labels.push(`${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`);
        }
      } else {
        const current = new Date(start);
        while (current <= end) {
          labels.push(`${current.getFullYear()}-${(current.getMonth() + 1).toString().padStart(2, '0')}-${current.getDate().toString().padStart(2, '0')}`);
          current.setDate(current.getDate() + 1);
        }
      }
      return labels;
    };

    const expectedLabels = generateDateLabels(timeframe, startDate, now);
    const salesDataMap = new Map(salesAgg.map(s => [s._id, s]));

    let formattedSalesData = expectedLabels.map(label => {
      const existing = salesDataMap.get(label);
      return {
        date: label,
        sales: existing ? existing.sales : 0,
        orders: existing ? existing.orders : 0
      };
    });

    // Format Recent Orders
    const formatDate = (date: Date) => {
      const d = new Date(date);
      return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    };

    const formattedRecentOrders = recentOrdersList.map(o => ({
      id: o._id.toString().substring(0, 8).toUpperCase(),
      fullId: o._id.toString(),
      customer: o.shippingAddress?.firstName ? `${o.shippingAddress.firstName} ${o.shippingAddress.lastName}` : "Guest User",
      date: formatDate(o.createdAt),
      amount: o.totalAmount,
      status: o.orderStatus === "processing" && o.paymentStatus === "pending" ? "Pending" : 
              o.orderStatus === "processing" ? "Processing" : 
              o.orderStatus.charAt(0).toUpperCase() + o.orderStatus.slice(1)
    }));

    // Format Low Stock
    const formattedLowStock = lowStockList.map((p: any) => ({
      id: p._id.toString(),
      name: p.name,
      stock: 0,
      status: "Critical"
    }));

    const dashboardData = {
      kpis: {
        totalSales: currentSales,
        totalOrders: currentOrderCount,
        averageOrderValue: currentOrderCount > 0 ? (currentSales / currentOrderCount) : 0,
        customers: totalUsers,
        activeOrders: activeOrdersCount,
        totalRefunds: currentRefunds
      },
      trends: {
        salesTrend: calcTrend(currentSales, prevSales),
        ordersTrend: calcTrend(currentOrderCount, prevOrderCount),
        customersTrend: calcTrend(totalUsers, prevUsers),
        refundsTrend: calcTrend(currentRefunds, prevRefunds)
      },
      salesData: formattedSalesData,
      topProducts,
      recentOrders: formattedRecentOrders,
      lowStockProducts: formattedLowStock
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
