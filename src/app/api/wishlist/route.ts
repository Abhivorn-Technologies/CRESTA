import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import Wishlist from "@/models/Wishlist";

const COOKIE_NAME = "cresta_session_id";
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_please_change";

// Helper to get or create a session ID and get user ID if logged in
function getIdentifiers(req: NextRequest) {
  let sessionId = req.cookies.get(COOKIE_NAME)?.value;
  let isNew = false;
  let userId = null;
  
  if (!sessionId) {
    sessionId = uuidv4();
    isNew = true;
  }

  const token = req.cookies.get("cresta_token")?.value;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      userId = decoded.userId;
    } catch (e) {
      // invalid token, ignore
    }
  }
  
  return { sessionId, isNew, userId };
}

export async function GET(req: NextRequest) {
  try {
    const { sessionId, isNew, userId } = getIdentifiers(req);
    
    await connectToDatabase();
    
    // Find by userId first if logged in, otherwise by sessionId
    const query = userId ? { userId } : { sessionId };
    const wishlist = await Wishlist.findOne(query);
    
    const response = NextResponse.json({ items: wishlist?.items || [] });

    if (isNew) {
      response.cookies.set(COOKIE_NAME, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    return response;
  } catch (error) {
    console.error("GET Wishlist Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { productId } = await req.json();
    
    if (typeof productId !== "string") {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const { sessionId, isNew, userId } = getIdentifiers(req);
    
    await connectToDatabase();
    
    const query = userId ? { userId } : { sessionId };
    let wishlist = await Wishlist.findOne(query);
    
    if (!wishlist) {
      wishlist = new Wishlist({ 
        sessionId: userId ? undefined : sessionId, 
        userId: userId || undefined, 
        items: [productId] 
      });
    } else {
      const items = new Set(wishlist.items);
      if (items.has(productId)) {
        items.delete(productId);
      } else {
        items.add(productId);
      }
      wishlist.items = Array.from(items);
      // Ensure userId is attached if they just logged in
      if (userId && !wishlist.userId) {
         wishlist.userId = userId;
      }
    }
    
    await wishlist.save();
    
    const response = NextResponse.json({ items: wishlist.items });
    
    if (isNew && !userId) {
      response.cookies.set(COOKIE_NAME, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }
    
    return response;
  } catch (error: any) {
    console.error("POST Wishlist Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message, stack: error.stack }, { status: 500 });
  }
}
