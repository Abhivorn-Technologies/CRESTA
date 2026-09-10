import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { PageVideo } from '@/models/PageVideo';
import fs from 'fs/promises';
import path from 'path';

// GET – list custom video entries (key & updatedAt)
export async function GET() {
  try {
    await connectToDatabase();
    const videos = await PageVideo.find({}).select('key path updatedAt').lean();
    return NextResponse.json(videos);
  } catch (error) {
    console.error('Admin Page Videos API GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch page videos' }, { status: 500 });
  }
}

// POST – upload or replace a video (Base64 data URL)
export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { key, videoBase64 } = await req.json();
    if (!key || !videoBase64) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    // Validate mime type and size (allow up to 20MB)
    const match = videoBase64.match(/^data:(video\/\w+);base64,(.*)$/);
    if (!match) {
      return NextResponse.json({ error: 'Invalid video format' }, { status: 400 });
    }
    const [, mime, base64] = match;
    const allowed = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!allowed.includes(mime)) {
      return NextResponse.json({ error: 'Unsupported video type' }, { status: 415 });
    }
    const buffer = Buffer.from(base64, 'base64');
    const maxSize = 20 * 1024 * 1024; // 20 MB
    if (buffer.length > maxSize) {
      return NextResponse.json({ error: 'File too large (max 20 MB)' }, { status: 413 });
    }
    const ext = mime.split('/')[1];
    const videosDir = path.join(process.cwd(), 'public', 'videos');
    await fs.mkdir(videosDir, { recursive: true });
    const targetFilePath = path.join(videosDir, `${key}.${ext}`);
    
    // Write file to public/videos
    await fs.writeFile(targetFilePath, buffer);

    // Upsert DB entry with the new path
    const updated = await PageVideo.findOneAndUpdate(
      { key },
      { path: `/videos/${key}.${ext}`, updatedAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({ success: true, key: updated.key, updatedAt: updated.updatedAt }, { status: 200 });
  } catch (error) {
    console.error('Admin Page Videos API POST Error:', error);
    return NextResponse.json({ error: 'Failed to upload video' }, { status: 500 });
  }
}

// DELETE – remove custom video, fallback to default
export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const key = url.searchParams.get('key');
    if (!key) {
      return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 });
    }
    const record = await PageVideo.findOne({ key });
    if (record) {
      // Delete the file from public/videos
      try {
        const fullPath = path.join(process.cwd(), 'public', record.path);
        await fs.unlink(fullPath);
      } catch (_) {}
      await PageVideo.deleteOne({ key });
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Admin Page Videos API DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 });
  }
}
