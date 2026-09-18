import { Navbar } from "@/components/layout/Navbar";
import { ProductHero } from "@/features/product/ProductHero";
import nextDynamic from "next/dynamic";

const RelatedProducts = nextDynamic(() => import("@/features/product/RelatedProducts").then(m => m.RelatedProducts));
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import { mockProducts } from "@/data/products";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const decodedId = decodeURIComponent(resolvedParams.id);
  const normalizedParam = decodedId.toLowerCase().replace(/[\s-]/g, "");
  
  let product: any = null;

  // 1. Query MongoDB first so live admin edits (images, prices, names) take precedence
  try {
    await connectToDatabase();
    
    const productDoc = await ProductModel.findOne({
      $or: [
        { slug: decodedId.toLowerCase() },
        { id: decodedId },
        { name: new RegExp(`^${decodedId.replace(/-/g, ' ')}$`, 'i') }
      ]
    }).lean();
    
    if (productDoc) {
      product = JSON.parse(JSON.stringify(productDoc));
    } else {
      const allProducts = await ProductModel.find({}).lean();
      const found = allProducts.find((p: any) => 
        (p.id && p.id.toLowerCase() === normalizedParam) || 
        (p.name && p.name.toLowerCase().replace(/[\s-]/g, "") === normalizedParam) ||
        (p.slug && p.slug.toLowerCase().replace(/[\s-]/g, "") === normalizedParam)
      );
      if (found) product = JSON.parse(JSON.stringify(found));
    }
  } catch (err) {
    console.error("Database lookup error in product details:", err);
  }

  // 2. Fallback to mock products only if DB is unreachable or product not in DB
  if (!product) {
    product = mockProducts.find(p => 
      (p.id && p.id.toLowerCase() === normalizedParam) || 
      (p.name && p.name.toLowerCase().replace(/[\s-]/g, "") === normalizedParam) ||
      (p.name && p.name.toLowerCase().replace(/\s+/g, "-") === decodedId.toLowerCase())
    );
  }

  if (!product) {
    notFound();
  }
  
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />
      
      {/* Breadcrumbs */}
      <div className="w-full max-w-[1152px] mx-auto px-6 pt-[100px] md:pt-[120px] pb-8 flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
        <Link href="/products" className="hover:text-[#00113A] transition-colors">Products</Link>
        <ChevronRight className="size-3" />
        <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-[#00113A] transition-colors">{product.category}</Link>
        <ChevronRight className="size-3" />
        <span className="text-[#00113A]">{product.name}</span>
      </div>

      {/* Main Product Section */}
      <div className="px-6 pb-12">
        <ProductHero product={product} />
      </div>

      {/* Related Products Section */}
      <RelatedProducts currentProductId={product.id} />
    </main>
  );
}
