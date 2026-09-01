import { Navbar } from "@/components/layout/Navbar";
import { AboutHero } from "@/features/about/AboutHero";
import { OurMission } from "@/features/about/OurMission";
import { QuickInfoBanner } from "@/features/about/QuickInfoBanner";
import { WhyChooseCresta } from "@/features/about/WhyChooseCresta";

export default function AboutPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#fdfdfd] overflow-hidden">
      <Navbar />
      
      {/* 1. Hero & Stats */}
      <AboutHero />
      
      {/* 2. Mission Statement */}
      <OurMission />
      
      {/* 3. Pink Banner */}
      <QuickInfoBanner />
      
      {/* 4. Features Grid */}
      <WhyChooseCresta />
      
    </main>
  );
}
