import { Product } from "@/data/products";
import { CartItem } from "./CartItem";
import { useCart } from "@/context/CartContext";

interface CartItemListProps {
  items: { product: Product; quantity: number }[];
}

export function CartItemList({ items }: CartItemListProps) {
  const { clearCart } = useCart();
  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="p-5 md:p-6 border-b border-gray-100 bg-[#f9fafb] flex items-center justify-between">
        <h2 className="font-heading text-lg sm:text-xl font-bold text-[#00113A]">
          Cart <span className="text-gray-500 text-sm font-medium">({items.length} items)</span>
        </h2>
        <button 
          onClick={clearCart}
          className="text-xs font-bold text-[#e6127d] uppercase tracking-wider hover:opacity-70 transition-opacity"
        >
          Clear All
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col pt-4 px-4 sm:px-6 pb-2 bg-[#fdfdfd]">
        {items.map((item, index) => (
          <CartItem key={index} product={item.product} quantity={item.quantity} />
        ))}
      </div>
    </div>
  );
}
