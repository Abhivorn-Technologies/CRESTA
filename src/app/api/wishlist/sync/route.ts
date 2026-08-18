import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_please_change";

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();
    
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid items" }, { status: 400 });
    }

    const token = req.cookies.get("cresta_token")?.value;
    let userId = null;
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        userId = decoded.userId;
      } catch (e) {
        // ignore
      }
    }
    
    if (!userId) {
        return NextResponse.json({ message: "Not logged in, no need to sync server-side for local" }, { status: 200 });
    }

    await connectToDatabase();
    
    let wishlist = await Wishlist.findOne({ userId });
    
    if (!wishlist) {
      wishlist = new Wishlist({ userId, items });
    } else {
      // Merge items
      const merged = new Set([...wishlist.items, ...items]);
      wishlist.items = Array.from(merged);
    }
    
    await wishlist.save();
    
    return NextResponse.json({ items: wishlist.items });
  } catch (error) {
    console.error("POST Wishlist Sync Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
