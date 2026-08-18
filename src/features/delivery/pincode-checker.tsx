"use client";

import * as React from "react";
import { CheckCircle2, Loader2, MapPin, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CheckResult {
  serviceable: boolean;
  message: string;
}

export function PincodeChecker({ className }: { className?: string }) {
  const [pincode, setPincode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<CheckResult | null>(null);

  const handleCheck = async () => {
    if (!/^\d{6}$/.test(pincode)) {
      setResult({ serviceable: false, message: "Enter a valid 6-digit pincode" });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/delivery/check-pincode?pincode=${pincode}`);
      const payload = await response.json();
      setResult({
        serviceable: Boolean(payload.data?.serviceable),
        message: payload.message ?? "Something went wrong",
      });
    } catch {
      setResult({ serviceable: false, message: "Something went wrong. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground",
            className
          )}
        >
          <MapPin className="size-4 text-brand-pink" aria-hidden="true" />
          Check Pincode
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-foreground">
            Check delivery availability
          </p>
          <div className="flex gap-2">
            <Input
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter 6-digit pincode"
              value={pincode}
              onChange={(event) =>
                setPincode(event.target.value.replace(/\D/g, ""))
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") handleCheck();
              }}
            />
            <Button
              onClick={handleCheck}
              disabled={loading}
              className="shrink-0 bg-brand-pink text-white hover:bg-brand-pink-dark"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                "Check"
              )}
            </Button>
          </div>
          {result ? (
            <div
              className={cn(
                "flex items-start gap-2 rounded-lg p-2.5 text-sm",
                result.serviceable
                  ? "bg-brand-pink-soft text-brand-pink-dark"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {result.serviceable ? (
                <CheckCircle2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              ) : (
                <XCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              )}
              {result.message}
            </div>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}
