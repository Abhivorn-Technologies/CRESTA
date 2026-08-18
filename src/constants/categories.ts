import type { ProductCategory } from "@/types/product";

export interface CategoryMeta {
  slug: ProductCategory;
  label: string;
  description: string;
}

export const categories: CategoryMeta[] = [
  { slug: "tubs", label: "Tubs", description: "Family-size ice cream tubs" },
  { slug: "cups", label: "Cups", description: "Single-serve ice cream cups" },
  { slug: "cones", label: "Cones", description: "Classic waffle cones" },
  { slug: "bars", label: "Bars", description: "Ice cream bars & popsicles" },
  { slug: "family-packs", label: "Family Packs", description: "Bundled multi-flavor packs" },
  { slug: "sundaes", label: "Sundaes", description: "Build-your-own sundae kits" },
];
