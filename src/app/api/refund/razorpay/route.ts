import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Razorpay from "razorpay";

const getRazorpay = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "test_placeholder_secret",
  });
};

export async function POST(req: NextRequest) {
  try {
    const razorpay = getRazorpay();
    const { orderId, reason } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    await connectToDatabase();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentMethod !== "razorpay") {
      return NextResponse.json({ error: "Cannot use Razorpay refund for a non-Razorpay order" }, { status: 400 });
    }

    if (order.paymentStatus !== "completed") {
      return NextResponse.json({ error: "Order payment is not completed, cannot refund" }, { status: 400 });
    }

    if (!order.razorpayPaymentId) {
      return NextResponse.json({ error: "Missing Razorpay payment ID on order" }, { status: 400 });
    }

    // Amount to refund in paise (Razorpay format)
    const amountInPaise = Math.round(order.totalAmount * 100);

    // Call Razorpay Refund API
    const refund = await razorpay.payments.refund(order.razorpayPaymentId, {
      amount: amountInPaise,
      speed: "optimum", // 'optimum' for instant where possible, 'normal' for standard 5-7 days
    });

    // Update order in our database
    order.paymentStatus = "refunded";
    order.orderStatus = "cancelled";
    order.cancellationInfo = {
      reason: reason || "Customer requested refund",
      date: new Date(),
      eligibleForRefund: true,
      refundAmount: order.totalAmount,
      cancellationFee: 0,
    };
    await order.save();

    return NextResponse.json({
      success: true,
      refundId: refund.id,
      status: refund.status
    }, { status: 200 });

  } catch (error: any) {
    console.error("Razorpay Refund Error:", error);
    return NextResponse.json({ 
      error: "Failed to process Razorpay refund",
      details: error?.error?.description || error.message
    }, { status: 500 });
  }
}
