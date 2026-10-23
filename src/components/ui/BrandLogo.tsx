import React from "react";
import Link from "next/link";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
  theme?: "auto" | "light" | "dark";
}

export function BrandLogo({
  size = "md",
  showTagline = true,
  className = "",
  theme = "auto",
}: BrandLogoProps) {
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-8 h-8 sm:w-9 sm:h-9",
    lg: "w-10 h-10 sm:w-12 sm:h-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
  };

  const isExplicitDark = theme === "dark";

  return (
    <Link href="/" prefetch={true} className={`group flex items-center gap-2.5 ${className}`}>
      {/* ─── Signature Emblem: "P" with Location Pin ─── */}
      <div
        className={`${iconSizes[size]} shrink-0 relative flex items-center justify-center rounded-lg ${
          isExplicitDark
            ? "bg-teal-950/80 border border-teal-400/40 text-teal-300 shadow-sm"
            : "bg-teal-50 dark:bg-teal-950/60 border border-teal-600/20 dark:border-teal-400/30 text-primary dark:text-teal-400"
        } group-hover:scale-105 transition-transform duration-150`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1"
        >
          {/* Location Pin Base Form */}
          <path
            d="M16 3C10.477 3 6 7.477 6 13C6 19.5 14.5 28.2 15.35 29.05C15.71 29.41 16.29 29.41 16.65 29.05C17.5 28.2 26 19.5 26 13C26 7.477 21.523 3 16 3Z"
            className={
              isExplicitDark
                ? "fill-teal-400/20 stroke-teal-300"
                : "fill-primary/15 dark:fill-teal-400/20 stroke-primary dark:stroke-teal-400"
            }
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
          {/* Stylized "P" inside the pin head */}
          <path
            d="M12.5 8.5H16.2C17.857 8.5 19.2 9.754 19.2 11.3C19.2 12.846 17.857 14.1 16.2 14.1H12.5V18.5"
            className={
              isExplicitDark
                ? "stroke-teal-200"
                : "stroke-primary dark:stroke-teal-300"
            }
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Central Anchor Dot */}
          <circle
            cx="16"
            cy="11.3"
            r="1.2"
            className={
              isExplicitDark
                ? "fill-teal-200"
                : "fill-primary dark:fill-teal-300"
            }
          />
        </svg>
      </div>

      {/* ─── Wordmark: palihmana.ID ─── */}
      <div className="flex flex-col leading-none">
        <div
          className={`font-sans font-bold tracking-tight ${
            isExplicitDark
              ? "text-white"
              : "text-ink dark:text-slate-100"
          } ${textSizes[size]}`}
        >
          <span>palihmana</span>
          <span className="text-teal-500 dark:text-teal-400 font-extrabold tracking-normal">.ID</span>
        </div>
        {showTagline && (
          <span
            className={`text-[10px] sm:text-[11px] font-medium tracking-normal mt-0.5 ${
              isExplicitDark
                ? "text-teal-200/80"
                : "text-ink-muted dark:text-teal-200/70"
            }`}
          >
            Media Solutif & Panduan Priangan
          </span>
        )}
      </div>
    </Link>
  );
}
