import { Navbar } from "@/components/layout/Navbar";
import { AboutHero } from "@/features/about/AboutHero";
import dynamic from "next/dynamic";

const OurMission = dynamic(() => import("@/features/about/OurMission").then(m => m.OurMission));
const QuickInfoBanner = dynamic(() => import("@/features/about/QuickInfoBanner").then(m => m.QuickInfoBanner));
const WhyChooseCresta = dynamic(() => import("@/features/about/WhyChooseCresta").then(m => m.WhyChooseCresta));

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
