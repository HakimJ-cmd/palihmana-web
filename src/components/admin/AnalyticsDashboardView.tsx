"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Eye,
  TrendingUp,
  Flame,
  Globe,
  BookOpen,
  ArrowUpRight,
  ExternalLink,
  Search,
  Sparkles,
  PieChart,
} from "lucide-react";
import { AnalyticsSummary, ArticleViewMetric } from "@/modules/analytics/store";
import { PILAR_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";

interface AnalyticsDashboardViewProps {
  initialSummary: AnalyticsSummary;
}

export function AnalyticsDashboardView({ initialSummary }: AnalyticsDashboardViewProps) {
  const [summary] = useState<AnalyticsSummary>(initialSummary);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPilar, setSelectedPilar] = useState<string>("ALL");

  const filteredArticles = summary.topArticles.filter((a) => {
    const matchQuery =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPilar = selectedPilar === "ALL" || a.pilar === selectedPilar;
    return matchQuery && matchPilar;
  });

  const maxViews = summary.topArticles[0]?.views || 1;
  const topPilar = Object.entries(summary.pilarBreakdown).sort((a, b) => b[1] - a[1])[0];

  // Scale daily trends
  const maxDaily = Math.max(
    ...summary.dailyTrends.flatMap((d) => [d.webVisits, d.articleReads]),
    3000
  );

  return (
    <div className="mt-8 rounded-xl border border-line bg-surface p-6 shadow-xs">
      {/* ─── Header ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              <Flame className="h-3 w-3" /> Data Lalu Lintas Pembaca Real-time
            </span>
            <span className="text-xs text-ink-muted">Analitik Minat Warga</span>
          </div>
          <h2 className="mt-1 font-serif text-xl font-bold tracking-tight text-ink sm:text-2xl flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Statistik Kunjungan Web & Popularitas Artikel
          </h2>
          <p className="mt-1 text-xs text-ink-muted">
            Ketahui seberapa banyak orang mengunjungi portal web dan berita mana yang paling banyak dibaca atau diminati masyarakat Tasikmalaya.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted bg-surface-alt px-3 py-1.5 rounded-lg border border-line">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Pelacakan Aktif
          </span>
        </div>
      </div>

      {/* ─── 4 Top Key Metrics Cards ─────────────────────────────────── */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Web Visits */}
        <div className="rounded-xl border border-line bg-surface-alt/70 p-4 shadow-xs">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Kunjungan Web</span>
            <Globe className="h-4 w-4 text-blue-600" />
          </div>
          <p className="mt-2 font-serif text-2xl font-bold text-ink">
            {summary.totalWebVisits.toLocaleString("id-ID")}
          </p>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-ink-muted">Hari Ini:</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              +{summary.todayVisits.toLocaleString("id-ID")} kunjungan
            </span>
          </div>
        </div>

        {/* Total Article Taps / Reads */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Tap & Baca Artikel</span>
            <BookOpen className="h-4 w-4" />
          </div>
          <p className="mt-2 font-serif text-2xl font-bold text-ink">
            {summary.totalArticleReads.toLocaleString("id-ID")}
          </p>
          <div className="mt-1 flex items-center justify-between text-[11px]">
            <span className="text-ink-muted">Hari Ini:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              +{summary.todayArticleReads.toLocaleString("id-ID")} pembacaan
            </span>
          </div>
        </div>

        {/* Rasio Konversi Baca */}
        <div className="rounded-xl border border-line bg-surface-alt/70 p-4 shadow-xs">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">Interaksi Membaca</span>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 font-serif text-2xl font-bold text-ink">
            {Math.round((summary.totalArticleReads / (summary.totalWebVisits || 1)) * 100)}%
          </p>
          <p className="mt-1 text-[11px] text-ink-muted">Pengunjung yang membuka draf berita</p>
        </div>

        {/* Pilar Paling Populer */}
        <div className="rounded-xl border border-line bg-surface-alt/70 p-4 shadow-xs">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">Topik Paling Diminati</span>
            <Sparkles className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 font-serif text-xl font-bold text-ink truncate">
            {(PILAR_LABELS as Record<string, string>)[topPilar?.[0]] || topPilar?.[0] || "Utility"}
          </p>
          <p className="mt-1 text-[11px] text-ink-muted">
            {(topPilar?.[1] || 0).toLocaleString("id-ID")} kali dibaca warga
          </p>
        </div>
      </div>

      {/* ─── Grafik Tren Kunjungan Harian (7 Hari Terakhir) ───────────── */}
      <div className="mt-8 rounded-xl border border-line bg-surface-alt/40 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="font-serif text-sm font-bold text-ink">
              Tren Kunjungan Harian & Pembacaan Artikel (7 Hari Terakhir)
            </h3>
            <p className="text-xs text-ink-muted">
              Perbandingan antara pengunjung portal web dan artikel yang dibuka setiap harinya.
            </p>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-blue-600"></span>
              <span className="text-ink">Kunjungan Web</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-emerald-500"></span>
              <span className="text-ink">Tap / Pembaca Artikel</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end pt-4 pb-2 border-b border-line">
          {summary.dailyTrends.map((d) => {
            const webHeightPct = Math.min(100, Math.round((d.webVisits / maxDaily) * 100));
            const readsHeightPct = Math.min(100, Math.round((d.articleReads / maxDaily) * 100));

            return (
              <div key={d.date} className="flex flex-col items-center gap-1.5 group">
                <div className="flex items-end justify-center gap-1.5 sm:gap-2.5 w-full h-36 pt-4">
                  {/* Web Visits Bar */}
                  <div className="flex flex-col items-center w-full max-w-[20px] sm:max-w-[28px]">
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.webVisits}
                    </span>
                    <div
                      className="w-full bg-blue-600 rounded-t-sm hover:bg-blue-700 transition-all duration-300"
                      style={{ height: `${webHeightPct}%`, minHeight: "8px" }}
                      title={`Kunjungan Web: ${d.webVisits.toLocaleString("id-ID")}`}
                    ></div>
                  </div>

                  {/* Article Reads Bar */}
                  <div className="flex flex-col items-center w-full max-w-[20px] sm:max-w-[28px]">
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.articleReads}
                    </span>
                    <div
                      className="w-full bg-emerald-500 rounded-t-sm hover:bg-emerald-600 transition-all duration-300"
                      style={{ height: `${readsHeightPct}%`, minHeight: "8px" }}
                      title={`Tap Artikel: ${d.articleReads.toLocaleString("id-ID")}`}
                    ></div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-ink">{d.dayLabel}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Papan Peringkat Artikel Terpopuler (Most Read Content) ───── */}
      <div className="mt-8 rounded-xl border border-line bg-surface overflow-hidden">
        <div className="border-b border-line p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="font-serif text-base font-bold text-ink flex items-center gap-2">
                <Flame className="h-4 w-4 text-amber-500" />
                Papan Peringkat Artikel Terpopuler & Paling Banyak Dibaca
              </h3>
              <p className="text-xs text-ink-muted mt-0.5">
                Daftar berita dan artikel yang paling banyak dilihat (tap artikel) oleh pembaca.
              </p>
            </div>

            {/* Search & Pilar Filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative w-full sm:w-52">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
                <input
                  type="text"
                  placeholder="Cari artikel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-line bg-surface pl-8 pr-3 py-1.5 text-xs text-ink focus:border-primary focus:outline-none"
                />
              </div>

              <select
                value={selectedPilar}
                onChange={(e) => setSelectedPilar(e.target.value)}
                className="rounded-lg border border-line bg-surface px-3 py-1.5 text-xs text-ink focus:border-primary focus:outline-none font-medium"
              >
                <option value="ALL">Semua Pilar</option>
                <option value="UTILITY">Utility</option>
                <option value="UNDERSTAND">Understand</option>
                <option value="DISCOVER">Discover</option>
                <option value="OPINION">Opinion</option>
                <option value="PEOPLE">People</option>
                <option value="FIELD_NOTES">Field Notes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table of Top Articles */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-surface-alt font-sans text-ink-muted uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3 font-semibold text-center w-12">#</th>
                <th className="px-5 py-3 font-semibold">Judul Konten / Berita</th>
                <th className="px-5 py-3 font-semibold">Pilar</th>
                <th className="px-5 py-3 font-semibold text-right">Jumlah Pembaca</th>
                <th className="px-5 py-3 font-semibold text-right">Pengunjung Unik</th>
                <th className="px-5 py-3 font-semibold">Popularitas Relatif</th>
                <th className="px-5 py-3 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-ink-muted">
                    Tidak ditemukan artikel yang sesuai filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((article, idx) => {
                  const pct = Math.round((article.views / maxViews) * 100);
                  const isTop3 = idx < 3;

                  return (
                    <tr key={article.slug} className="hover:bg-surface-alt/50 transition-colors">
                      <td className="px-5 py-3.5 text-center font-serif font-bold">
                        <span
                          className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs ${
                            idx === 0
                              ? "bg-amber-500 text-white shadow-xs font-bold"
                              : idx === 1
                              ? "bg-slate-300 dark:bg-slate-700 text-ink font-bold"
                              : idx === 2
                              ? "bg-amber-700/60 text-white font-bold"
                              : "text-ink-muted"
                          }`}
                        >
                          {idx + 1}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-serif text-sm font-semibold text-ink line-clamp-1 max-w-md block">
                          {article.title}
                        </span>
                        <span className="text-[11px] font-mono text-ink-muted">
                          /{article.pilar.toLowerCase()}/{article.slug}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge
                          variant={article.pilar === "UTILITY" ? "utility" : "outline"}
                          size="sm"
                        >
                          {(PILAR_LABELS as Record<string, string>)[article.pilar] || article.pilar}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-bold text-ink">
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <Eye className="h-3 w-3" />
                          {article.views.toLocaleString("id-ID")}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono text-ink-muted">
                        {article.uniqueVisitors.toLocaleString("id-ID")}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="w-32">
                          <div className="flex items-center justify-between text-[10px] font-mono text-ink-muted mb-1">
                            <span>{pct}%</span>
                          </div>
                          <div className="h-2 w-full bg-surface-alt rounded-full overflow-hidden border border-line">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-300"
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/${article.pilar.toLowerCase()}/${article.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-semibold text-ink hover:text-primary hover:bg-primary/10 transition-colors"
                        >
                          Buka <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Distribusi Minat Pembaca per Pilar ───────────────────────── */}
      <div className="mt-8 rounded-xl border border-line bg-surface p-5">
        <div className="flex items-center gap-2 mb-3 text-ink">
          <PieChart className="h-4 w-4 text-primary" />
          <h3 className="font-serif text-sm font-bold">
            Distribusi Minat Pembaca per Pilar Berita
          </h3>
        </div>
        <p className="text-xs text-ink-muted mb-4">
          Data ini menunjukkan pilar apa yang paling diminati warga sehingga redaksi dapat memprioritaskan liputan yang relevan.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(summary.pilarBreakdown).map(([pilar, count]) => {
            const pct = Math.round((count / (summary.totalArticleReads || 1)) * 100);
            return (
              <div key={pilar} className="rounded-lg border border-line bg-surface-alt p-3 text-xs">
                <div className="flex items-center justify-between mb-1.5 font-medium">
                  <span className="font-bold text-ink">
                    {(PILAR_LABELS as Record<string, string>)[pilar] || pilar}
                  </span>
                  <span className="font-mono text-ink-muted">
                    {count.toLocaleString("id-ID")} ({pct}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-surface rounded-full overflow-hidden border border-line">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
