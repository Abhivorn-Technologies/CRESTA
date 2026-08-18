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
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 px-6">
        <h2 className="font-heading font-semibold text-[#101b4d]">
          Items ({items.length})
        </h2>
        <button 
          onClick={clearCart}
          className="text-[11px] font-bold text-[#e6127d] uppercase tracking-wider hover:opacity-70 transition-opacity"
        >
          Clear
        </button>
      </div>

      {/* List */}
      <div className="flex flex-col pt-2">
        {items.map((item, index) => (
          <CartItem key={index} product={item.product} quantity={item.quantity} />
        ))}
      </div>
    </div>
  );
}
