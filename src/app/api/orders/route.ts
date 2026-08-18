import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_please_change";

export async function POST(req: NextRequest) {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = await req.json();

    if (!items || items.length === 0 || !totalAmount || !shippingAddress) {
      return NextResponse.json({ error: "Missing required order data" }, { status: 400 });
    }

    let userId = null;
    const token = req.cookies.get("cresta_token")?.value;
    
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        userId = decoded.userId;
      } catch (e) {
        // Guest checkout
      }
    }

    let sessionId = req.cookies.get("cresta_session_id")?.value;
    
    // If no token and no session, we can't reliably link the order for viewing later,
    // but we can still process it. Better yet, create a session if it doesn't exist.
    if (!userId && !sessionId) {
      sessionId = crypto.randomUUID();
      // Wait, we can't easily set cookies in a POST API route without NextResponse,
      // but we return NextResponse, so we can set it there.
    }

    await connectToDatabase();

    const order = await Order.create({
      userId: userId || undefined,
      sessionId: sessionId || undefined,
      items,
      totalAmount,
      shippingAddress,
      paymentMethod: paymentMethod || "card",
      paymentStatus: "completed", // Simulating successful payment for now
      orderStatus: "processing",
    });

    const response = NextResponse.json({ message: "Order placed successfully", orderId: order._id }, { status: 201 });
    
    if (sessionId && !req.cookies.get("cresta_session_id")?.value) {
      response.cookies.set("cresta_session_id", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    return response;
  } catch (error) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
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

    if (!userId && !sessionId) {
      return NextResponse.json({ orders: [] }, { status: 200 });
    }

    await connectToDatabase();

    const query = userId && sessionId 
      ? { $or: [{ userId }, { sessionId }] }
      : userId 
        ? { userId } 
        : { sessionId };

    const orders = await Order.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
