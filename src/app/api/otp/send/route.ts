import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectToDatabase } from "@/lib/mongodb";
import Otp from "@/models/Otp";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectToDatabase();

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in MongoDB
    // Delete any existing OTPs for this email first
    await Otp.deleteMany({ email });
    await Otp.create({ email, otp: otpCode });

    console.log(`\n=========================================\nGENERATED OTP FOR ${email}: ${otpCode}\n=========================================\n`);

    // Setup Nodemailer
    let transporter;
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } else {
      // Use test account if no real credentials exist
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Cresta Global" <no-reply@crestaglobal.com>',
      to: email,
      subject: "Your Bank Verification OTP - Cresta Global",
      text: `Your OTP for dummy payment verification is: ${otpCode}. It will expire in 5 minutes.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #00113A;">Bank Verification OTP</h2>
          <p>You have requested an OTP to complete your dummy payment on Cresta Global.</p>
          <div style="background-color: #f6f3f2; padding: 15px; border-radius: 8px; margin: 20px 0; display: inline-block;">
            <p style="margin: 0; font-size: 14px; color: #666; text-transform: uppercase; font-weight: bold;">Your OTP</p>
            <p style="margin: 5px 0 0; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #00113A;">${otpCode}</p>
          </div>
          <p>This code will expire in 5 minutes.</p>
          <p style="color: #999; font-size: 12px; margin-top: 30px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (!process.env.EMAIL_USER) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
