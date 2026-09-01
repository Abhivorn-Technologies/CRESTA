"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  IceCreamCone,
  Package,
  Snowflake,
  Store,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";

const features = [
  { icon: Award, label: "Official Baskin Robbins Distributor" },
  { icon: Package, label: "Bulk Orders Available" },
  { icon: Store, label: "Retail & Wholesale Supply" },
  { icon: Snowflake, label: "100% Cold Chain Delivery" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute -top-32 -right-32 size-96 rounded-full bg-brand-pink-soft blur-3xl"
        aria-hidden="true"
      />

      <Container className="relative grid items-center gap-12 py-14 lg:grid-cols-2 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-5"
        >
          <span className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Proud to be an
          </span>

          <h1 className="font-heading text-4xl leading-tight font-extrabold text-brand-navy sm:text-5xl">
            Baskin Robbins <span className="text-brand-pink">Distributor</span>
          </h1>

          <h2 className="font-heading text-xl font-bold text-brand-navy sm:text-2xl">
            Premium Ice Cream Delivered Across Your City
          </h2>

          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            We are an Authorized Baskin Robbins Distributor, supplying
            premium ice creams, sundaes, tubs, cakes and frozen desserts to
            retailers, cafes, supermarkets, restaurants and event organisers
            with{" "}
            <span className="font-semibold text-brand-pink">
              100% cold-chain delivery network.
            </span>
          </p>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-2">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-pink-soft text-brand-pink">
                  <Icon className="size-4.5" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-foreground">
                  {label}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-gold-soft text-sm font-extrabold text-brand-gold">
                31+
              </span>
              <span className="text-sm font-medium text-foreground">
                Iconic Flavours
              </span>
            </div>
          </div>

          <div>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-brand-pink text-white hover:bg-brand-pink-dark"
            >
              <Link href="/products">
                Order Now
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative"
        >
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-navy via-brand-navy to-brand-pink-dark shadow-xl">
            <div
              className="absolute -top-10 -left-10 size-40 rounded-full bg-brand-pink/30 blur-2xl"
              aria-hidden="true"
            />
            <div
              className="absolute -right-8 -bottom-8 size-48 rounded-full bg-brand-gold/20 blur-2xl"
              aria-hidden="true"
            />
            <IceCreamCone
              className="size-32 text-white/90 sm:size-40"
              strokeWidth={1.2}
              aria-hidden="true"
            />
          </div>

          <div className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg">
            <span className="flex size-10 items-center justify-center rounded-full bg-brand-pink-soft text-brand-pink">
              <Snowflake className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-brand-navy">
                100% Cold Chain
              </span>
              <span className="text-xs text-muted-foreground">
                Delivery Network
              </span>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
