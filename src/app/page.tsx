import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/features/home/HeroSection";
import nextDynamic from "next/dynamic";
import { connectToDatabase } from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import { mockProducts } from "@/data/products";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const VideoMarqueeSection = nextDynamic(() => import("@/features/home/VideoMarqueeSection").then(mod => mod.VideoMarqueeSection), { ssr: true });
const ShopByRange = nextDynamic(() => import("@/features/home/ShopByRange").then(mod => mod.ShopByRange), { ssr: true });
const PromotionalBanner = nextDynamic(() => import("@/features/home/PromotionalBanner").then(mod => mod.PromotionalBanner), { ssr: true });
const BulkOrders = nextDynamic(() => import("@/features/home/BulkOrders").then(mod => mod.BulkOrders), { ssr: true });
const AuthorizedDistributor = nextDynamic(() => import("@/features/home/AuthorizedDistributor").then(mod => mod.AuthorizedDistributor), { ssr: true });
const OccasionsSection = nextDynamic(() => import("@/features/home/OccasionsSection").then(mod => mod.OccasionsSection), { ssr: true });
const FavoritesGrid = nextDynamic(() => import("@/features/home/FavoritesGrid").then(mod => mod.FavoritesGrid), { ssr: true });

async function getTopFavorites() {
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

      return JSON.parse(JSON.stringify(sorted.slice(0, 4)));
    }
  } catch (err) {
    console.error("Failed to load featured products server-side in Home page:", err);
  }
  return JSON.parse(JSON.stringify(mockProducts.slice(0, 4)));
}

export default async function Home() {
  const initialFavorites = await getTopFavorites();

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <HeroSection />
      <VideoMarqueeSection />
      <ShopByRange />
      <PromotionalBanner />
      <BulkOrders />
      <AuthorizedDistributor />
      <OccasionsSection />
      <FavoritesGrid initialProducts={initialFavorites} />
    </main>
  );
}
