import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SiteProviders } from "@/components/providers";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SiteProviders>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </SiteProviders>
  );
}
