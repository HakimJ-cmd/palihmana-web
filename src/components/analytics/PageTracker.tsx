"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface PageTrackerProps {
  slug?: string;
  title?: string;
  pilar?: string;
  isArticle?: boolean;
}

export function PageTracker({
  slug,
  title,
  pilar,
  isArticle = false,
}: PageTrackerProps = {}) {
  const pathname = usePathname();
  const trackedRef = useRef<string>("");

  useEffect(() => {
    if (!pathname) return;

    // Check if this path was already tracked in this session to prevent spamming
    const key = `palihmana_track_${pathname}`;
    const alreadyTracked = typeof window !== "undefined" && window.sessionStorage.getItem(key);

    if (trackedRef.current === pathname || alreadyTracked) {
      return;
    }

    trackedRef.current = pathname;
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(key, "1");
    }

    // Determine if it's an article path: e.g. /utility/cara-membuat-ktp-elektronik
    const segments = pathname.split("/").filter(Boolean);
    const PILARS = ["utility", "understand", "opinion", "discover", "people", "field-notes"];
    const detectedIsArticle =
      isArticle || (segments.length >= 2 && PILARS.includes(segments[0].toLowerCase()));
    const detectedSlug = slug || (detectedIsArticle && segments.length >= 2 ? segments[1] : undefined);
    const detectedPilar = pilar || (detectedIsArticle && segments.length >= 2 ? segments[0].toUpperCase() : undefined);

    const payload = {
      path: pathname,
      slug: detectedSlug,
      title,
      pilar: detectedPilar,
      isArticle: detectedIsArticle,
    };

    try {
      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        navigator.sendBeacon("/api/analytics/track", blob);
      } else {
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Ignore background analytics tracking failure
    }
  }, [pathname, slug, title, pilar, isArticle]);

  return null;
}

