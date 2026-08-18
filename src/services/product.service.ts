import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import type { Product as ProductType } from "@/types/product";

export async function getAllProducts(): Promise<ProductType[]> {
  await connectToDatabase();
  const products = await Product.find({}).lean();
  
  return products.map((p: any) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    image: p.image,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    size: p.size,
    rating: p.rating,
    reviewCount: p.reviewCount,
    inStock: p.inStock,
    badge: p.badge,
    description: p.description,
  }));
}

export async function getProductBySlug(slug: string): Promise<ProductType | null> {
  await connectToDatabase();
  const p = await Product.findOne({ slug }).lean();
  if (!p) return null;
  
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    image: p.image,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    size: p.size,
    rating: p.rating,
    reviewCount: p.reviewCount,
    inStock: p.inStock,
    badge: p.badge,
    description: p.description,
  };
}

export async function getFeaturedProducts(limit: number = 4): Promise<ProductType[]> {
  await connectToDatabase();
  const products = await Product.find({}).limit(limit).lean();
  
  return products.map((p: any) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    image: p.image,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    size: p.size,
    rating: p.rating,
    reviewCount: p.reviewCount,
    inStock: p.inStock,
    badge: p.badge,
    description: p.description,
  }));
}
