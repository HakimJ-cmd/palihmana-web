import React from "react";
import Link from "next/link";
import { Plus, FileText, CheckCircle2, Clock, Tag, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { getLatestArticles } from "@/modules/articles/queries";
import { PILAR_LABELS, STATUS_LABELS } from "@/lib/constants";
import { formatDateShort } from "@/lib/utils";
import { getSession } from "@/lib/session";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const metadata = {
  title: "Dashboard Redaksi — Palihmana.id Admin",
};

export default async function AdminDashboardPage() {
  const session = await getSession();
  const articles = await getLatestArticles({ limit: 10 });

  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:px-6 lg:px-8">
      {/* ─── Admin Header ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-primary px-2 py-0.5 text-[11px] font-bold uppercase text-white">
              {session?.role || "Admin Redaksi"}
            </span>
            <span className="text-xs text-ink-muted">
              Masuk sebagai <strong className="text-ink">{session?.name || "Staf"}</strong> ({session?.email || "admin@palihmana.id"})
            </span>
          </div>
          <h1 className="mt-2 font-serif text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Manajemen Konten & Redaksi
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink hover:bg-surface-alt transition-colors"
          >
            Lihat Situs Publik <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/admin/articles/create"
            className="inline-flex items-center gap-1.5 rounded bg-primary px-3.5 py-2 text-xs font-semibold text-white hover:bg-primary-hover transition-colors"
          >
            <Plus className="h-4 w-4" /> Tulis Artikel Baru
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* ─── Metric Cards ──────────────────────────────────────────── */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded border border-line bg-surface p-5">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-medium uppercase tracking-wider">Total Artikel</span>
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 font-serif text-3xl font-bold text-ink">{articles.length}</p>
          <p className="mt-1 text-[11px] text-ink-muted">Tayang & terverifikasi</p>
        </div>

        <div className="rounded border border-line bg-surface p-5">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-medium uppercase tracking-wider">Pilar Utility</span>
            <CheckCircle2 className="h-4 w-4 text-accent" />
          </div>
          <p className="mt-2 font-serif text-3xl font-bold text-ink">
            {articles.filter((a) => a.pilar === "UTILITY").length}
          </p>
          <p className="mt-1 text-[11px] text-ink-muted">Panduan & layanan warga</p>
        </div>

        <div className="rounded border border-line bg-surface p-5">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-medium uppercase tracking-wider">Understand & Konteks</span>
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 font-serif text-3xl font-bold text-ink">
            {articles.filter((a) => a.pilar === "UNDERSTAND").length}
          </p>
          <p className="mt-1 text-[11px] text-ink-muted">Eksplanatori data lokal</p>
        </div>

        <div className="rounded border border-line bg-surface p-5">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-xs font-medium uppercase tracking-wider">Discover & People</span>
            <Tag className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 font-serif text-3xl font-bold text-ink">
            {articles.filter((a) => ["DISCOVER", "PEOPLE", "FIELD_NOTES"].includes(a.pilar)).length}
          </p>
          <p className="mt-1 text-[11px] text-ink-muted">Kurasi & sosok lokal</p>
        </div>
      </div>

      {/* ─── Recent Articles Table ─────────────────────────────────── */}
      <div className="mt-10 rounded border border-line bg-surface overflow-hidden">
        <div className="border-b border-line px-6 py-4">
          <h2 className="font-serif text-lg font-bold text-ink">
            Daftar Artikel Terkini
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-surface-alt font-sans text-ink-muted uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-semibold">Judul</th>
                <th className="px-6 py-3 font-semibold">Pilar</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Penulis</th>
                <th className="px-6 py-3 font-semibold">Tanggal</th>
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
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={isUtility ? "utility" : "outline"} size="sm">
                        {PILAR_LABELS[a.pilar] || a.pilar}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">
                        Tayang
                      </span>
                    </td>
                    <td className="px-6 py-4 text-ink-muted">
                      {a.author?.name || "Redaksi"}
                    </td>
                    <td className="px-6 py-4 font-mono text-ink-muted tabular-nums">
                      {formatDateShort(a.publishedAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/${(a.pilar as string).toLowerCase().replace("_", "-")}/${a.slug}`}
                        target="_blank"
                        className="font-medium text-primary hover:text-primary-hover"
                      >
                        Pratinjau
                      </Link>
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
