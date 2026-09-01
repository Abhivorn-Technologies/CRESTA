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
      if (body.orderStatus === "cancelled") {
        // 1. Verify 5-minute window (using updatedAt if available since that marks payment completion)
        const startTime = order.updatedAt ? new Date(order.updatedAt).getTime() : new Date(order.createdAt).getTime();
        const elapsed = new Date().getTime() - startTime;
        if (elapsed > 5 * 60 * 1000) {
          return NextResponse.json({ error: "Order cancellation window (5 minutes) has expired." }, { status: 400 });
        }

        // 2. Verify current status
        if (order.orderStatus !== "processing" && order.orderStatus !== "pending") {
          return NextResponse.json({ error: "Order cannot be cancelled because it is already being prepared or dispatched." }, { status: 400 });
        }

        // 3. Determine if eligible for manual refund (only if paid online)
        const isOnlinePayment = order.paymentMethod === "razorpay" && order.paymentStatus === "completed";

        await Order.updateOne(
          { _id: id },
          { 
            $set: { 
              orderStatus: body.orderStatus,
              cancellationInfo: {
                reason: "Requested by customer within 5 minutes",
                date: new Date(),
                eligibleForRefund: isOnlinePayment,
                refundAmount: isOnlinePayment ? order.totalAmount : 0,
                cancellationFee: 0,
              }
            } 
          },
          { strict: false }
        );
        order.orderStatus = body.orderStatus;
        
        // Send a notification to Admin about cancellation
        try {
          const { Notification } = require("@/models/Notification");
          await Notification.create({
            title: "Order Cancelled",
            description: `Order #${id.substring(id.length - 6).toUpperCase()} has been cancelled by the customer. Waiting for bank details for refund.`,
            type: "inventory",
            unread: true,
          });
        } catch (e) {
          console.error("Failed to create cancellation notification", e);
        }
      } else {
        await Order.updateOne(
          { _id: id },
          { $set: { orderStatus: body.orderStatus } },
          { strict: false }
        );
        order.orderStatus = body.orderStatus;
      }
    }

    return NextResponse.json({ message: "Order updated successfully", order }, { status: 200 });
  } catch (error) {
    console.error("Update Order Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
