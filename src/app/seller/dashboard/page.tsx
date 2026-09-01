import { Navbar } from "@/components/layout/Navbar";

export default function SellerDashboardPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f0f3fa]">
      <Navbar />
      
      <div className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 pt-[120px] pb-24">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mt-8">
          <h1 className="text-3xl font-heading font-bold text-[#101b4d] mb-4">
            Seller Dashboard
          </h1>
          <p className="text-gray-500">
            Welcome to your seller dashboard. This area is currently under construction.
          </p>
        </div>
      </div>
    </main>
  );
}
