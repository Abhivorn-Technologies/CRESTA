"use client";

import { motion } from "framer-motion";
import { HeartHandshake, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { FeatureCard } from "@/components/shared/feature-card";

const features = [
  {
    icon: Zap,
    title: "Fast & Reliable Delivery",
    description:
      "Cold-chain logistics ensure every order reaches you fresh, on schedule, every time.",
  },
  {
    icon: Sparkles,
    title: "Wide Product Range",
    description:
      "From tubs to family packs, explore a full lineup of authentic Baskin Robbins flavors.",
  },
  {
    icon: ShieldCheck,
    title: "Guaranteed Quality",
    description:
      "Every product is sourced and stored under strict quality and hygiene standards.",
  },
  {
    icon: HeartHandshake,
    title: "Customer First",
    description:
      "Dedicated support for retail partners and customers, before and after delivery.",
  },
];

export function WhyChooseSection() {
  return (
    <Section background="default">
      <SectionHeading
        eyebrow="Why Cresta"
        title="Why Choose Cresta Global"
        description="Everything we do is built around freshness, authenticity, and dependable service."
        align="center"
        className="mx-auto mb-12"
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <FeatureCard {...feature} />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
