import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    // Sort by createdAt descending
    const orders = await Order.find({}).lean()
      .sort({ createdAt: -1 })
      .populate({
        path: "userId",
        model: User,
        select: "name email",
      })
      .lean();

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Admin Orders API GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
