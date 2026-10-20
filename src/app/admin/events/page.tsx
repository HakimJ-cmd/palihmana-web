import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, ExternalLink, CheckCircle2, Ticket, MapPin } from "lucide-react";
import { getUpcomingEvents } from "@/modules/events/queries";
import { formatDateShort } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Kelola Agenda Acara & Kalender — Admin Palihmana",
};

export default async function AdminEventsPage() {
  const session = await getSession();
  const events = await getUpcomingEvents();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ─── Breadcrumb ─────────────────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
        </Link>
        <span className="text-xs text-ink-muted">
          Total Agenda: <strong className="text-ink">{events.length}</strong>
        </span>
      </div>

      <div className="mb-8 border-b border-line pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Kelola Agenda & Kalender Acara
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-ink-muted">
            Kurasi dan validasi kegiatan budaya, festival UMKM, pameran kriya, dan simposium warga Tasikmalaya.
          </p>
        </div>

        <Link
          href="/kalender"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink hover:bg-surface-alt transition-colors self-start sm:self-auto"
        >
          Lihat Kalender Publik <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Events Table */}
      <div className="rounded-xl border border-line bg-surface overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-surface-alt font-sans text-ink-muted uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-semibold">Nama Acara</th>
                <th className="px-6 py-3 font-semibold">Tanggal</th>
                <th className="px-6 py-3 font-semibold">Lokasi</th>
                <th className="px-6 py-3 font-semibold">Penyelenggara</th>
                <th className="px-6 py-3 font-semibold">Status Tiket</th>
                <th className="px-6 py-3 font-semibold">Verifikasi</th>
                <th className="px-6 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {events.map((e) => {
                const isFree = e.priceType === "FREE";

                return (
                  <tr key={e.id} className="hover:bg-surface-alt/50 transition-colors">
                    <td className="px-6 py-4 font-serif text-sm font-semibold text-ink">
                      <span className="line-clamp-1 max-w-sm">{e.title}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-ink tabular-nums">
                      {formatDateShort(e.eventDate)}
                    </td>
                    <td className="px-6 py-4 text-ink-muted max-w-xs truncate">
                      {e.location}
                    </td>
                    <td className="px-6 py-4 text-ink">
                      {e.organizer}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={isFree ? "success" : "default"} size="sm">
                        {isFree ? "Gratis" : "Berbayar"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {e.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Terverifikasi
                        </span>
                      ) : (
                        <span className="text-[11px] text-amber-600 font-medium">
                          Belum Cek
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/kalender/${e.slug}`}
                        target="_blank"
                        className="font-bold text-primary hover:text-primary-hover hover:underline"
                      >
                        Lihat Detail
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
