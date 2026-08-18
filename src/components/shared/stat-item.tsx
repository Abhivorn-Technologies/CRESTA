import { cn } from "@/lib/utils";
import { AnimatedCounter } from "@/components/shared/animated-counter";

interface StatItemProps {
  value: number;
  suffix?: string;
  label: string;
  className?: string;
  tone?: "default" | "inverted";
}

export function StatItem({
  value,
  suffix = "",
  label,
  className,
  tone = "inverted",
}: StatItemProps) {
  return (
    <div className={cn("flex flex-col items-center gap-1 text-center", className)}>
      <AnimatedCounter
        value={value}
        suffix={suffix}
        className={cn(
          "font-heading text-3xl font-extrabold sm:text-4xl",
          tone === "inverted" ? "text-brand-gold" : "text-brand-navy"
        )}
      />
      <span
        className={cn(
          "text-xs font-medium tracking-wide uppercase sm:text-sm",
          tone === "inverted" ? "text-white/70" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
    </div>
  );
}
