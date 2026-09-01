import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all users with role 'delivery_partner'
    // Sort by newest first
    const drivers = await User.find({ role: "delivery_partner" }).sort({ createdAt: -1 });
    
    return NextResponse.json({ drivers }, { status: 200 });
  } catch (error) {
    console.error("Fetch drivers error:", error);
    return NextResponse.json({ error: "Failed to fetch drivers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 400 });
    }

    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        return NextResponse.json({ error: "A user with this phone number already exists" }, { status: 400 });
      }
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the driver
    const newDriver = await User.create({
      name,
      email,
      phone: phone || undefined,
      password: hashedPassword,
      role: "delivery_partner", // Give them the correct role
    });

    return NextResponse.json({ 
      message: "Driver created successfully", 
      driver: { id: newDriver._id, name: newDriver.name, email: newDriver.email, role: newDriver.role }
    }, { status: 201 });
    
  } catch (error) {
    console.error("Create driver error:", error);
    return NextResponse.json({ error: "Failed to create driver" }, { status: 500 });
  }
}
