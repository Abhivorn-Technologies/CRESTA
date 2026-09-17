import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { GalleryItem } from '@/models/GalleryItem';

export const dynamic = 'force-dynamic';

const DEFAULT_IMAGES = [
  { type: 'image', title: "Anniversary Love",          caption: "Celebrate milestones with us",            src: "/images/occasion-anniversary.jpg",                          order: 1  },
  { type: 'image', title: "Festival Vibes",            caption: "Every festival deserves a treat",         src: "/images/occasion-festival.jpg",                             order: 2  },
  { type: 'image', title: "House Party Fun",           caption: "Share the sweetness",                     src: "/images/occasion-houseparty.jpg",                           order: 3  },
  { type: 'image', title: "Our Store",                 caption: "Step into a world of flavours",           src: "/images/store-interior-br.jpg",                             order: 4  },
  { type: 'image', title: "Corporate Events",          caption: "Premium treats for every occasion",       src: "/images/occasion-corporate.jpg",                            order: 5  },
  { type: 'image', title: "Chocolate Almond Brownie",  caption: "Rich brownie with dark chocolate drizzle",src: "/1IMGSSS/2.jpeg",                                           order: 6  },
  { type: 'image', title: "Mango Fruit Sundae",        caption: "Tropical fruits meet mango ice cream",    src: "/1IMGSSS/3.jpeg",                                           order: 7  },
  { type: 'image', title: "Vanilla Nuts Sundae",       caption: "Creamy vanilla with roasted nut toppings",src: "/1IMGSSS/4.jpeg",                                           order: 8  },
  { type: 'image', title: "Classic Brownie Sundae",    caption: "Caramel drizzle on a chocolate brownie",  src: "/1IMGSSS/4K_HD_AND_NO_TEXT_2K_20260916182751.jpeg",         order: 9  },
  { type: 'image', title: "Berry Banana Fruit Cream",  caption: "Strawberry, banana and tropical bliss",   src: "/1IMGSSS/4K_HD_AND_NO_TEXT_2K_20260916182841.jpeg",         order: 10 },
  { type: 'image', title: "Chocolate Indulgence",      caption: "Decadent layered chocolate cake slice",   src: "/images/shop-cakes.jpg",                                    order: 11 },
  { type: 'image', title: "Birthday Celebrations",     caption: "Make every birthday sweeter with us",     src: "/images/occasion-birthday.jpg",                             order: 12 },
  { type: 'image', title: "Wedding Bliss",             caption: "Sweeten your most special day",           src: "/images/occasion-wedding.jpg",                              order: 13 },
];

const DEFAULT_VIDEOS = [
  { type: 'video', title: "Baskin Robbins Experience", caption: "Relive the magic",           src: "/gallary/br.mp4",              order: 1 },
  { type: 'video', title: "Grand Entry",               caption: "A spectacle worth watching", src: "/gallary/entry.mp4",           order: 2 },
  { type: 'video', title: "Our Advertisement",         caption: "Taste the story",            src: "/gallary/advatisement.mp4",    order: 3 },
  { type: 'video', title: "Premium Ingredients",       caption: "Only the finest go in",      src: "/gallary/ingrients.mp4",       order: 4 },
  { type: 'video', title: "Special Treat",             caption: "Crafted for pure happiness", src: "/9.mp4",                       order: 5 },
  { type: 'video', title: "Milky Ice Cream",           caption: "Creaminess, redefined",      src: "/gallary/milky ice cream.mp4", order: 6 },
  { type: 'video', title: "The Perfect Scoop",         caption: "Art in every serving",       src: "/gallary/scoope.mp4",          order: 7 },
  { type: 'video', title: "Sip & Enjoy",               caption: "Refreshingly delicious",     src: "/gallary/straw.mp4",           order: 8 },
  { type: 'video', title: "Cresta Moments",            caption: "Memories we cherish",        src: "/gallary/videp.mp4",           order: 9 },
];

export async function GET() {
  try {
    await connectToDatabase();

    // Sync DB: remove any entries not in the current default lists, upsert the rest
    const allowedSrcs = DEFAULT_IMAGES.map(i => i.src);
    await GalleryItem.deleteMany({ type: 'image', src: { $nin: allowedSrcs } });
    const allowedVideoSrcs = DEFAULT_VIDEOS.map(v => v.src);
    await GalleryItem.deleteMany({ type: 'video', src: { $nin: allowedVideoSrcs } });

    for (const item of [...DEFAULT_IMAGES, ...DEFAULT_VIDEOS]) {
      await GalleryItem.updateOne(
        { type: item.type, src: item.src },
        { $set: { ...item } },
        { upsert: true }
      );
    }

    const items = await GalleryItem.find({}).sort({ order: 1, createdAt: -1 }).lean();
    const images = items.filter((item: any) => item.type === 'image');
    const videos = items.filter((item: any) => item.type === 'video');

    return NextResponse.json(
      { images, videos },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error) {
    console.error('Gallery API GET Error:', error);
    return NextResponse.json(
      {
        images: DEFAULT_IMAGES.map((img, i) => ({ ...img, _id: `default-img-${i + 1}` })),
        videos: DEFAULT_VIDEOS.map((vid, i) => ({ ...vid, _id: `default-vid-${i + 1}` })),
      },
      { status: 200 }
    );
  }
}
