"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, IceCreamCone, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCart } from "@/features/cart/cart-context";
import { useWishlist } from "@/features/wishlist/wishlist-context";
import { formatPrice } from "@/utils/format";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg",
        className
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-brand-pink-soft">
        <Link href={`/products/${product.slug}`} className="block h-full w-full">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <IceCreamCone
                className="size-16 text-brand-navy/20"
                aria-hidden="true"
              />
            </div>
          )}
        </Link>

        {product.badge ? (
          <span className="absolute top-3 left-3 rounded-full bg-brand-pink px-3 py-1 text-xs font-bold tracking-wide text-white uppercase shadow">
            {product.badge}
          </span>
        ) : null}

        <button
          type="button"
          onClick={() => {
            toggleWishlist(product);
            toast.success(
              wishlisted ? "Removed from wishlist" : "Added to wishlist"
            );
          }}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wishlisted}
          className="absolute top-3 right-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-brand-navy shadow transition-colors hover:bg-white"
        >
          <Heart
            className={cn("size-4", wishlisted && "fill-brand-pink text-brand-pink")}
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="line-clamp-1 font-heading text-base font-bold text-foreground">
            {product.name}
          </h3>
        </Link>
        <span className="text-xs text-muted-foreground">{product.size}</span>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3.5 fill-brand-gold text-brand-gold" aria-hidden="true" />
          <span className="font-medium text-foreground">{product.rating.toFixed(1)}</span>
          <span>({product.reviewCount})</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-lg font-extrabold text-brand-navy">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice ? (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            ) : null}
          </div>

          <Button
            size="icon"
            className="rounded-full bg-brand-navy text-white hover:bg-brand-navy/90"
            disabled={!product.inStock}
            aria-label={`Add ${product.name} to cart`}
            onClick={() => {
              addItem(product);
              toast.success(`${product.name} added to cart`);
            }}
          >
            <ShoppingCart className="size-4" aria-hidden="true" />
          </Button>
        </div>

        {!product.inStock ? (
          <span className="text-xs font-medium text-destructive">
            Out of stock
          </span>
        ) : null}
      </div>
    </div>
  );
}
