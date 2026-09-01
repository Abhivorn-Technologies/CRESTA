import { Navbar } from "@/components/layout/Navbar";
import { OrdersList } from "@/features/orders/OrdersList";

export default function OrdersPage() {
  return (
    <main className="flex flex-1 flex-col bg-[#f0f3fa]">
      <Navbar />
      
      <div className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 pt-[100px] pb-10 md:pb-24">
        {/* Dashboard Area */}
        <OrdersList />
      </div>
    </main>
  );
}
