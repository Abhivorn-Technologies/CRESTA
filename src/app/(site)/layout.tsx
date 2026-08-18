import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
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
