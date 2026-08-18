export type ProductCategory =
  | "tubs"
  | "cups"
  | "cones"
  | "bars"
  | "family-packs"
  | "sundaes";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  image: string;
  price: number;
  compareAtPrice?: number;
  size: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  badge?: string;
  description: string;
}

export interface CartLineItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  quantity: number;
}
