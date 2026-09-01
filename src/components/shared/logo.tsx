import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/constants/site";

interface LogoProps {
  className?: string;
  variant?: "default" | "inverted";
  href?: string;
}

export function Logo({ className, variant = "default", href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2.5 block", className)}
      aria-label={siteConfig.name}
    >
      <Image
        src="/cresta-logo.png"
        alt="Cresta Global Logo"
        width={124}
        height={112}
        className="object-contain"
        priority
      />
    </Link>
  );
}
