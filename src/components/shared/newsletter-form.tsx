"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { newsletterSchema, type NewsletterInput } from "@/lib/validations/newsletter";

export function NewsletterForm() {
  const form = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: NewsletterInput) => {
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        toast.error(payload.message ?? "Subscription failed. Please try again.");
        return;
      }

      toast.success(payload.message ?? "Subscribed successfully!");
      form.reset();
    } catch {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Your email address"
                    className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:ring-brand-pink"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-brand-pink-light" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="icon"
            disabled={form.formState.isSubmitting}
            className="shrink-0 bg-brand-pink text-white hover:bg-brand-pink-dark"
            aria-label="Subscribe"
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Send className="size-4" aria-hidden="true" />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
