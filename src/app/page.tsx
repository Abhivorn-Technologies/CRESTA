import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/features/home/HeroSection";
import dynamic from "next/dynamic";

const ShopByRange = dynamic(() => import("@/features/home/ShopByRange").then(mod => mod.ShopByRange), { ssr: true });
const PromotionalBanner = dynamic(() => import("@/features/home/PromotionalBanner").then(mod => mod.PromotionalBanner), { ssr: true });
const BulkOrders = dynamic(() => import("@/features/home/BulkOrders").then(mod => mod.BulkOrders), { ssr: true });
const AuthorizedDistributor = dynamic(() => import("@/features/home/AuthorizedDistributor").then(mod => mod.AuthorizedDistributor), { ssr: true });
const OccasionsSection = dynamic(() => import("@/features/home/OccasionsSection").then(mod => mod.OccasionsSection), { ssr: true });
const FavoritesGrid = dynamic(() => import("@/features/home/FavoritesGrid").then(mod => mod.FavoritesGrid), { ssr: true });

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <HeroSection />
      <ShopByRange />
      <PromotionalBanner />
      <BulkOrders />
      <AuthorizedDistributor />
      <OccasionsSection />
      <FavoritesGrid />
    </main>
  );
}
