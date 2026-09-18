import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";
import { SiteImage } from "@/models/SiteImage";
import { mockProducts } from "@/data/products";

export const dynamic = 'force-dynamic';

const defaultCategoryImages: Record<string, string> = {
  "ice-cream-cakes": "/images/category-ice-cream-cakes.jpg",
  "ice-cream-tubs": "/images/category-ice-cream-tubs.jpg",
  "party-packs": "/images/category-party-packs.jpg",
  "sundaes": "/menu-items/choco-lava-cake.jpeg",
  "scoops": "/images/SCOOPS_d9897fbb-eccc.png",
  "premium-collection": "/images/paleta-strawberry.png",
};

export async function GET() {
  try {
    await connectToDatabase();
    
    // Auto-sync categories from mockProducts into Category collection
    const categoryMap = new Map();
    for (const p of mockProducts) {
      if (!categoryMap.has(p.category)) {
        const slug = p.category.toLowerCase().replace(/\s+/g, '-');
        categoryMap.set(p.category, {
          label: p.category,
          slug,
          image: defaultCategoryImages[slug] || p.image,
          description: `Explore our premium ${p.category}`,
        });
      }
    }
    
    for (const cat of Array.from(categoryMap.values())) {
      await Category.updateOne(
        { slug: cat.slug },
        { $set: cat },
        { upsert: true }
      );
    }

    const categories = await Category.find({}).sort({ label: 1 }).lean();
    
    // Fetch any custom site images uploaded via CMS for these categories
    const categoryKeys = categories.map(c => `category-${c.slug}`);
    const customImages = await SiteImage.find({ key: { $in: categoryKeys } }).select("key updatedAt").lean();
    const customImageMap = new Map(customImages.map(img => [img.key, img.updatedAt]));

    const populatedCategories = categories.map(cat => {
      const key = `category-${cat.slug}`;
      if (customImageMap.has(key)) {
        return {
          ...cat,
          image: `/api/images/${key}?t=${new Date(customImageMap.get(key) as Date).getTime()}`
        };
      }
      return {
        ...cat,
        image: defaultCategoryImages[cat.slug] || cat.image
      };
    });
    
    return NextResponse.json(
      { categories: populatedCategories },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    );
  } catch (error) {
    console.error("Categories API Error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
