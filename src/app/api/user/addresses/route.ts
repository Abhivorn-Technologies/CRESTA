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

export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(userId).select("addresses");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log("DEBUG: user.addresses from DB:", JSON.stringify(user.addresses, null, 2));
    return NextResponse.json({ addresses: user.addresses || [] }, { status: 200 });
  } catch (error) {
    console.error("Fetch Addresses Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fullName, phone, street, apartment, city, state, postalCode, isDefault } = await req.json();

    if (!fullName || !phone || !street || !city || !postalCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newAddress = {
      fullName,
      phone,
      street,
      apartment: apartment || "",
      city,
      state: state || "",
      postalCode,
      isDefault: Boolean(isDefault),
    };

    if (!user.addresses) {
      user.addresses = [];
    }

    // If this is set to default, unset all other defaults
    if (newAddress.isDefault) {
      user.addresses.forEach((addr: IAddress) => (addr.isDefault = false));
    } else if (user.addresses.length === 0) {
      // If it's the first address, make it default automatically
      newAddress.isDefault = true;
    }

    user.addresses.push(newAddress);
    
    // Explicitly tell Mongoose that the addresses array was modified
    user.markModified('addresses');
    
    await user.save();

    // Return the newly added address (the last one in the array, which gets an _id assigned by Mongoose)
    const addedAddress = user.addresses[user.addresses.length - 1];

    return NextResponse.json({ success: true, address: addedAddress }, { status: 201 });
  } catch (error) {
    console.error("Add Address Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
