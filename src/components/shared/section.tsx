import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";

const backgroundStyles = {
  default: "bg-background",
  muted: "bg-muted",
  navy: "bg-brand-navy text-white",
  "pink-soft": "bg-brand-pink-soft",
} as const;

interface SectionProps extends React.ComponentProps<"section"> {
  background?: keyof typeof backgroundStyles;
  containerClassName?: string;
}

export function Section({
  background = "default",
  className,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "py-16 md:py-20 lg:py-24",
        backgroundStyles[background],
        className
      )}
      {...props}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
