import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectToDatabase();
    // Fetch all products regardless of stock status
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Admin Products API GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const data = await req.json();

    const { name, category, price, volume, image } = data;

    if (!name || !category || !price || !volume) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate unique id and slug
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    const slug = `${baseSlug}-${randomSuffix}`;
    const id = `PROD-${randomSuffix}`;

    const newProduct = new Product({
      id,
      slug,
      name,
      category,
      price: Number(price),
      volume,
      image: image || "", // base64 string
      inStock: true,
      rating: 5,
      reviewCount: 0,
      badges: ["New"],
    });

    await newProduct.save();

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("Admin Products API POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
