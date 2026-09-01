import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ServiceableArea from "@/models/ServiceableArea";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Fetch all active serviceable areas, sorted by area name
    const areas = await ServiceableArea.find({ active: true }).sort({ area: 1 });
    
    return NextResponse.json({ areas });
  } catch (error) {
    console.error("Failed to fetch serviceable areas:", error);
    return NextResponse.json({ error: "Failed to fetch serviceable areas" }, { status: 500 });
  }
}
