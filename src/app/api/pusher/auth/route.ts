import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { pusherServer } from "@/lib/pusher-server";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_key_please_change";

interface TokenPayload {
  userId: string;
  email?: string;
  role?: string;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Authentication via HTTP-only cookie
    const token = req.cookies.get("cresta_token")?.value;
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Missing authentication token" },
        { status: 401 }
      );
    }

    let decoded: TokenPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired token" },
        { status: 401 }
      );
    }

    // 2. Verify RBAC Authorization - Only 'admin' role permitted
    if (decoded.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden: Administrator role required" },
        { status: 403 }
      );
    }

    // 3. Parse Pusher socket_id and channel_name (supports urlencoded and json)
    let socketId: string | null = null;
    let channelName: string | null = null;

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      socketId = body.socket_id;
      channelName = body.channel_name;
    } else {
      const text = await req.text();
      const params = new URLSearchParams(text);
      socketId = params.get("socket_id");
      channelName = params.get("channel_name");
    }

    if (!socketId || !channelName) {
      return NextResponse.json(
        { error: "Bad Request: Missing socket_id or channel_name" },
        { status: 400 }
      );
    }

    // 4. Verify channel restriction: only allow private-admin-orders
    if (channelName !== "private-admin-orders") {
      return NextResponse.json(
        { error: "Forbidden: Access to this channel is not permitted" },
        { status: 403 }
      );
    }

    // 5. Ensure Pusher server is initialized
    if (!pusherServer) {
      console.error("[PusherAuth] Pusher server is not configured.");
      return NextResponse.json(
        { error: "Service Unavailable: Real-time service not configured" },
        { status: 503 }
      );
    }

    // 6. Generate Pusher channel authorization token
    const authResponse = pusherServer.authorizeChannel(socketId, channelName);
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("[PusherAuth] Channel authorization error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
