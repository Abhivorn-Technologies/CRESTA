import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  try {
    const { orderId, reason, bankDetails } = await req.json();

    if (!orderId || !bankDetails) {
      return NextResponse.json({ error: "Missing order ID or bank details" }, { status: 400 });
    }

    const { bankName, accountHolder, accountNumber, ifscCode } = bankDetails;

    if (!bankName || !accountHolder || !accountNumber || !ifscCode) {
      return NextResponse.json({ error: "Incomplete bank details provided" }, { status: 400 });
    }

    await connectToDatabase();

    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentMethod !== "cod") {
      return NextResponse.json({ error: "This endpoint is only for Cash on Delivery refunds" }, { status: 400 });
    }

    // Usually, COD refunds only happen if the user actually paid (e.g., returned an item after delivery).
    // So the paymentStatus should ideally be "completed".
    if (order.paymentStatus !== "completed") {
      return NextResponse.json({ error: "Order payment is not completed. Nothing to refund." }, { status: 400 });
    }

    // Save Bank Details and mark as processed (meaning Admin has manually transferred the money)
    order.refundDetails = {
      bankName,
      accountHolder,
      accountNumber,
      ifscCode,
      status: "processed",
      submittedAt: new Date(),
    };

    order.paymentStatus = "refunded";
    order.orderStatus = "cancelled"; // or 'returned' based on business logic
    order.cancellationInfo = {
      reason: reason || "Customer requested refund (COD)",
      date: new Date(),
      eligibleForRefund: true,
      refundAmount: order.totalAmount,
      cancellationFee: 0,
    };

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Refund recorded successfully via manual bank transfer."
    }, { status: 200 });

  } catch (error: any) {
    console.error("COD Refund Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
