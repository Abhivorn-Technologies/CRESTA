import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Otp from "@/models/Otp";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_please_change";

export async function POST(req: NextRequest) {
  try {
    const { phone, otp } = await req.json();

    if (!phone || !otp) {
      return NextResponse.json({ error: "Phone and OTP are required" }, { status: 400 });
    }

    const normalizedPhone = phone.replace("+91", "").trim();

    await connectToDatabase();

    // Verify OTP
    const otpRecord = await Otp.findOne({ phone: normalizedPhone }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return NextResponse.json({ error: "OTP expired or not found" }, { status: 400 });
    }

    if (otpRecord.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // OTP is valid, delete it
    await Otp.deleteOne({ _id: otpRecord._id });

    // Check if user exists by phone
    let user = await User.findOne({ phone: normalizedPhone });

    if (!user) {
      // Create new user for phone-based auth
      // We set a dummy email just in case legacy systems expect a string, 
      // but since we made it optional and sparse, it's safe.
      const dummyEmail = `${normalizedPhone}@phone.crestaglobal.com`;
      
      user = await User.create({
        name: "Customer",
        phone: normalizedPhone,
        email: dummyEmail,
        role: "user",
      });
      console.log("Created new user via Phone OTP:", user._id);
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, phone: user.phone, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Create response and set cookie
    const response = NextResponse.json(
      { 
        message: "Login successful", 
        user: { id: user._id, name: user.name, phone: user.phone, role: user.role } 
      },
      { status: 200 }
    );

    response.cookies.set("cresta_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Verify Phone OTP Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
