import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import OrderModel from "@/models/Order";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { bankName, accountHolder, accountNumber, ifscCode } = body;

    if (!bankName || !accountHolder || !accountNumber || !ifscCode) {
      return NextResponse.json({ error: "All bank details are required" }, { status: 400 });
    }

    const cleanBankName = bankName.trim();
    const cleanAccountHolder = accountHolder.trim();
    const cleanAccountNumber = accountNumber.trim();
    const cleanIfsc = ifscCode.trim().toUpperCase();

    if (!/^[a-zA-Z\s.&-']{2,100}$/.test(cleanBankName)) {
      return NextResponse.json({ error: "Invalid Bank Name format" }, { status: 400 });
    }

    if (!/^[a-zA-Z\s.\-'/&]{2,100}$/.test(cleanAccountHolder) || !/[a-zA-Z]/.test(cleanAccountHolder)) {
      return NextResponse.json({ error: "Invalid Account Holder format" }, { status: 400 });
    }

    if (!/^\d{6,20}$/.test(cleanAccountNumber)) {
      return NextResponse.json({ error: "Invalid Account Number format" }, { status: 400 });
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleanIfsc)) {
      return NextResponse.json({ error: "Invalid IFSC Code format" }, { status: 400 });
    }

    await connectToDatabase();

    const order = await OrderModel.findById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.orderStatus !== "cancelled") {
      return NextResponse.json({ error: "Refunds can only be requested for cancelled orders" }, { status: 400 });
    }

    // Bypass Mongoose strict schema caching issues during development
    await OrderModel.updateOne(
      { _id: id },
      {
        $set: {
          refundDetails: {
            bankName: cleanBankName,
            accountHolder: cleanAccountHolder,
            accountNumber: cleanAccountNumber,
            ifscCode: cleanIfsc,
            status: "pending",
            submittedAt: new Date(),
          }
        }
      },
      { strict: false }
    );

    return NextResponse.json({ success: true, message: "Refund details submitted successfully" });
  } catch (error) {
    console.error("Error submitting refund details:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
