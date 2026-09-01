import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { SiteImage } from "@/models/SiteImage";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const images = await SiteImage.find({}).select("key updatedAt").lean();
    
    const timestamps: Record<string, string> = {};
    images.forEach(img => {
      timestamps[img.key] = new Date(img.updatedAt).getTime().toString();
    });
    
    return NextResponse.json(timestamps, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error("Timestamps API Error:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
