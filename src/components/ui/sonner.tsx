"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      position="top-right"
      theme="light"
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-white group-[.toaster]:text-[#00113A] group-[.toaster]:border-none group-[.toaster]:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3)] group-[.toaster]:rounded-xl group-[.toaster]:font-sans group-[.toaster]:px-5 group-[.toaster]:py-4 group-[.toaster]:flex group-[.toaster]:items-center group-[.toaster]:gap-3 transition-all",
          description: "group-[.toast]:text-white/80 text-xs",
          error: "group-[.toaster]:!bg-[#e6127d] group-[.toaster]:!text-white [&>svg]:!text-white",
          success: "group-[.toaster]:!bg-[#10b981] group-[.toaster]:!text-white [&>svg]:!text-white",
          warning: "group-[.toaster]:!bg-[#F7CA00] group-[.toaster]:!text-[#00113A] [&>svg]:!text-[#00113A]",
          info: "group-[.toaster]:!bg-[#00113A] group-[.toaster]:!text-white [&>svg]:!text-white",
          actionButton: "group-[.toast]:bg-white/20 group-[.toast]:text-white font-medium rounded-md px-3 py-1.5",
          cancelButton: "group-[.toast]:bg-black/10 group-[.toast]:text-white font-medium rounded-md px-3 py-1.5",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
