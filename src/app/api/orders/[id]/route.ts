import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_please_change";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    let userId = null;
    const token = req.cookies.get("cresta_token")?.value;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        userId = decoded.userId;
      } catch (e) {
        // Guest
      }
    }

    const sessionId = req.cookies.get("cresta_session_id")?.value;

    await connectToDatabase();

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Authorization check
    // If order has userId, only that user can view it
    if (order.userId && order.userId.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If order has sessionId and no userId, only that session can view it
    if (!order.userId && order.sessionId && order.sessionId !== sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error("Fetch Order Details Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    let userId = null;
    const token = req.cookies.get("cresta_token")?.value;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        userId = decoded.userId;
      } catch (e) {
        // Guest
      }
    }

    const sessionId = req.cookies.get("cresta_session_id")?.value;

    await connectToDatabase();

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId && order.userId.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!order.userId && order.sessionId && order.sessionId !== sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (body.orderStatus) {
      order.orderStatus = body.orderStatus;
      await order.save();
    }

    return NextResponse.json({ message: "Order updated successfully", order }, { status: 200 });
  } catch (error) {
    console.error("Update Order Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
