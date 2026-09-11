import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import { sendOrderPlacedWhatsApp } from "@/services/whatsapp.service";
import { notifyAdminNewOrder } from "@/lib/notify-admin-order";

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !dbOrderId) {
      return NextResponse.json({ error: "Missing required verification data" }, { status: 400 });
    }

    // Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    await connectToDatabase();

    const order = await Order.findById(dbOrderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update order status to paid
    order.paymentStatus = "completed";
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    await order.save();

    // Send real-time notification to admin dashboard
    await notifyAdminNewOrder(order);

    // Send WhatsApp notification
    if (order.shippingAddress?.phone) {
      sendOrderPlacedWhatsApp(order.shippingAddress.phone, order._id.toString(), order.totalAmount).catch(err => 
        console.error("Failed to send WhatsApp notification", err)
      );
    }

    return NextResponse.json({ success: true, message: "Payment verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
