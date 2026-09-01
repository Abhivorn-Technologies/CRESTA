import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User, { IAddress } from "@/models/User";
import jwt from "jsonwebtoken";

export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_please_change";

function getUserIdFromToken(req: NextRequest): string | null {
  const token = req.cookies.get("cresta_token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: addressId } = await params;
    const updateData = await req.json();

    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.addresses) {
      user.addresses = [];
    }

    const addressIndex = user.addresses.findIndex((addr: IAddress) => addr._id?.toString() === addressId);
    if (addressIndex === -1) {
      return NextResponse.json({ 
        error: "Address not found",
        debug: {
          receivedId: addressId,
          dbIds: user.addresses.map((a: IAddress) => ({ id: a._id?.toString(), name: a.fullName }))
        }
      }, { status: 404 });
    }

    // If setting as default, unset others
    if (updateData.isDefault && !user.addresses[addressIndex].isDefault) {
      user.addresses.forEach((addr: IAddress) => (addr.isDefault = false));
    }

    // Update fields
    Object.assign(user.addresses[addressIndex], updateData);
    
    // Explicitly tell Mongoose that the addresses array was modified
    user.markModified('addresses');

    await user.save();
    return NextResponse.json({ success: true, address: user.addresses[addressIndex] }, { status: 200 });
  } catch (error) {
    console.error("Update Address Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: addressId } = await params;

    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.addresses) {
      user.addresses = [];
    }

    const initialLength = user.addresses.length;
    user.addresses = user.addresses.filter((addr: IAddress) => addr._id?.toString() !== addressId);

    if (user.addresses.length === initialLength) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // If we deleted the default address, make the first remaining address the default
    if (initialLength > 0 && user.addresses.length > 0 && !user.addresses.some((a: IAddress) => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Delete Address Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
