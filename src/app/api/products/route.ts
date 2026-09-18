import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { mockProducts } from "@/data/products";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    await connectToDatabase();
    
    // 1. Purge all obsolete/placeholder products not in the active catalog
    const allowedNames = mockProducts.map(p => p.name);
    await Product.deleteMany({ name: { $nin: allowedNames } });

    // 2. Auto-sync all current menu products into MongoDB
    for (let index = 0; index < mockProducts.length; index++) {
      const p = mockProducts[index];
      const slug = p.name.toLowerCase().replace(/\s+/g, '-');
      await Product.updateOne(
        { name: p.name },
        { 
          $set: {
            id: p.id,
            slug,
            name: p.name,
            category: p.category,
            volume: p.volume,
            price: p.price,
            originalPrice: p.originalPrice,
            image: p.image,
            badges: p.badges,
            description: p.description,
            nutrition: p.nutrition || null,
            inStock: true
          }
        },
        { upsert: true }
      );
    }
    
    const query = category && category !== "All Categories" ? { category } : {};
    const dbProducts = await Product.find(query).lean();
    
    // Sort products so they match the order in mockProducts first
    const productOrderMap = new Map(mockProducts.map((p, idx) => [p.name.toLowerCase(), idx]));
    const sortedProducts = dbProducts.sort((a: any, b: any) => {
      const orderA = productOrderMap.has(a.name?.toLowerCase()) ? productOrderMap.get(a.name.toLowerCase())! : 999;
      const orderB = productOrderMap.has(b.name?.toLowerCase()) ? productOrderMap.get(b.name.toLowerCase())! : 999;
      if (orderA !== orderB) return orderA - orderB;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    return NextResponse.json(
      { products: sortedProducts },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error) {
    console.error("Products API Error:", error);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const filtered = category && category !== "All Categories" 
      ? mockProducts.filter(p => p.category === category)
      : mockProducts;
    return NextResponse.json({ products: filtered });
  }
}
