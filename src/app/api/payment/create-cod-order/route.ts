import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import crypto from "crypto";
import { sendOrderPlacedWhatsApp } from "@/services/whatsapp.service";
import { notifyAdminNewOrder } from "@/lib/notify-admin-order";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_please_change";

export async function POST(req: NextRequest) {
  try {
    const { items, shippingAddress } = await req.json();

    if (!items || items.length === 0 || !shippingAddress) {
      return NextResponse.json({ error: "Missing required order data" }, { status: 400 });
    }

    // Connect to DB and calculate the actual total amount to prevent frontend manipulation
    await connectToDatabase();

    // We should fetch Setting here to get the live dynamic config instead of the default config
    const Setting = (await import("@/models/Setting")).Setting;
    const settings = await Setting.findOne();
    const config = settings ? {
      maxDistanceKm: settings.delivery.maxDistanceKm,
      freeDeliveryThreshold: settings.delivery.freeDeliveryThreshold,
      gstPercentage: settings.tax.gstPercentage,
    } : undefined;

    const { calculateOrderTotals } = await import("@/lib/calculations");
    const { findServiceableArea } = await import("@/services/delivery.service");
    const area = await findServiceableArea(shippingAddress.postalCode);
    const distanceKm = area ? area.distanceKm : null;
    const totals = calculateOrderTotals(items, distanceKm, config);
    
    if (totals.error) {
       return NextResponse.json({ error: totals.error }, { status: 400 });
    }

    const grandTotal = totals.grandTotal;

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

    let sessionId = req.cookies.get("cresta_session_id")?.value || crypto.randomUUID();

    // 1. Create a pending order in our database
    const order = await Order.create({
      userId: userId || undefined,
      sessionId: sessionId,
      items,
      totalAmount: grandTotal,
      shippingAddress,
      paymentMethod: "cod",
      paymentStatus: "pending", // Will be marked as paid when the delivery agent collects cash
      orderStatus: "processing",
    });

    // Send real-time notification to admin dashboard
    await notifyAdminNewOrder(order);

    // Send WhatsApp notification
    if (shippingAddress?.phone) {
      sendOrderPlacedWhatsApp(shippingAddress.phone, order._id.toString(), grandTotal).catch(err => 
        console.error("Failed to send WhatsApp notification", err)
      );
    }

    const response = NextResponse.json({
      success: true,
      dbOrderId: order._id
    }, { status: 201 });
    
    if (!req.cookies.get("cresta_session_id")?.value) {
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
    console.error("COD Order Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
