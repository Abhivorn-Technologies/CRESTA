import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all users
    const users = await User.find({}).sort({ createdAt: -1 }).lean();
    
    // Fetch order counts per user using aggregation
    const orderCounts = await Order.aggregate([
      { $match: { userId: { $exists: true } } },
      { $group: { _id: "$userId", count: { $sum: 1 }, totalSpent: { $sum: "$totalAmount" } } }
    ]);

    const orderStatsMap = orderCounts.reduce((acc: any, curr: any) => {
      acc[curr._id.toString()] = { count: curr.count, totalSpent: curr.totalSpent };
      return acc;
    }, {});

    const customersWithStats = users.map((user: any) => ({
      ...user,
      orderCount: orderStatsMap[user._id.toString()]?.count || 0,
      totalSpent: orderStatsMap[user._id.toString()]?.totalSpent || 0
    }));

    return NextResponse.json(customersWithStats);
  } catch (error) {
    console.error("Admin Customers API GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
