"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";

export function CtaBannerSection() {
  return (
    <section className="bg-brand-pink py-14">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left"
        >
          <div className="flex flex-col gap-1">
            <h3 className="font-heading text-2xl font-extrabold text-brand-navy">
              Want to become a Cresta retail partner?
            </h3>
            <p className="text-sm text-brand-navy/80 sm:text-base">
              Get in touch with our distribution team to start stocking Baskin Robbins today.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-brand-navy text-white hover:bg-brand-navy/90"
          >
            <Link href="/about#contact">
              Contact Our Team
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
