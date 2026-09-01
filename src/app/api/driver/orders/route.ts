import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_please_change";

async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cresta_token")?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (error) {
    return null;
  }
}

export async function GET(req: Request) {
  try {
    const user = await verifyAuth();
    if (!user || user.role !== "delivery_partner") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // 1. Fetch available orders (order_placed or order_confirmed, without a driver)
    const availableOrders = await Order.find({
      orderStatus: { $in: ["order_placed", "order_confirmed", "preparing", "processing", "pending"] },
      deliveryPartnerId: { $exists: false }
    }).sort({ createdAt: 1 });

    // 2. Fetch orders assigned to this driver (assigned, out_for_delivery, arriving)
    const activeOrders = await Order.find({
      deliveryPartnerId: user.userId,
      orderStatus: { $in: ["assigned", "out_for_delivery", "arriving"] }
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      availableOrders,
      activeOrders
    });

  } catch (error) {
    console.error("Error fetching driver orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
