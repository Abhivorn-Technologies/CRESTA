import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { sendOrderDeliveredWhatsApp } from "@/services/whatsapp.service";

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

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: orderId } = await params;
    const user = await verifyAuth();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: No valid token found" }, { status: 401 });
    }
    if (user.role !== "delivery_partner") {
      return NextResponse.json({ error: `Unauthorized: Invalid role '${user.role}'` }, { status: 401 });
    }

    await connectToDatabase();
    
    const body = await req.json();
    const { action, lat, lng, otp } = body;

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 1. Accept Order
    if (action === "accept") {
      if (order.deliveryPartnerId) {
        return NextResponse.json({ error: "Order already assigned" }, { status: 400 });
      }
      order.deliveryPartnerId = user.userId;
      order.orderStatus = "assigned";
      
      // Generate a 4 digit random OTP for delivery
      order.deliveryOtp = Math.floor(1000 + Math.random() * 9000).toString();
      await order.save();
      
      return NextResponse.json({ message: "Order accepted successfully", order });
    }

    // Ensure the order belongs to this driver for subsequent actions
    if (order.deliveryPartnerId?.toString() !== user.userId) {
      return NextResponse.json({ error: "Not assigned to this order" }, { status: 403 });
    }

    // 2. Start Delivery
    if (action === "start_delivery") {
      order.orderStatus = "out_for_delivery";
      await order.save();
      return NextResponse.json({ message: "Delivery started", order });
    }

    // 3. Update Live Location
    if (action === "update_location") {
      if (!lat || !lng) {
        return NextResponse.json({ error: "Lat and lng required" }, { status: 400 });
      }
      order.liveLocation = {
        lat,
        lng,
        updatedAt: new Date()
      };
      
      // If driver is close to destination (simulated via status change)
      if (order.orderStatus === "out_for_delivery") {
         // optionally auto transition to "arriving" here if distance is < X km
      }

      await order.save();
      return NextResponse.json({ message: "Location updated", liveLocation: order.liveLocation });
    }

    // 4. Verify OTP and Complete Delivery
    if (action === "verify_otp_and_complete") {
      if (!otp) {
        return NextResponse.json({ error: "OTP required" }, { status: 400 });
      }
      if (order.deliveryOtp !== otp) {
        return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
      }
      
      order.isOtpVerified = true;
      order.orderStatus = "delivered";
      await order.save();
      
      // Send WhatsApp Delivery Notification
      if (order.shippingAddress?.phone) {
        sendOrderDeliveredWhatsApp(order.shippingAddress.phone, order._id.toString()).catch(err => 
          console.error("Failed to send WhatsApp notification", err)
        );
      }
      
      return NextResponse.json({ message: "Delivery completed successfully", order });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
