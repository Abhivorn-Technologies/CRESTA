import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { GalleryItem } from '@/models/GalleryItem';

export const dynamic = 'force-dynamic';

const DEFAULT_IMAGES = [
  { type: 'image', title: "Joyful Moments", caption: "Pure happiness in every scoop", src: "/gallary/eating image.jpeg", order: 1 },
  { type: 'image', title: "Handcrafted Delight", caption: "Served with love and care", src: "/gallary/hand-cup image.jpeg", order: 2 },
  { type: 'image', title: "Styled to Perfection", caption: "Where art meets flavour", src: "/gallary/style.jpeg", order: 3 },
  { type: 'image', title: "Triple Treat", caption: "Three scoops, infinite smiles", src: "/gallary/tri icecream with love.jpeg", order: 4 },
  { type: 'image', title: "Birthday Celebrations", caption: "Make every birthday sweeter", src: "/images/occasion-birthday.jpg", order: 5 },
  { type: 'image', title: "Wedding Bliss", caption: "Sweeten your special day", src: "/images/occasion-wedding.jpg", order: 6 },
  { type: 'image', title: "Anniversary Love", caption: "Celebrate milestones with us", src: "/images/occasion-anniversary.jpg", order: 7 },
  { type: 'image', title: "Festival Vibes", caption: "Every festival deserves a treat", src: "/images/occasion-festival.jpg", order: 8 },
  { type: 'image', title: "House Party Fun", caption: "Share the sweetness", src: "/images/occasion-houseparty.jpg", order: 9 },
  { type: 'image', title: "Our Store", caption: "Step into a world of flavours", src: "/images/store-interior-br.jpg", order: 10 },
  { type: 'image', title: "Sundae Special", caption: "The classic, perfected", src: "/images/sundae-deliciousness.png", order: 11 },
  { type: 'image', title: "Corporate Events", caption: "Premium treats for every occasion", src: "/images/occasion-corporate.jpg", order: 12 },
];

const DEFAULT_VIDEOS = [
  { type: 'video', title: "Baskin Robbins Experience", caption: "Relive the magic", src: "/gallary/br.mp4", order: 1 },
  { type: 'video', title: "Grand Entry", caption: "A spectacle worth watching", src: "/gallary/entry.mp4", order: 2 },
  { type: 'video', title: "Our Advertisement", caption: "Taste the story", src: "/gallary/advatisement.mp4", order: 3 },
  { type: 'video', title: "Premium Ingredients", caption: "Only the finest go in", src: "/gallary/ingrients.mp4", order: 4 },
  { type: 'video', title: "Milky Ice Cream", caption: "Creaminess, redefined", src: "/gallary/milky ice cream.mp4", order: 5 },
  { type: 'video', title: "The Perfect Scoop", caption: "Art in every serving", src: "/gallary/scoope.mp4", order: 6 },
  { type: 'video', title: "Sip & Enjoy", caption: "Refreshingly delicious", src: "/gallary/straw.mp4", order: 7 },
  { type: 'video', title: "Cresta Moments", caption: "Memories we cherish", src: "/gallary/videp.mp4", order: 8 },
];

export async function GET() {
  try {
    await connectToDatabase();
    
    // Ensure initial items exist without race condition duplicates
    const count = await GalleryItem.countDocuments();
    if (count === 0) {
      for (const item of [...DEFAULT_IMAGES, ...DEFAULT_VIDEOS]) {
        await GalleryItem.updateOne(
          { type: item.type, title: item.title },
          { $setOnInsert: item },
          { upsert: true }
        );
      }
    }

    const items = await GalleryItem.find({}).sort({ order: 1, createdAt: -1 }).lean();

    const images = items.filter((item: any) => item.type === 'image');
    const videos = items.filter((item: any) => item.type === 'video');

    return NextResponse.json(
      { images, videos },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (error) {
    console.error('Gallery API GET Error:', error);
    // Fallback to static defaults in case of connection issues
    return NextResponse.json(
      {
        images: DEFAULT_IMAGES.map((img, i) => ({ ...img, _id: `default-img-${i + 1}` })),
        videos: DEFAULT_VIDEOS.map((vid, i) => ({ ...vid, _id: `default-vid-${i + 1}` }))
      },
      { status: 200 }
    );
  }
}
