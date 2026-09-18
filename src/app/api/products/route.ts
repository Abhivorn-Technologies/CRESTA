import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { mockProducts } from "@/data/products";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    await connectToDatabase();
    
    // 1. Only seed initial products if the database collection is completely empty
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      for (const p of mockProducts) {
        const slug = p.slug || p.name.toLowerCase().replace(/\s+/g, '-');
        await Product.create({
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
          nutrition: p.nutrition || undefined,
          inStock: true
        });
      }
    }
    
    const query = category && category !== "All Categories" ? { category } : {};
    const dbProducts = await Product.find(query).lean();
    
    // Sort products so original catalog order is preserved by id / slug / name
    const productOrderMap = new Map<string, number>();
    mockProducts.forEach((p, idx) => {
      if (p.id) productOrderMap.set(p.id.toLowerCase(), idx);
      if (p.name) productOrderMap.set(p.name.toLowerCase(), idx);
      if (p.slug) productOrderMap.set(p.slug.toLowerCase(), idx);
    });

    const getOrder = (item: any) => {
      if (item.id && productOrderMap.has(item.id.toLowerCase())) return productOrderMap.get(item.id.toLowerCase())!;
      if (item.slug && productOrderMap.has(item.slug.toLowerCase())) return productOrderMap.get(item.slug.toLowerCase())!;
      if (item.name && productOrderMap.has(item.name.toLowerCase())) return productOrderMap.get(item.name.toLowerCase())!;
      return 999;
    };

    const sortedProducts = dbProducts.sort((a: any, b: any) => {
      const orderA = getOrder(a);
      const orderB = getOrder(b);
      if (orderA !== orderB) return orderA - orderB;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    return NextResponse.json(
      { products: sortedProducts },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
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
