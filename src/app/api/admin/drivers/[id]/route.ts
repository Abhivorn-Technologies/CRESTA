import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: "Driver ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    // Find the user first to ensure they are actually a delivery_partner
    const user = await User.findById(id);
    
    if (!user) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 });
    }
    
    if (user.role !== "delivery_partner") {
      return NextResponse.json({ error: "User is not a driver" }, { status: 403 });
    }

    await User.findByIdAndDelete(id);

    return NextResponse.json({ message: "Driver deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete driver error:", error);
    return NextResponse.json({ error: "Failed to delete driver" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { name, email, phone, password } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Driver ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findById(id);
    if (!user || user.role !== "delivery_partner") {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 });
    }

    // Check if new email is already in use by someone else
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return NextResponse.json({ error: "Email already in use" }, { status: 400 });
      }
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone !== undefined ? phone : user.phone;

    if (password) {
      const bcrypt = await import("bcryptjs");
      const salt = await bcrypt.default.genSalt(10);
      user.password = await bcrypt.default.hash(password, salt);
    }

    await user.save();

    return NextResponse.json({ message: "Driver updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Update driver error:", error);
    return NextResponse.json({ error: "Failed to update driver" }, { status: 500 });
  }
}
