import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Otp from "@/models/Otp";

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^\+?91[6-9][0-9]{9}$/;
    if (!phoneRegex.test(phone) && !/^[6-9][0-9]{9}$/.test(phone)) {
      return NextResponse.json({ error: "Invalid Indian phone number" }, { status: 400 });
    }

    // Format phone number to strictly be 10 digits internally or with +91. 
    // Let's just store whatever they send if it passes basic validation, but standardize it.
    const normalizedPhone = phone.replace("+91", "").trim();

    await connectToDatabase();

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in MongoDB
    // Delete any existing OTPs for this phone first
    await Otp.deleteMany({ phone: normalizedPhone });
    await Otp.create({ phone: normalizedPhone, otp: otpCode });

    console.log(`\n=========================================\n📲 GENERATED WHATSAPP OTP FOR ${normalizedPhone}: ${otpCode}\n=========================================\n`);

    // In a real production app, you would integrate Twilio or WhatsApp Cloud API here.
    // For now, we simulate success and log it to the console for testing.
    return NextResponse.json({ 
      message: "OTP sent successfully to WhatsApp",
      // Optional: return the OTP in development for easier testing
      ...(process.env.NODE_ENV === "development" ? { devOtp: otpCode } : {})
    }, { status: 200 });

  } catch (error) {
    console.error("Send Phone OTP Error:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
