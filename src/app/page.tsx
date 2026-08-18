import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/features/home/HeroSection";
import { ShopByRange } from "@/features/home/ShopByRange";
import { PromotionalBanner } from "@/features/home/PromotionalBanner";
import { BulkOrders } from "@/features/home/BulkOrders";
import { AuthorizedDistributor } from "@/features/home/AuthorizedDistributor";
import { FavoritesGrid } from "@/features/home/FavoritesGrid";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Navbar />
      <HeroSection />
      <ShopByRange />
      <PromotionalBanner />
      <BulkOrders />
      <AuthorizedDistributor />
      <FavoritesGrid />
    </main>
  );
}
