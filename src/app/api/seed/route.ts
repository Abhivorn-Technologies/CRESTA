import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { mockProducts } from "@/data/products";

export async function GET() {
  try {
    await connectToDatabase();

    // Clear existing data to avoid duplicates during seeding
    await Product.deleteMany({});
    await Category.deleteMany({});

    // Seed products
    const productsToInsert = mockProducts.map(p => ({
      ...p,
      slug: p.name.toLowerCase().replace(/\s+/g, '-'),
    }));
    await Product.insertMany(productsToInsert);

    // Extract unique categories and assign an image from a product
    const categoryMap = new Map();
    for (const p of mockProducts) {
      if (!categoryMap.has(p.category)) {
        categoryMap.set(p.category, {
          label: p.category,
          slug: p.category.toLowerCase().replace(/\s+/g, '-'),
          image: p.image,
          description: `Explore our premium ${p.category}`,
        });
      }
    }
    const categoriesToInsert = Array.from(categoryMap.values());
    await Category.insertMany(categoriesToInsert);

    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
