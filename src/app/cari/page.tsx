"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { Search, X, Loader2, ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/article/ArticleCard";
import { ArticleItem } from "@/types";

const SUGGESTED_QUERIES = [
  "KTP Tasikmalaya",
  "Kemiskinan",
  "Kopi",
  "Bordir Kawalu",
  "Transportasi",
  "Alun-alun",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ArticleItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSearch = async (searchTerm: string) => {
    const q = searchTerm.trim();
    if (!q) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleChipClick = (term: string) => {
    setQuery(term);
    handleSearch(term);
  };

  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* ─── Search Header ────────────────────────────────────────── */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Cari di Palihmana.id
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Cari panduan layanan, konteks isu lokal, direktori, dan catatan warga Tasikmalaya
        </p>

        {/* ─── Search Input Box ─────────────────────────────────────── */}
        <form onSubmit={onSubmit} className="relative mt-6 flex items-center">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik topik, panduan, atau nama instansi..."
            className="h-12 w-full rounded border border-line bg-surface pl-11 pr-24 text-base text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            autoFocus
          />
          <Search className="absolute left-3.5 h-5 w-5 text-ink-muted pointer-events-none" />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults([]);
                setHasSearched(false);
              }}
              className="absolute right-16 flex h-8 w-8 items-center justify-center text-ink-muted hover:text-ink"
              aria-label="Hapus kata pencarian"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <button
            type="submit"
            className="absolute right-1.5 rounded bg-primary px-3.5 py-2 text-xs font-semibold text-white hover:bg-primary-hover"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Cari"}
          </button>
        </form>

        {/* ─── Keyword Suggestion Chips ─────────────────────────────── */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-ink-muted">
          <span>Saran pencarian:</span>
          {SUGGESTED_QUERIES.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => handleChipClick(term)}
              className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-ink hover:border-primary hover:text-primary transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Results Section ────────────────────────────────────────── */}
      <div className="mt-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-ink-muted">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-3 text-sm">Mencari informasi...</p>
          </div>
        ) : hasSearched && results.length === 0 ? (
          <div className="rounded border border-dashed border-line p-12 text-center">
            <p className="font-serif text-lg font-semibold text-ink">
              Belum ada hasil untuk &ldquo;{query}&rdquo;
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              Coba kata kunci lain atau jelajahi kategori di bawah ini.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/utility"
                className="rounded border border-line bg-surface px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-alt"
              >
                Lihat Panduan Utility
              </Link>
              <Link
                href="/"
                className="rounded bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-hover"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        ) : results.length > 0 ? (
          <div>
            <div className="mb-6 flex items-center justify-between border-b border-line pb-3">
              <h2 className="font-serif text-xl font-bold text-ink">
                Ditemukan {results.length} hasil untuk &ldquo;{query}&rdquo;
              </h2>
            </div>
            <div className="space-y-3">
              {results.map((article) => (
                <ArticleCard key={article.id} article={article} variant="compact" />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
