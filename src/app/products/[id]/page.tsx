import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProductHero } from "@/features/product/ProductHero";
import dynamic from "next/dynamic";

const RelatedProducts = dynamic(() => import("@/features/product/RelatedProducts").then(m => m.RelatedProducts));
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import ProductModel from "@/models/Product";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Find product by slugified name or ID with forgiving matching
  const resolvedParams = await params;
  const decodedId = decodeURIComponent(resolvedParams.id);
  const normalizedParam = decodedId.toLowerCase().replace(/[\s-]/g, "");
  
  await connectToDatabase();
  
  // Try finding by exact slug first
  let productDoc = await ProductModel.findOne({ slug: decodedId.toLowerCase() });
  
  if (!productDoc) {
    // Fallback: search by id or case-insensitive name
    const allProducts = await ProductModel.find({});
    productDoc = allProducts.find(p => 
      p.id.toLowerCase() === normalizedParam || 
      p.name.toLowerCase().replace(/[\s-]/g, "") === normalizedParam
    ) || null;
  }

  if (!productDoc) {
    notFound();
  }

  const product = JSON.parse(JSON.stringify(productDoc));
  
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
