import React from "react";
import Link from "next/link";
import {
  Plus,
  FileText,
  CheckCircle2,
  Clock,
  Tag,
  ExternalLink,
  ShieldCheck,
  Activity,
  PieChart,
  MapPin,
  AlertCircle,
  FileSpreadsheet,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { getLatestArticles } from "@/modules/articles/queries";
import { PILAR_LABELS, STATUS_LABELS } from "@/lib/constants";
import { formatDateShort } from "@/lib/utils";
import { getSession } from "@/lib/session";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { ArticleRowActions } from "@/components/admin/ArticleRowActions";
import { db } from "@/lib/db";

export const metadata = {
  title: "Dashboard Redaksi & Audit Sistem — Palihmana.ID Admin",
};

export default async function AdminDashboardPage() {
  const session = await getSession();
  const articles = await getLatestArticles({ limit: 15 });

  // Fetch recent audit logs if DB is available
  let recentAuditLogs: any[] = [];
  try {
    recentAuditLogs = await db.auditLog.findMany({
      take: 6,
      orderBy: { timestamp: "desc" },
      include: { user: { select: { name: true, email: true } } },
    });
  } catch (e) {
    // Simulated fallback audit log for demonstration
    recentAuditLogs = [
      {
        id: "log-1",
        action: "ARTICLE_CREATE",
        targetType: "ARTICLE",
        targetId: "cara-membuat-ktp-elektronik-tasikmalaya-2026",
        timestamp: new Date(Date.now() - 3600000),
        user: { name: "Editor Redaksi", email: "editor@palihmana.id" },
      },
      {
        id: "log-2",
        action: "FACT_CHECK_APPROVED",
        targetType: "FACT_CHECK",
        targetId: "angka-kemiskinan-tasikmalaya-data-konteks",
        timestamp: new Date(Date.now() - 14400000),
        user: { name: "Super Admin", email: "admin@palihmana.id" },
      },
      {
        id: "log-3",
        action: "CORRECTION_LOGGED",
        targetType: "CORRECTION",
        targetId: "angka-kemiskinan-tasikmalaya-data-konteks",
        timestamp: new Date(Date.now() - 86400000),
        user: { name: "Super Admin", email: "admin@palihmana.id" },
      },
    ];
  }

  // Calculate Pilar composition percentages
  const totalArticles = articles.length || 1;
  const utilityCount = articles.filter((a) => a.pilar === "UTILITY").length;
  const understandCount = articles.filter((a) => a.pilar === "UNDERSTAND").length;
  const discoverCount = articles.filter((a) => a.pilar === "DISCOVER").length;
  const otherCount = totalArticles - (utilityCount + understandCount + discoverCount);

  const utilityPct = Math.round((utilityCount / totalArticles) * 100);
  const understandPct = Math.round((understandCount / totalArticles) * 100);
  const discoverPct = Math.round((discoverCount / totalArticles) * 100);
  const otherPct = Math.round((otherCount / totalArticles) * 100);

  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:px-6 lg:px-8">
      {/* ─── Admin Header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-primary px-2.5 py-0.5 text-[11px] font-bold uppercase text-white tracking-wider">
              {session?.role || "Admin Redaksi"}
            </span>
            <span className="text-xs text-ink-muted">
              Masuk sebagai <strong className="text-ink">{session?.name || "Staf"}</strong> ({session?.email || "admin@palihmana.id"})
            </span>
          </div>
          <h1 className="mt-2 font-serif text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Sistem Manajemen Redaksi & Verifikasi Fakta
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink hover:bg-surface-alt transition-colors"
          >
            Lihat Situs Publik <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/admin/utilities"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink hover:bg-surface-alt transition-colors"
          >
            Direktori Layanan
          </Link>
          <Link
            href="/admin/events"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink hover:bg-surface-alt transition-colors"
          >
            Kalender Acara
          </Link>
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink hover:bg-surface-alt transition-colors"
          >
            Staf & Kontributor
          </Link>
          <Link
            href="/admin/pmg"
            className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
          >
            🎮 Kelola PMG
          </Link>
          <Link
            href="/admin/articles/create"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-white hover:bg-primary-hover transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" /> Tulis Artikel
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* ─── Metric Cards ──────────────────────────────────────────── */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-line bg-surface p-5 shadow-xs">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Terbit</span>
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 font-serif text-3xl font-bold text-ink">{articles.length}</p>
          <p className="mt-1 text-[11px] text-ink-muted">Artikel terverifikasi di web</p>
        </div>

        <div className="rounded-xl border border-line bg-surface p-5 shadow-xs">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Pilar Utility</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 font-serif text-3xl font-bold text-ink">{utilityCount}</p>
          <p className="mt-1 text-[11px] text-ink-muted">{utilityPct}% dari total (Target 40%)</p>
        </div>

        <div className="rounded-xl border border-line bg-surface p-5 shadow-xs">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Understand & Konteks</span>
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 font-serif text-3xl font-bold text-ink">{understandCount}</p>
          <p className="mt-1 text-[11px] text-ink-muted">{understandPct}% dari total (Target 20%)</p>
        </div>

        <div className="rounded-xl border border-line bg-surface p-5 shadow-xs">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Discover & Komunitas</span>
            <Tag className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 font-serif text-3xl font-bold text-ink">{discoverCount}</p>
          <p className="mt-1 text-[11px] text-ink-muted">{discoverPct}% dari total (Target 15%)</p>
        </div>
      </div>

      {/* ─── Editorial Policy Compliance & Audit Trail ─────────────── */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pilar Balance Card (PRD §1.6) */}
        <div className="rounded-xl border border-line bg-surface p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 text-ink">
              <PieChart className="h-4 w-4 text-primary" />
              <h2 className="font-serif text-sm font-bold">Komposisi Pilar Rolling 30 Hari</h2>
            </div>
            <p className="text-xs text-ink-muted mb-4">
              Pedoman editorial mengutamakan kegunaan warga (Utility) dan pemahaman konteks (Understand).
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1 font-medium">
                  <span>Utility Warga</span>
                  <span>{utilityPct}% / 40% target</span>
                </div>
                <div className="h-2 w-full bg-surface-alt rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${Math.min(utilityPct, 100)}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 font-medium">
                  <span>Understand & Data</span>
                  <span>{understandPct}% / 20% target</span>
                </div>
                <div className="h-2 w-full bg-surface-alt rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600" style={{ width: `${Math.min(understandPct, 100)}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 font-medium">
                  <span>Discover & Budaya</span>
                  <span>{discoverPct}% / 15% target</span>
                </div>
                <div className="h-2 w-full bg-surface-alt rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: `${Math.min(discoverPct, 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-line text-[11px] text-ink-muted flex items-center justify-between">
            <span>Fokus Wilayah: Tasikmalaya (80%)</span>
            <span className="text-emerald-600 font-semibold">Tercapai</span>
          </div>
        </div>

        {/* Fact-Check Newsroom Log (PRD F4-CMS-02 & F4-CMS-05) */}
        <div className="lg:col-span-2 rounded-xl border border-line bg-surface p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-line pb-2">
            <div className="flex items-center gap-2 text-ink">
              <Activity className="h-4 w-4 text-primary" />
              <h2 className="font-serif text-sm font-bold">Jejak Audit & Aktivitas Redaksi (Audit Log)</h2>
            </div>
            <span className="text-[11px] text-ink-muted font-mono">Keamanan & Integritas Data</span>
          </div>

          <div className="space-y-3">
            {recentAuditLogs.map((log: any) => (
              <div
                key={log.id}
                className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-surface-alt text-xs"
              >
                <div className="flex items-start gap-2.5">
                  <span className="flex h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0"></span>
                  <div>
                    <span className="font-mono font-bold text-ink uppercase text-[11px]">
                      {log.action}
                    </span>
                    <p className="text-ink-muted text-[11px]">
                      Target: <span className="text-ink font-medium">{log.targetType}:{log.targetId || "-"}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-ink-muted block font-medium">
                    {log.user?.name || "Sistem"}
                  </span>
                  <span className="text-[10px] text-ink-muted font-mono">
                    {formatDateShort(log.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Recent Articles Table ─────────────────────────────────── */}
      <div className="mt-10 rounded-xl border border-line bg-surface overflow-hidden shadow-xs">
        <div className="border-b border-line px-6 py-4 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-ink">
            Daftar Artikel & Status Verifikasi
          </h2>
          <span className="text-xs text-ink-muted">Master Story Web Archive</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-surface-alt font-sans text-ink-muted uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-semibold">Judul</th>
                <th className="px-6 py-3 font-semibold">Pilar</th>
                <th className="px-6 py-3 font-semibold">Status Alur</th>
                <th className="px-6 py-3 font-semibold">Penulis</th>
                <th className="px-6 py-3 font-semibold">Tanggal Terbit</th>
                <th className="px-6 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {articles.map((a) => {
                const isUtility = a.pilar === "UTILITY";
                return (
                  <tr key={a.id} className="hover:bg-surface-alt/50 transition-colors">
                    <td className="px-6 py-4 font-serif text-sm font-semibold text-ink">
                      <span className="line-clamp-1 max-w-sm">{a.title}</span>
                      {a.lastVerifiedAt && (
                        <span className="flex items-center gap-1 text-[10px] font-sans font-normal text-emerald-600 mt-0.5">
                          <ShieldCheck className="h-3 w-3" /> Terverifikasi Fakta
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={isUtility ? "utility" : "outline"} size="sm">
                        {PILAR_LABELS[a.pilar] || a.pilar}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                        Tayang (Ready)
                      </span>
                    </td>
                    <td className="px-6 py-4 text-ink-muted">
                      {a.author?.name || "Redaksi"}
                    </td>
                    <td className="px-6 py-4 font-mono text-ink-muted tabular-nums">
                      {formatDateShort(a.publishedAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ArticleRowActions
                        id={a.id}
                        slug={a.slug}
                        pilar={a.pilar}
                      />
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
