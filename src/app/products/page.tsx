import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { ProductsLayout } from "@/features/products/ProductsLayout";
import { WishlistHeaderButton } from "@/features/products/WishlistHeaderButton";
import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import { mockProducts } from "@/data/products";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getLiveCatalog() {
  try {
    await connectToDatabase();
    const dbProducts = await ProductModel.find({}).lean();
    if (dbProducts && dbProducts.length > 0) {
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

      const sorted = dbProducts.sort((a: any, b: any) => {
        const orderA = getOrder(a);
        const orderB = getOrder(b);
        if (orderA !== orderB) return orderA - orderB;
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });

      return JSON.parse(JSON.stringify(sorted));
    }
  } catch (err) {
    console.error("Failed to load products server-side in /products page:", err);
  }
  return JSON.parse(JSON.stringify(mockProducts));
}

export default async function ProductsPage() {
  const initialProducts = await getLiveCatalog();

  return (
    <main className="flex min-h-screen flex-col bg-[#fdfdfd]">
      <Navbar />
      
      {/* Page Header */}
      <div className="relative w-full pt-40 pb-20 border-b border-gray-100 bg-[#101b4d] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
          <img 
            src="/api/images/products-banner" 
            alt="Products Banner" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#101b4d] via-[#101b4d]/80 to-transparent z-10" />

        <div className="relative z-20 mx-auto max-w-[1440px] px-6 lg:px-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="max-w-xl">
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight">
              Our Products
            </h1>
            <p className="text-gray-200 font-medium text-lg">
              Explore our premium selection of ice creams, sundaes, and frozen treats for every occasion.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/products" 
              className="px-6 py-2.5 rounded-full bg-[#e6127d] text-white text-sm font-bold shadow-lg shadow-[#e6127d]/20 hover:bg-[#c90d6b] transition-all hover:-translate-y-0.5"
            >
              All Products
            </Link>
            <WishlistHeaderButton />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-[1440px] w-full px-6 lg:px-10 py-12 flex-1">
        <Suspense fallback={null}>
          <ProductsLayout initialProducts={initialProducts} />
        </Suspense>
      </div>
    </main>
  );
}
