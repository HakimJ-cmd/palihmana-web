"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, X, Loader2, ArrowRight, Phone, MapPin, Calendar, Clock, Newspaper, Building2, Ticket } from "lucide-react";
import { ArticleCard } from "@/components/article/ArticleCard";
import { ArticleItem } from "@/types";
import { UtilityItem } from "@/modules/utilities/queries";
import { EventItem } from "@/modules/events/queries";
import { UTILITY_LABELS } from "@/lib/constants";
import { formatDateShort } from "@/lib/utils";

const SUGGESTED_QUERIES = [
  "KTP Tasikmalaya",
  "Kemiskinan",
  "Kopi",
  "Bordir Kawalu",
  "Terminal",
  "Rumah Sakit",
  "Alun-alun",
];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<"ALL" | "ARTICLES" | "UTILITIES" | "EVENTS">("ALL");
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [utilities, setUtilities] = useState<UtilityItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      executeSearch(initialQuery);
    }
  }, [initialQuery]);

  // Debounced live search
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setArticles([]);
      setUtilities([]);
      setEvents([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(() => {
      executeSearch(trimmed);
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const executeSearch = async (searchTerm: string) => {
    setIsLoading(true);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
      const data = await res.json();
      setArticles(data.articles || []);
      setUtilities(data.utilities || []);
      setEvents(data.events || []);
    } catch (err) {
      console.error("Search error:", err);
      setArticles([]);
      setUtilities([]);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      executeSearch(query.trim());
    }
  };

  const handleChipClick = (term: string) => {
    setQuery(term);
    executeSearch(term);
  };

  const totalResults = articles.length + utilities.length + events.length;

  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* ─── Search Header ────────────────────────────────────────── */}
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Pusat Pencarian Warga Palihmana.ID
        </h1>
        <p className="mt-2 text-sm text-ink-muted">
          Temukan panduan resmi, nomor darurat, arsip liputan, dan agenda terverifikasi di Tasikmalaya & sekitarnya
        </p>

        {/* ─── Search Input Box ─────────────────────────────────────── */}
        <form onSubmit={onSubmit} className="relative mt-6 flex items-center">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari KTP, nomor IGD, tempat ngopi, jadwal acara..."
            className="h-12 w-full rounded-xl border border-line bg-surface pl-11 pr-24 text-base text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
            autoFocus
          />
          <Search className="absolute left-3.5 h-5 w-5 text-ink-muted pointer-events-none" />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setArticles([]);
                setUtilities([]);
                setEvents([]);
                setHasSearched(false);
              }}
              className="absolute right-16 flex h-8 w-8 items-center justify-center text-ink-muted hover:text-ink transition-colors"
              aria-label="Hapus kata pencarian"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <button
            type="submit"
            className="absolute right-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover transition-colors shadow-xs"
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
      <div className="mt-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-ink-muted">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-3 text-sm">Menelusuri arsip berita, direktori warga & agenda...</p>
          </div>
        ) : hasSearched && totalResults === 0 ? (
          <div className="rounded-xl border border-dashed border-line p-12 text-center bg-surface">
            <p className="font-serif text-lg font-semibold text-ink">
              Belum ada hasil untuk &ldquo;{query}&rdquo;
            </p>
            <p className="mt-1 text-xs text-ink-muted max-w-md mx-auto">
              Periksa ejaan kata kunci Anda, atau jelajahi pilar informasi utama di bawah ini:
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/utility"
                className="rounded-lg border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-ink hover:bg-surface-alt transition-colors"
              >
                Panduan Utility
              </Link>
              <Link
                href="/understand"
                className="rounded-lg border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-ink hover:bg-surface-alt transition-colors"
              >
                Analisis Understand
              </Link>
              <Link
                href="/kalender"
                className="rounded-lg border border-line bg-surface px-3.5 py-2 text-xs font-semibold text-ink hover:bg-surface-alt transition-colors"
              >
                Kalender Acara
              </Link>
            </div>
          </div>
        ) : hasSearched ? (
          <div>
            {/* Grouped Tabs (PRD F1-SEARCH-02) */}
            <div className="flex flex-wrap items-center gap-2 border-b border-line pb-4 mb-8 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab("ALL")}
                className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                  activeTab === "ALL"
                    ? "bg-primary text-white"
                    : "bg-surface text-ink-muted hover:bg-surface-alt"
                }`}
              >
                Semua Hasil ({totalResults})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("ARTICLES")}
                className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === "ARTICLES"
                    ? "bg-primary text-white"
                    : "bg-surface text-ink-muted hover:bg-surface-alt"
                }`}
              >
                <Newspaper className="h-3.5 w-3.5" />
                Artikel & Berita ({articles.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("UTILITIES")}
                className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === "UTILITIES"
                    ? "bg-primary text-white"
                    : "bg-surface text-ink-muted hover:bg-surface-alt"
                }`}
              >
                <Building2 className="h-3.5 w-3.5" />
                Layanan & Panduan Warga ({utilities.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("EVENTS")}
                className={`px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === "EVENTS"
                    ? "bg-primary text-white"
                    : "bg-surface text-ink-muted hover:bg-surface-alt"
                }`}
              >
                <Ticket className="h-3.5 w-3.5" />
                Agenda & Acara ({events.length})
              </button>
            </div>

            {/* SECTION 1: PUBLIC SERVICES & UTILITIES */}
            {(activeTab === "ALL" || activeTab === "UTILITIES") && utilities.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center justify-between border-b border-line pb-2 mb-4">
                  <h2 className="font-serif text-lg font-bold text-ink flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span>Layanan Publik & Direktori Terkait ({utilities.length})</span>
                  </h2>
                  <Link href="/utility" className="text-xs font-semibold text-primary hover:underline">
                    Lihat Semua Direktori →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {utilities.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-line bg-surface flex flex-col justify-between shadow-xs hover:border-primary/50 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-2">
                          <span className="font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {UTILITY_LABELS[item.category] || item.category}
                          </span>
                          {item.openingHours && (
                            <span className="text-ink-muted flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.openingHours}
                            </span>
                          )}
                        </div>
                        <h3 className="font-serif text-base font-bold text-ink mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                        {item.address && (
                          <p className="text-[11px] text-ink-muted mt-2 flex items-start gap-1">
                            <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{item.address}</span>
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-line flex items-center justify-between gap-2">
                        {item.contactNumber ? (
                          <a
                            href={`tel:${item.contactNumber}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors"
                          >
                            <Phone className="h-3.5 w-3.5" />
                            <span>Hubungi</span>
                          </a>
                        ) : <span />}

                        {item.gmapsLink && (
                          <a
                            href={item.gmapsLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-ink-muted hover:text-primary transition-colors flex items-center gap-1"
                          >
                            <span>Buka Maps</span>
                            <ArrowRight className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 2: AGENDA EVENTS */}
            {(activeTab === "ALL" || activeTab === "EVENTS") && events.length > 0 && (
              <section className="mb-10">
                <div className="flex items-center justify-between border-b border-line pb-2 mb-4">
                  <h2 className="font-serif text-lg font-bold text-ink flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span>Agenda & Acara Terkait ({events.length})</span>
                  </h2>
                  <Link href="/kalender" className="text-xs font-semibold text-primary hover:underline">
                    Buka Kalender Priangan →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {events.map((evt) => (
                    <div
                      key={evt.id}
                      className="p-4 rounded-xl border border-line bg-surface flex flex-col justify-between shadow-xs hover:border-primary/50 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-2">
                          <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                            {formatDateShort(evt.eventDate)}
                          </span>
                          <span className="text-ink-muted font-medium">{evt.priceNote || "Gratis"}</span>
                        </div>
                        <h3 className="font-serif text-base font-bold text-ink mb-1">
                          {evt.title}
                        </h3>
                        <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
                          {evt.description}
                        </p>
                        <p className="text-[11px] text-ink-muted mt-2 flex items-start gap-1">
                          <MapPin className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{evt.location}</span>
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-line flex items-center justify-between">
                        <span className="text-[11px] text-ink-muted">Penyelenggara: {evt.organizer}</span>
                        <Link
                          href="/kalender"
                          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          Detail Acara <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION 3: ARTICLES */}
            {(activeTab === "ALL" || activeTab === "ARTICLES") && articles.length > 0 && (
              <section className="mb-10">
                <div className="border-b border-line pb-2 mb-4">
                  <h2 className="font-serif text-lg font-bold text-ink flex items-center gap-2">
                    <Newspaper className="h-4 w-4 text-primary" />
                    <span>Artikel & Catatan Liputan ({articles.length})</span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} variant="standard" />
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-page px-4 py-16 text-center text-xs text-ink-muted">Memuat pencarian...</div>}>
      <SearchContent />
    </Suspense>
  );
}

