"use client";

import { motion } from "framer-motion";
import { CheckCircle2, IceCreamCone, Snowflake, Truck } from "lucide-react";

import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";

const missionPoints = [
  "Sourced directly from Baskin Robbins for guaranteed authenticity",
  "Cold-chain logistics that keep every scoop fresh, from depot to doorstep",
  "Trusted by 100+ retail partners across the region",
];

export function MissionSection() {
  return (
    <Section background="pink-soft" className="overflow-hidden">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6"
        >
          <SectionHeading
            eyebrow="About Us"
            title="Our Mission"
            description="Cresta Global Private Limited exists to bring premium, authentic Baskin Robbins ice cream to every doorstep — reliably, quickly, and with the same joy every single time."
          />
          <ul className="flex flex-col gap-3">
            {missionPoints.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <CheckCircle2
                  className="mt-0.5 size-5 shrink-0 text-brand-pink"
                  aria-hidden="true"
                />
                <span className="text-sm leading-relaxed text-foreground/80 sm:text-base">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative flex items-center justify-center"
        >
          <div
            className="absolute size-72 rounded-full bg-brand-pink/60 blur-2xl"
            aria-hidden="true"
          />
          <div className="relative grid grid-cols-2 gap-4">
            <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-3xl bg-brand-navy text-white shadow-lg">
              <IceCreamCone className="size-10 text-brand-pink" aria-hidden="true" />
              <span className="text-sm font-semibold">Premium Quality</span>
            </div>
            <div className="mt-8 flex aspect-square flex-col items-center justify-center gap-2 rounded-3xl bg-white shadow-lg">
              <Truck className="size-10 text-brand-navy" aria-hidden="true" />
              <span className="text-sm font-semibold text-brand-navy">
                Fast Delivery
              </span>
            </div>
            <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-3xl bg-white shadow-lg">
              <Snowflake className="size-10 text-brand-navy" aria-hidden="true" />
              <span className="text-sm font-semibold text-brand-navy">
                Cold-Chain Stored
              </span>
            </div>
            <div className="mt-8 flex aspect-square flex-col items-center justify-center gap-2 rounded-3xl bg-brand-pink text-white shadow-lg">
              <CheckCircle2 className="size-10" aria-hidden="true" />
              <span className="text-sm font-semibold">100% Authentic</span>
            </div>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
