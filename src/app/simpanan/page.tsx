"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bookmark, Trash2, ArrowRight } from "lucide-react";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Badge } from "@/components/ui/Badge";
import { useBookmarks } from "@/lib/bookmarks";
import { PILAR_LABELS, PILAR_SLUGS } from "@/lib/constants";
import { Pilar } from "@prisma/client";

export default function BookmarksPage() {
  const { savedArticles, toggleSave, mounted } = useBookmarks();
  const [selectedPilar, setSelectedPilar] = useState<string>("ALL");

  if (!mounted) {
    return (
      <div className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:px-8 text-center text-ink-muted">
        Memuat artikel tersimpan...
      </div>
    );
  }

  // Get distinct pilars from saved articles
  const availablePilars = Array.from(new Set(savedArticles.map((a) => a.pilar)));

  const filtered = selectedPilar === "ALL"
    ? savedArticles
    : savedArticles.filter((a) => a.pilar === selectedPilar);

  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* ─── Breadcrumb ─────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-ink-muted">
        <Link href="/" className="hover:text-primary">
          Beranda
        </Link>
        <span>/</span>
        <span className="font-medium text-ink">Simpanan Saya</span>
      </nav>

      {/* ─── Header ─────────────────────────────────────────────────── */}
      <div className="mb-8 border-b border-line pb-6">
        <div className="flex items-center gap-2 text-primary">
          <Bookmark className="h-6 w-6 fill-primary" />
          <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Simpanan Saya
          </h1>
        </div>
        <p className="mt-2 text-sm text-ink-muted max-w-xl">
          Daftar artikel yang Anda tandai untuk dibaca nanti. Tersimpan secara privat di peramban Anda tanpa pengumpulan data pribadi.
        </p>
      </div>

      {savedArticles.length === 0 ? (
        /* ─── Empty State ──────────────────────────────────────────── */
        <div className="rounded border border-dashed border-line p-12 text-center">
          <Bookmark className="mx-auto h-10 w-10 text-ink-muted/50 stroke-1" />
          <h2 className="mt-4 font-serif text-lg font-semibold text-ink">
            Belum ada artikel yang disimpan
          </h2>
          <p className="mt-1 text-xs text-ink-muted">
            Tandai artikel atau panduan yang ingin kamu baca lagi menggunakan ikon bookmark.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/utility"
              className="inline-flex items-center gap-1.5 rounded bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover transition-colors"
            >
              Jelajahi Panduan Utility <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/"
              className="rounded border border-line bg-surface px-4 py-2 text-xs font-semibold text-ink hover:bg-surface-alt transition-colors"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      ) : (
        /* ─── Filter & Article Grid ────────────────────────────────── */
        <div>
          {/* Pilar Filter Tabs */}
          {availablePilars.length > 1 && (
            <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-line pb-4 text-xs font-medium">
              <button
                type="button"
                onClick={() => setSelectedPilar("ALL")}
                className={`rounded px-3 py-1.5 transition-colors ${
                  selectedPilar === "ALL"
                    ? "bg-primary text-white font-semibold"
                    : "bg-surface text-ink-muted hover:bg-surface-alt"
                }`}
              >
                Semua ({savedArticles.length})
              </button>
              {availablePilars.map((p) => {
                const label = PILAR_LABELS[p as Pilar] || p;
                const count = savedArticles.filter((a) => a.pilar === p).length;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setSelectedPilar(p)}
                    className={`rounded px-3 py-1.5 transition-colors ${
                      selectedPilar === p
                        ? "bg-primary text-white font-semibold"
                        : "bg-surface text-ink-muted hover:bg-surface-alt"
                    }`}
                  >
                    {label} ({count})
                  </button>
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article) => (
              <ArticleCard key={article.id} article={article} variant="standard" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
