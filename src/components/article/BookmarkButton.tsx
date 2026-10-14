"use client";

import React, { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { ArticleItem } from "@/types";
import { toggleSaveArticle, isArticleSaved } from "@/lib/bookmarks";

interface BookmarkButtonProps {
  article: ArticleItem;
  className?: string;
  size?: "sm" | "md";
}

export function BookmarkButton({
  article,
  className = "",
  size = "md",
}: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSaved(isArticleSaved(article.slug));

    const onUpdate = () => {
      setSaved(isArticleSaved(article.slug));
    };

    window.addEventListener("palihmana_bookmarks_updated", onUpdate);
    return () => window.removeEventListener("palihmana_bookmarks_updated", onUpdate);
  }, [article.slug]);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newState = toggleSaveArticle(article);
    setSaved(newState);
  };

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        className={`flex items-center justify-center rounded text-ink-muted/50 ${
          size === "sm" ? "h-8 w-8" : "h-9 w-9"
        } ${className}`}
        aria-label="Simpan artikel"
      >
        <Bookmark className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`flex items-center justify-center rounded transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
        size === "sm" ? "h-8 w-8" : "h-9 w-9"
      } ${
        saved
          ? "bg-primary-tint text-primary hover:bg-primary-tint/80"
          : "text-ink-muted hover:bg-surface-alt hover:text-ink"
      } ${className}`}
      aria-pressed={saved}
      aria-label={saved ? "Hapus dari simpanan" : "Simpan artikel"}
      title={saved ? "Hapus dari simpanan" : "Simpan artikel"}
    >
      <Bookmark
        className={`${size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} ${
          saved ? "fill-primary text-primary" : ""
        }`}
      />
    </button>
  );
}
