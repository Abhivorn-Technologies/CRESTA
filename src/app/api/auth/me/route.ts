import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_please_change";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("cresta_token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      
      await connectToDatabase();
      
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return NextResponse.json({ user: null }, { status: 200 });
      }

      return NextResponse.json({ 
        user: { id: user._id, name: user.name, email: user.email, role: user.role } 
      }, { status: 200 });
      
    } catch (err) {
      // Invalid token
      return NextResponse.json({ user: null }, { status: 200 });
    }
  } catch (error: any) {
    console.error("Me API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Logout endpoint piggybacked on /api/auth/me using POST (or could be a separate logout route)
  // We'll just use a separate POST here for logout to keep it simple
  try {
    const action = req.nextUrl.searchParams.get("action");
    
    if (action === "logout") {
      const response = NextResponse.json({ message: "Logged out" }, { status: 200 });
      response.cookies.set("cresta_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
      });
      return response;
    }
    
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("cresta_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const body = await req.json();

    await connectToDatabase();
    
    const user = await User.findById(decoded.userId);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (body.name) user.name = body.name;
    if (body.email) user.email = body.email;

    await user.save();

    return NextResponse.json({ 
      message: "Profile updated", 
      user: { id: user._id, name: user.name, email: user.email, role: user.role } 
    }, { status: 200 });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
