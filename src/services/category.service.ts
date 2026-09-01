import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";
import { CategoryMeta } from "@/constants/categories"; // We'll keep the type or define it

export async function getAllCategories(): Promise<CategoryMeta[]> {
  await connectToDatabase();
  const categories = await Category.find({}).lean();
  
  return categories.map((c: any) => ({
    slug: c.slug,
    label: c.label,
    description: c.description,
  }));
}
