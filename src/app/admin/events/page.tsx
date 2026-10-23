import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, ExternalLink, CheckCircle2, Ticket, MapPin } from "lucide-react";
import { getUpcomingEvents } from "@/modules/events/queries";
import { formatDateShort } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { getSession } from "@/lib/session";
import { EventsManager } from "@/components/admin/EventsManager";

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

      {/* Events Manager Component */}
      <EventsManager initialEvents={events} />
    </div>
  );
}
