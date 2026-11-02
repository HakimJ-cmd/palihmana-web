"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  BarChart3,
  Users,
  Award,
  CheckCircle2,
  Clock,
  FileText,
  ShieldCheck,
  Shield,
  User,
  Filter,
  UserPlus,
} from "lucide-react";
import { ProductivitySummary, StaffProductivityItem } from "@/modules/users/store";
import { formatDateShort } from "@/lib/utils";

interface ProductivityChartProps {
  data: ProductivitySummary;
  isSuperAdmin: boolean;
}

export function ProductivityChart({ data, isSuperAdmin }: ProductivityChartProps) {
  const [filterRole, setFilterRole] = useState<"ALL" | "CONTRIBUTOR" | "EDITOR">("ALL");

  // Strictly enforce super admin visibility
  if (!isSuperAdmin) {
    return null;
  }

  const filteredStaff = data.staffList.filter((s) => {
    if (filterRole === "ALL") return s.role === "CONTRIBUTOR" || s.role === "EDITOR";
    return s.role === filterRole;
  });

  // Calculate highest monthly count for scaling the chart
  const maxMonthlyCount = Math.max(
    ...data.monthlyTrend.flatMap((m) => [m.editorCount, m.contributorCount]),
    15
  );

  return (
    <div className="mt-8 rounded-xl border border-line bg-surface p-6 shadow-xs">
      {/* ─── Header & Filter ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-teal-500/15 border border-teal-500/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
              <ShieldCheck className="h-3 w-3" /> Khusus Super Admin
            </span>
            <span className="text-xs text-ink-muted">Metrik Produktivitas Redaksi</span>
          </div>
          <h2 className="mt-1 font-serif text-xl font-bold tracking-tight text-ink sm:text-2xl flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Grafik Produktivitas Kontributor & Editor
          </h2>
          <p className="mt-1 text-xs text-ink-muted">
            Pantau perbandingan output tulisan, verifikasi draf, dan keaktifan para kontributor warga serta editor redaksi.
          </p>
        </div>

        {/* Actions & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
          <div className="flex items-center gap-1.5 bg-surface-alt p-1 rounded-lg border border-line text-xs font-semibold">
            <button
              onClick={() => setFilterRole("ALL")}
              className={`rounded-md px-3 py-1.5 transition-all ${
                filterRole === "ALL"
                  ? "bg-surface text-ink shadow-xs font-bold"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Semua ({data.totalContributors + data.totalEditors})
            </button>
            <button
              onClick={() => setFilterRole("CONTRIBUTOR")}
              className={`rounded-md px-3 py-1.5 transition-all ${
                filterRole === "CONTRIBUTOR"
                  ? "bg-surface text-emerald-600 dark:text-emerald-400 shadow-xs font-bold"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Kontributor ({data.totalContributors})
            </button>
            <button
              onClick={() => setFilterRole("EDITOR")}
              className={`rounded-md px-3 py-1.5 transition-all ${
                filterRole === "EDITOR"
                  ? "bg-surface text-blue-600 dark:text-blue-400 shadow-xs font-bold"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Editor ({data.totalEditors})
            </button>
          </div>

          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1.5 rounded-lg bg-teal-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-teal-700 transition-colors shadow-xs"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Kelola Akun</span>
          </Link>
        </div>
      </div>

      {/* ─── Top Productivity Summary Cards ──────────────────────────── */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Kontributor */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300">
            <span className="text-[11px] font-bold uppercase tracking-wider">Kontributor Warga</span>
            <User className="h-4 w-4" />
          </div>
          <p className="mt-2 font-serif text-2xl font-bold text-ink">
            {data.totalContributors} <span className="text-xs font-sans font-normal text-ink-muted">Orang Aktif</span>
          </p>
          <p className="mt-1 text-[11px] text-ink-muted">
            Menghasilkan <strong className="text-emerald-600 dark:text-emerald-400">{data.totalContributorArticles}</strong> artikel terbit
          </p>
        </div>

        {/* Total Editor */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
          <div className="flex items-center justify-between text-blue-700 dark:text-blue-300">
            <span className="text-[11px] font-bold uppercase tracking-wider">Editor Redaksi</span>
            <Shield className="h-4 w-4" />
          </div>
          <p className="mt-2 font-serif text-2xl font-bold text-ink">
            {data.totalEditors} <span className="text-xs font-sans font-normal text-ink-muted">Orang Aktif</span>
          </p>
          <p className="mt-1 text-[11px] text-ink-muted">
            Menghasilkan <strong className="text-blue-600 dark:text-blue-400">{data.totalEditorArticles}</strong> artikel terbit
          </p>
        </div>

        {/* Rasio Kontribusi */}
        <div className="rounded-xl border border-line bg-surface-alt p-4">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">Rasio Kontribusi Warga</span>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 font-serif text-2xl font-bold text-ink">
            {Math.round(
              (data.totalContributorArticles /
                (data.totalContributorArticles + data.totalEditorArticles || 1)) *
                100
            )}%
          </p>
          <p className="mt-1 text-[11px] text-ink-muted">Porsi tulisan dari kontributor daerah</p>
        </div>

        {/* Output Efisiensi */}
        <div className="rounded-xl border border-line bg-surface-alt p-4">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Output Terbit</span>
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 font-serif text-2xl font-bold text-ink">
            {data.totalContributorArticles + data.totalEditorArticles}
          </p>
          <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            +32% pertumbuhan bulan ini
          </p>
        </div>
      </div>

      {/* ─── Visual Output Bar Chart: Editor vs Contributor ──────────── */}
      <div className="mt-8 rounded-xl border border-line bg-surface-alt/50 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="font-serif text-sm font-bold text-ink">
              Tren Produktivitas Bulanan: Editor vs Kontributor (2026)
            </h3>
            <p className="text-xs text-ink-muted">
              Volume artikel terbit per bulan berdasarkan kategori peran penulis.
            </p>
          </div>
          {/* Chart Legend */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-blue-600"></span>
              <span className="text-ink">Editor Redaksi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-emerald-500"></span>
              <span className="text-ink">Kontributor Warga</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Graph */}
        <div className="grid grid-cols-4 gap-4 items-end pt-4 pb-2 border-b border-line">
          {data.monthlyTrend.map((item) => {
            const editorHeightPct = Math.min(100, Math.round((item.editorCount / maxMonthlyCount) * 100));
            const contribHeightPct = Math.min(100, Math.round((item.contributorCount / maxMonthlyCount) * 100));

            return (
              <div key={item.month} className="flex flex-col items-center gap-2 group">
                <div className="flex items-end justify-center gap-2 sm:gap-3 w-full h-40 pt-4">
                  {/* Editor Bar */}
                  <div className="flex flex-col items-center w-full max-w-[28px] sm:max-w-[36px]">
                    <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 mb-1 group-hover:scale-110 transition-transform">
                      {item.editorCount}
                    </span>
                    <div
                      className="w-full bg-blue-600 rounded-t-md hover:bg-blue-700 transition-all duration-300"
                      style={{ height: `${editorHeightPct}%`, minHeight: "10px" }}
                      title={`Editor: ${item.editorCount} artikel`}
                    ></div>
                  </div>

                  {/* Contributor Bar */}
                  <div className="flex flex-col items-center w-full max-w-[28px] sm:max-w-[36px]">
                    <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-1 group-hover:scale-110 transition-transform">
                      {item.contributorCount}
                    </span>
                    <div
                      className="w-full bg-emerald-500 rounded-t-md hover:bg-emerald-600 transition-all duration-300"
                      style={{ height: `${contribHeightPct}%`, minHeight: "10px" }}
                      title={`Kontributor: ${item.contributorCount} artikel`}
                    ></div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-ink mt-2">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Individual Contributor & Editor Leaderboard ──────────────── */}
      <div className="mt-8 overflow-hidden rounded-xl border border-line bg-surface">
        <div className="border-b border-line px-5 py-3.5 flex items-center justify-between">
          <h3 className="font-serif text-sm font-bold text-ink">
            Papan Peringkat Produktivitas & Detail Penulis
          </h3>
          <span className="text-xs text-ink-muted">Diurutkan berdasarkan skor keaktifan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-surface-alt font-sans text-ink-muted uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3 font-semibold">Penulis / Akun</th>
                <th className="px-5 py-3 font-semibold">Peran</th>
                <th className="px-5 py-3 font-semibold text-center">Terbit</th>
                <th className="px-5 py-3 font-semibold text-center">Draf / Review</th>
                <th className="px-5 py-3 font-semibold text-center">Menit Baca</th>
                <th className="px-5 py-3 font-semibold">Tingkat Produktivitas</th>
                <th className="px-5 py-3 font-semibold text-right">Aktivitas Terakhir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {filteredStaff.map((staff) => {
                const isContributor = staff.role === "CONTRIBUTOR";
                return (
                  <tr key={staff.id} className="hover:bg-surface-alt/50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-ink">
                      <div className="font-semibold text-sm">{staff.name}</div>
                      <div className="font-mono text-[11px] text-ink-muted">{staff.email}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      {isContributor ? (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                          <User className="h-3 w-3" /> Kontributor
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-blue-500/15 border border-blue-500/30 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:text-blue-300">
                          <Shield className="h-3 w-3" /> Editor Redaksi
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono font-bold text-ink">
                      {staff.publishedCount}
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono text-ink-muted">
                      {staff.draftCount + staff.factCheckCount}
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono text-ink-muted">
                      {staff.readingMinutesTotal} mnt
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="w-36">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-semibold text-ink">
                            {staff.productivityScore >= 80
                              ? "Sangat Produktif"
                              : staff.productivityScore >= 50
                              ? "Aktif"
                              : "Perlu Dorongan"}
                          </span>
                          <span className="font-mono text-ink-muted">{staff.productivityScore}%</span>
                        </div>
                        <div className="h-2 w-full bg-surface-alt rounded-full overflow-hidden border border-line">
                          <div
                            className={`h-full rounded-full ${
                              staff.productivityScore >= 80
                                ? "bg-emerald-500"
                                : staff.productivityScore >= 50
                                ? "bg-primary"
                                : "bg-amber-500"
                            }`}
                            style={{ width: `${staff.productivityScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono text-ink-muted tabular-nums">
                      {formatDateShort(staff.lastActive)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
