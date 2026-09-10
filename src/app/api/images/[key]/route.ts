import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { SiteImage } from '@/models/SiteImage';

const FALLBACKS: Record<string, string> = {
  'home-hero': '/images/hero-composite.jpg',
  'home-banner': '/images/AB6AXuBm0DEBZy4ie0uQ.png',
  'home-bulk1': '/images/image 5.png',
  'home-bulk2': '/images/Ice Cream Sundae.png',
  'home-store-br': '/images/store-interior-br.jpg',
  'about-mega': '/images/blank-megaphone.jpg',
  'about-basket': '/images/grocery-basket.jpg',
  'about-mission': '/images/mission-composite.jpg',
  'delivery-map': '/images/tracking-map-bg.jpg',
  'enquiry-cakes': '/images/shop-cakes.jpg',
  'products-banner': '/images/AB6AXuBm0DEBZy4ie0uQ.png',
  'occasion-wedding': '/images/occasion-wedding.jpg',
  'occasion-birthday': '/images/occasion-birthday.jpg',
  'occasion-corporate': '/images/occasion-corporate.jpg',
  'occasion-anniversary': '/images/occasion-anniversary.jpg',
  'occasion-houseparty': '/images/occasion-houseparty.jpg',
  'occasion-festival': '/images/occasion-festival.jpg',
  'gallery-img-1': '/gallary/eating image.jpeg',
  'gallery-img-2': '/gallary/hand-cup image.jpeg',
  'gallery-img-3': '/gallary/style.jpeg',
  'gallery-img-4': '/gallary/tri icecream with love.jpeg',
  'gallery-img-5': '/images/occasion-birthday.jpg',
  'gallery-img-6': '/images/occasion-wedding.jpg',
  'gallery-img-7': '/images/occasion-anniversary.jpg',
  'gallery-img-8': '/images/occasion-festival.jpg',
  'gallery-img-9': '/images/occasion-houseparty.jpg',
  'gallery-img-10': '/images/store-interior-br.jpg',
  'gallery-img-11': '/images/sundae-deliciousness.png',
  'gallery-img-12': '/images/occasion-corporate.jpg'
};

export async function GET(req: Request, { params }: { params: Promise<{ key: string }> }) {
  try {
    const { key } = await params;
    await connectToDatabase();
    const image = await SiteImage.findOne({ key });
    
    if (image && image.imageBase64) {
      // Extract base64 data and content type
      const match = image.imageBase64.match(/^data:(image\/\w+);base64,/);
      const contentType = match ? match[1] : 'image/png';
      const base64Data = image.imageBase64.replace(/^data:image\/\w+;base64,/, "");
      
      const buffer = Buffer.from(base64Data, 'base64');
      
      return new NextResponse(buffer, {
        headers: { 
          'Content-Type': contentType, 
          'Cache-Control': 'public, max-age=3600' 
        }
      });
    }
  } catch (error) {
    console.error("Error fetching site image:", error);
  }
  
  // Fallback to static image if not found in DB or error
  const { key } = await params;
  const fallback = FALLBACKS[key];
  if (fallback) {
    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'public', fallback);
      const buffer = fs.readFileSync(filePath);
      
      const ext = path.extname(fallback).toLowerCase();
      let contentType = 'image/png';
      if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.webp') contentType = 'image/webp';
      else if (ext === '.svg') contentType = 'image/svg+xml';
      
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=3600'
        }
      });
    } catch (e) {
      console.error("Error serving fallback image:", e);
    }
  }
  
  return new NextResponse('Image not found', { status: 404 });
}
