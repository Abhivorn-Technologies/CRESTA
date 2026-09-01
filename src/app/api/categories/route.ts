import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";
import { SiteImage } from "@/models/SiteImage";

export async function GET() {
  try {
    await connectToDatabase();
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
      return cat;
    });
    
    return NextResponse.json({ categories: populatedCategories });
  } catch (error) {
    console.error("Categories API Error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
