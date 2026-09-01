import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { SiteImage } from '@/models/SiteImage';

export async function GET() {
  try {
    await connectToDatabase();
    // Return all customized images without the bulky base64 data to keep payload small
    const images = await SiteImage.find({}).select('key updatedAt').lean();
    return NextResponse.json(images);
  } catch (error) {
    console.error("Admin Page Images API GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch page images" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();

    const { key, imageBase64 } = data;

    if (!key || !imageBase64) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Upsert the image
    const updatedImage = await SiteImage.findOneAndUpdate(
      { key },
      { imageBase64 },
      { returnDocument: 'after', upsert: true }
    );

    return NextResponse.json({ 
      success: true, 
      key: updatedImage.key, 
      updatedAt: updatedImage.updatedAt 
    }, { status: 200 });
  } catch (error) {
    console.error("Admin Page Images API POST Error:", error);
    return NextResponse.json(
      { error: "Failed to update page image" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const key = url.searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "Missing key parameter" }, { status: 400 });
    }

    await SiteImage.findOneAndDelete({ key });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Admin Page Images API DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete page image" },
      { status: 500 }
    );
  }
}
