import type { Metadata } from "next";
import { HeroSection } from "@/features/home/hero-section";
import { ShopByRangeSection } from "@/features/home/shop-by-range-section";
import { MissionSection } from "@/features/home/mission-section";
import { WhyChooseSection } from "@/features/home/why-choose-section";
import { FeaturedProductsSection } from "@/features/home/featured-products-section";
import { CtaBannerSection } from "@/features/home/cta-banner-section";
import { getFeaturedProducts } from "@/services/product.service";
import { getAllCategories } from "@/services/category.service";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Cresta Global Private Limited — authorized Baskin Robbins ice cream distributor. Explore our products, delivery, and retail partnership opportunities.",
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(4),
    getAllCategories()
  ]);

  return (
    <>
      <HeroSection />
      <ShopByRangeSection categories={categories} />
      <FeaturedProductsSection products={featuredProducts} />
      <WhyChooseSection />
      <MissionSection />
      <CtaBannerSection />
    </>
  );
}
