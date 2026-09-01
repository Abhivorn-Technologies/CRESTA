"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

// Global cache for timestamps to avoid duplicate fetches
let timestampsCache: Record<string, string> | null = null;
let fetchPromise: Promise<Record<string, string>> | null = null;
let lastFetchTime = 0;

export function CmsImage({ imageKey, alt, ...props }: Omit<ImageProps, "src"> & { imageKey: string }) {
  const [t, setT] = useState<string | null>(timestampsCache ? (timestampsCache[imageKey] || "") : null);

  useEffect(() => {
    let mounted = true;

    const fetchTimestamps = () => {
      const now = Date.now();
      
      if (timestampsCache && now - lastFetchTime < 3000) {
        if (mounted) setT(timestampsCache[imageKey] || "");
        return;
      }
      
      if (!fetchPromise || now - lastFetchTime >= 3000) {
        fetchPromise = fetch(`/api/images/timestamps?_cb=${now}`, { cache: "no-store" }).then(r => r.json());
        lastFetchTime = now;
      }
      
      fetchPromise.then(data => {
        timestampsCache = data;
        if (mounted) setT(data[imageKey] || "");
      }).catch(() => {
        if (mounted) setT(""); // fallback
      });
    };

    // Initial fetch on mount
    fetchTimestamps();

    // Auto-update when user switches back to this tab
    const onFocus = () => {
      fetchTimestamps();
    };
    
    window.addEventListener("focus", onFocus);
    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === 'visible') fetchTimestamps();
    });

    return () => {
      mounted = false;
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("visibilitychange", onFocus);
    };
  }, [imageKey]);

  // If t is null, we can just use the base URL (cached) until the timestamp resolves
  const src = `/api/images/${imageKey}${t ? `?t=${t}` : ""}`;

  return <Image src={src} alt={alt} unoptimized={true} {...props} />;
}
