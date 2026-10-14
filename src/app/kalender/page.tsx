"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar as CalendarIcon, MapPin, CheckCircle2, AlertCircle, ExternalLink, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { getUpcomingEvents, EventItem, FALLBACK_EVENTS } from "@/modules/events/queries";
import { formatDateShort } from "@/lib/utils";

export default function EventsCalendarPage() {
  const [filterPrice, setFilterPrice] = useState<"ALL" | "FREE" | "PAID">("ALL");
  const events = FALLBACK_EVENTS; // In client component, fallback data is immediate

  const filteredEvents = events.filter((evt) => {
    if (filterPrice === "FREE") return evt.priceType === "FREE";
    if (filterPrice === "PAID") return evt.priceType === "PAID";
    return true;
  });

  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* ─── Breadcrumb ─────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-ink-muted">
        <Link href="/" className="hover:text-primary">
          Beranda
        </Link>
        <span>/</span>
        <span className="font-medium text-ink">Kalender Acara</span>
      </nav>

      {/* ─── Header ─────────────────────────────────────────────────── */}
      <div className="mb-8 border-b border-line pb-6">
        <div className="flex items-center gap-2 text-primary">
          <CalendarIcon className="h-6 w-6" />
          <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Kalender Acara Tasikmalaya
          </h1>
        </div>
        <p className="mt-2 text-sm text-ink-muted max-w-xl">
          Agenda kegiatan warga, pameran kriya, ruang diskusi, dan pentas seni terverifikasi di wilayah Kota dan Kabupaten Tasikmalaya.
        </p>

        {/* ─── Filter Segmented Control ─────────────────────────────── */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-ink-muted mr-2">Filter Tiket:</span>
          <button
            type="button"
            onClick={() => setFilterPrice("ALL")}
            className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
              filterPrice === "ALL"
                ? "bg-primary text-white"
                : "border border-line bg-surface text-ink hover:bg-surface-alt"
            }`}
          >
            Semua ({events.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterPrice("FREE")}
            className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
              filterPrice === "FREE"
                ? "bg-primary text-white"
                : "border border-line bg-surface text-ink hover:bg-surface-alt"
            }`}
          >
            Gratis ({events.filter((e) => e.priceType === "FREE").length})
          </button>
          <button
            type="button"
            onClick={() => setFilterPrice("PAID")}
            className={`rounded px-3 py-1.5 text-xs font-semibold transition-colors ${
              filterPrice === "PAID"
                ? "bg-primary text-white"
                : "border border-line bg-surface text-ink hover:bg-surface-alt"
            }`}
          >
            Berbayar ({events.filter((e) => e.priceType === "PAID").length})
          </button>
        </div>
      </div>

      {/* ─── Events List ────────────────────────────────────────────── */}
      <div className="space-y-4">
        {filteredEvents.map((evt) => {
          const dateObj = new Date(evt.eventDate);
          const dayNumber = dateObj.getDate();
          const monthName = dateObj.toLocaleString("id-ID", { month: "short" });
          const isFree = evt.priceType === "FREE";

          return (
            <article
              key={evt.id}
              className="group flex flex-col sm:flex-row items-start gap-5 rounded border border-line bg-surface p-5 transition-all hover:border-ink-muted/50"
            >
              {/* Date Block Left */}
              <div className="flex sm:flex-col items-center justify-center shrink-0 w-full sm:w-20 rounded bg-primary-tint/60 border border-primary/20 py-2 sm:py-3 px-3 text-center">
                <span className="font-mono text-2xl sm:text-3xl font-extrabold text-primary tabular-nums">
                  {dayNumber}
                </span>
                <span className="ml-2 sm:ml-0 text-xs font-bold uppercase tracking-wider text-primary">
                  {monthName}
                </span>
              </div>

              {/* Event Content Middle */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge variant={isFree ? "default" : "outline"} size="sm">
                    {isFree ? "Gratis" : "Berbayar"}
                  </Badge>

                  {evt.isVerified ? (
                    <span className="inline-flex items-center gap-1 rounded bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success border border-success/30">
                      <CheckCircle2 className="h-3 w-3" /> Terverifikasi
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded bg-surface-alt px-2 py-0.5 text-[11px] font-medium text-ink-muted border border-line">
                      <AlertCircle className="h-3 w-3" /> Belum diverifikasi
                    </span>
                  )}

                  {evt.priceNote && (
                    <span className="text-xs text-ink-muted">· {evt.priceNote}</span>
                  )}
                </div>

                <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-ink group-hover:text-primary">
                  {evt.title}
                </h2>

                <p className="mt-1.5 text-xs sm:text-sm text-ink-muted leading-relaxed line-clamp-2">
                  {evt.description}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-ink-muted">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    <span>{evt.location}</span>
                  </span>
                  <span>·</span>
                  <span>Penyelenggara: {evt.organizer}</span>
                </div>
              </div>

              {/* Action Buttons Right */}
              <div className="flex sm:flex-col items-center gap-2 w-full sm:w-auto shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-line/60">
                {evt.gmapsLink && (
                  <a
                    href={evt.gmapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full sm:w-36 rounded border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink hover:bg-surface-alt transition-colors"
                  >
                    Buka di Maps <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {evt.registrationLink && (
                  <a
                    href={evt.registrationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full sm:w-36 rounded bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover transition-colors"
                  >
                    <Ticket className="h-3 w-3" /> Daftar / Tiket
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
