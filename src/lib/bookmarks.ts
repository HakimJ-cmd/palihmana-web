"use client";

import { useState, useEffect } from "react";
import { ArticleItem } from "@/types";

const BOOKMARKS_STORAGE_KEY = "palihmana_saved_articles";

export function getSavedArticles(): ArticleItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to parse saved articles:", e);
    return [];
  }
}

export function isArticleSaved(slug: string): boolean {
  const saved = getSavedArticles();
  return saved.some((a) => a.slug === slug);
}

export function toggleSaveArticle(article: ArticleItem): boolean {
  if (typeof window === "undefined") return false;
  const current = getSavedArticles();
  const exists = current.some((a) => a.slug === article.slug);

  let updated: ArticleItem[];
  if (exists) {
    updated = current.filter((a) => a.slug !== article.slug);
  } else {
    // Add lightweight snapshot of article
    updated = [article, ...current];
  }

  localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("palihmana_bookmarks_updated"));
  return !exists;
}

export function useBookmarks() {
  const [savedArticles, setSavedArticles] = useState<ArticleItem[]>([]);
  const [mounted, setMounted] = useState(false);

  const refresh = () => {
    setSavedArticles(getSavedArticles());
  };

  useEffect(() => {
    setMounted(true);
    refresh();

    const handleUpdate = () => refresh();
    window.addEventListener("palihmana_bookmarks_updated", handleUpdate);
    return () => window.removeEventListener("palihmana_bookmarks_updated", handleUpdate);
  }, []);

  return {
    savedArticles,
    isSaved: (slug: string) => savedArticles.some((a) => a.slug === slug),
    toggleSave: toggleSaveArticle,
    mounted,
  };
}
