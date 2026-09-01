import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import Razorpay from "razorpay";

export const dynamic = 'force-dynamic';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const order = await Order.findById(id).lean();
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error("Admin Order Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    
    const { id } = await params;
    const body = await req.json();
    const { orderStatus, paymentStatus } = body;
    
    const updateData: any = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
      if (paymentStatus === "refunded") {
        updateData["refundDetails.status"] = "processed";

        // Fetch order to process Razorpay refund/payout
        const order = await Order.findById(id);
        if (!order) {
          return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        try {
          // Calculate refund amount in paise (multiply by 100)
          const refundAmount = Math.round(order.totalAmount * 100);

          if (order.paymentMethod === "online" && order.razorpayPaymentId) {
            // Standard Razorpay Refund to original payment source
            await razorpay.payments.refund(order.razorpayPaymentId, {
              amount: refundAmount
            });
          } else if (order.paymentMethod === "cod" && order.refundDetails?.bankName) {
            // RazorpayX Payout for COD orders
            const account_number = process.env.RAZORPAYX_ACCOUNT_NUMBER;
            if (!account_number) {
              throw new Error("RazorpayX Account Number is missing from environment variables (.env.local). Cannot process payouts without a valid RazorpayX account.");
            }

            const rzpX: any = razorpay;

            // 1. Create Contact
            const contact = await rzpX.contacts.create({
              name: order.refundDetails.accountHolder,
              type: "customer",
              reference_id: id.toString()
            });

            // 2. Create Fund Account
            const fundAccount = await rzpX.fundAccount.create({
              contact_id: contact.id,
              account_type: "bank_account",
              bank_account: {
                name: order.refundDetails.accountHolder,
                ifsc: order.refundDetails.ifscCode,
                account_number: order.refundDetails.accountNumber
              }
            });

            // 3. Issue Payout
            await rzpX.payouts.create({
              account_number: account_number,
              fund_account_id: fundAccount.id,
              amount: refundAmount,
              currency: "INR",
              mode: "IMPS",
              purpose: "refund",
              reference_id: id.toString(),
              queue_if_low_balance: true
            });
          }
        } catch (rzpError: any) {
          console.error("Razorpay API Error Details:", rzpError);
          const errorMsg = rzpError.error?.description || rzpError.message || "Failed to process transfer with Razorpay API.";
          return NextResponse.json({ error: `Razorpay Error: ${errorMsg}` }, { status: 400 });
        }
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No update data provided" }, { status: 400 });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Admin Order Update API Error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
