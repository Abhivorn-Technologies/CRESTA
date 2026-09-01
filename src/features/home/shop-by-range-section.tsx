"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Cake, CupSoda, IceCreamBowl, IceCreamCone, Package, Popsicle } from "lucide-react";

import { Section } from "@/components/shared/section";
import { CategoryMeta } from "@/constants/categories"; // Keep for type definition

const categoryIcons = {
  tubs: IceCreamBowl,
  cups: CupSoda,
  cones: IceCreamCone,
  bars: Popsicle,
  "family-packs": Package,
  sundaes: Cake,
} as const;

interface ShopByRangeSectionProps {
  categories: CategoryMeta[];
}

export function ShopByRangeSection({ categories }: ShopByRangeSectionProps) {
  return (
    <Section background="default">
      <div className="mb-12 flex flex-col items-center gap-3 text-center">
        <h2 className="font-heading text-3xl font-extrabold text-brand-navy sm:text-4xl">
          Shop by Range
        </h2>
        <div className="h-1 w-14 rounded-full bg-brand-gold" />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {categories.map((category, index) => {
          const Icon = categoryIcons[category.slug];
          return (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <Link
                href={`/products?category=${category.slug}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-brand-pink/40 hover:shadow-lg"
              >
                <span className="flex size-14 items-center justify-center rounded-full bg-brand-pink-soft text-brand-pink transition-colors group-hover:bg-brand-pink group-hover:text-white">
                  <Icon className="size-7" aria-hidden="true" />
                </span>
                <span className="font-heading text-sm font-bold text-brand-navy">
                  {category.label}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </Section>
  );
}
