import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { GalleryItem } from '@/models/GalleryItem';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

export async function GET() {
  try {
    await connectToDatabase();
    const items = await GalleryItem.find({}).sort({ order: 1, createdAt: -1 }).lean();

    const images = items.filter((item: any) => item.type === 'image');
    const videos = items.filter((item: any) => item.type === 'video');

    return NextResponse.json({ images, videos }, { status: 200 });
  } catch (error) {
    console.error('Admin Gallery GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { type, title, caption = '', fileBase64, mimeType } = body;

    if (!type || !title || !fileBase64 || !mimeType) {
      return NextResponse.json({ error: 'Missing required fields (type, title, fileBase64, mimeType)' }, { status: 400 });
    }

    if (type !== 'image' && type !== 'video') {
      return NextResponse.json({ error: 'Invalid type. Must be image or video.' }, { status: 400 });
    }

    // Validate mime type
    const allowed = type === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_VIDEO_TYPES;
    if (!allowed.includes(mimeType)) {
      return NextResponse.json(
        { error: `Unsupported ${type} format. Allowed: ${allowed.join(', ')}` },
        { status: 415 }
      );
    }

    // Validate size (approx base64 check and buffer check)
    const base64Clean = fileBase64.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(base64Clean, 'base64');
    if (buffer.length > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds maximum limit of 20MB' }, { status: 413 });
    }

    // Write file to public/uploads/gallery
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gallery');
    await fs.mkdir(uploadDir, { recursive: true });

    const ext = mimeType.split('/')[1]?.replace('jpeg', 'jpg') || (type === 'image' ? 'png' : 'mp4');
    const fileName = `gallery-${type}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const targetPath = path.join(uploadDir, fileName);

    await fs.writeFile(targetPath, buffer);
    const publicUrl = `/uploads/gallery/${fileName}`;

    // Find highest order to place new item at top
    const highestItem = await GalleryItem.findOne({ type }).sort({ order: -1 }).lean();
    const nextOrder = highestItem && typeof highestItem.order === 'number' ? highestItem.order + 1 : 1;

    const newItem = await GalleryItem.create({
      type,
      title: title.trim(),
      caption: caption.trim(),
      src: publicUrl,
      order: nextOrder,
    });

    return NextResponse.json({ success: true, item: newItem }, { status: 201 });
  } catch (error) {
    console.error('Admin Gallery POST Error:', error);
    return NextResponse.json({ error: 'Failed to add gallery item' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { id, title, caption, fileBase64, mimeType } = body;

    if (!id || !title) {
      return NextResponse.json({ error: 'Missing required fields (id, title)' }, { status: 400 });
    }

    const item = await GalleryItem.findById(id);
    if (!item) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }

    item.title = title.trim();
    if (caption !== undefined) {
      item.caption = caption.trim();
    }

    // If a new media file was provided to replace existing
    if (fileBase64 && mimeType) {
      const allowed = item.type === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_VIDEO_TYPES;
      if (!allowed.includes(mimeType)) {
        return NextResponse.json(
          { error: `Unsupported ${item.type} format. Allowed: ${allowed.join(', ')}` },
          { status: 415 }
        );
      }

      const base64Clean = fileBase64.replace(/^data:[^;]+;base64,/, '');
      const buffer = Buffer.from(base64Clean, 'base64');
      if (buffer.length > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'File size exceeds maximum limit of 20MB' }, { status: 413 });
      }

      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'gallery');
      await fs.mkdir(uploadDir, { recursive: true });

      const ext = mimeType.split('/')[1]?.replace('jpeg', 'jpg') || (item.type === 'image' ? 'png' : 'mp4');
      const fileName = `gallery-${item.type}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const targetPath = path.join(uploadDir, fileName);

      await fs.writeFile(targetPath, buffer);

      // Clean up old uploaded file if it was in /uploads/gallery
      if (item.src && item.src.startsWith('/uploads/gallery/')) {
        try {
          const oldFilePath = path.join(process.cwd(), 'public', item.src);
          await fs.unlink(oldFilePath);
        } catch (_) {}
      }

      item.src = `/uploads/gallery/${fileName}`;
    }

    await item.save();

    return NextResponse.json({ success: true, item }, { status: 200 });
  } catch (error) {
    console.error('Admin Gallery PUT Error:', error);
    return NextResponse.json({ error: 'Failed to update gallery item' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    const item = await GalleryItem.findById(id);
    if (!item) {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }

    // Clean up uploaded file if in /uploads/gallery
    if (item.src && item.src.startsWith('/uploads/gallery/')) {
      try {
        const filePath = path.join(process.cwd(), 'public', item.src);
        await fs.unlink(filePath);
      } catch (_) {}
    }

    await GalleryItem.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Item deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Admin Gallery DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
  }
}
