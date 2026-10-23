"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);

  // When pathname or searchParams change, navigation is complete
  useEffect(() => {
    if (progress > 0) {
      setProgress(100);
      const timer = setTimeout(() => {
        setIsNavigating(false);
        setProgress(0);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams, progress]);

  // Intercept clicks on links for immediate tactile feedback
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        target.getAttribute("target") === "_blank" ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      // If it's an internal route that differs from current path
      try {
        const url = new URL(href, window.location.origin);
        if (
          url.origin === window.location.origin &&
          (url.pathname !== window.location.pathname || url.search !== window.location.search)
        ) {
          setIsNavigating(true);
          setProgress(25);
          setTimeout(() => {
            setProgress((prev) => (prev < 80 ? 75 : prev));
          }, 100);
        }
      } catch {
        // Ignore invalid URL
      }
    };

    document.addEventListener("click", handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleLinkClick, { capture: true });
    };
  }, []);

  if (!isNavigating && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[3px] bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-primary via-teal-400 to-emerald-400 transition-all duration-200 ease-out shadow-[0_0_8px_rgba(15,118,110,0.5)]"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
          transition: progress === 100 ? "width 150ms ease-out, opacity 250ms 100ms ease-out" : "width 200ms ease-out",
        }}
      />
    </div>
  );
}
