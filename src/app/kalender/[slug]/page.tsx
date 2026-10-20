import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Ticket,
  UserCheck,
  CheckCircle2,
  ExternalLink,
  Share2,
  ArrowLeft,
  CalendarPlus,
  AlertCircle,
  Building2,
} from "lucide-react";
import { getEventBySlug, getUpcomingEvents } from "@/modules/events/queries";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatDateShort } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import { sanitizeUrl } from "@/lib/sanitize";

interface EventDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: "Acara Tidak Ditemukan" };
  }

  return {
    title: `${event.title} — Agenda & Kalender Acara ${SITE_CONFIG.name}`,
    description: `${event.description} Tanggal: ${formatDate(event.eventDate)}. Lokasi: ${event.location}. Diselenggarakan oleh ${event.organizer}.`,
  };
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const upcomingOther = (await getUpcomingEvents())
    .filter((e) => e.slug !== event.slug)
    .slice(0, 3);

  const eventDateObj = new Date(event.eventDate);
  const isFree = event.priceType === "FREE";

  // Schema.org Structured Data for Event
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    startDate: eventDateObj.toISOString(),
    endDate: event.eventEnd ? new Date(event.eventEnd).toISOString() : undefined,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Tasikmalaya",
        addressRegion: "Jawa Barat",
        addressCountry: "ID",
      },
    },
    organizer: {
      "@type": "Organization",
      name: event.organizer,
    },
    offers: {
      "@type": "Offer",
      price: isFree ? "0" : undefined,
      priceCurrency: "IDR",
      availability: "https://schema.org/InStock",
      url: event.registrationLink ? sanitizeUrl(event.registrationLink) : undefined,
    },
  };

  return (
    <div className="mx-auto max-w-page px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      {/* Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ─── Breadcrumb ─────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-ink-muted">
        <Link href="/" className="hover:text-primary transition-colors">
          Beranda
        </Link>
        <span>/</span>
        <Link href="/kalender" className="hover:text-primary transition-colors">
          Kalender Acara
        </Link>
        <span>/</span>
        <span className="font-semibold text-primary truncate max-w-xs">{event.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Event Content */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-line bg-surface p-6 sm:p-8 shadow-xs mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant={isFree ? "success" : "default"} size="md">
                {isFree ? "Gratis / Terbuka" : "Berbayar"}
              </Badge>

              {event.isVerified ? (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Agenda Terverifikasi Redaksi
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Belum Diverifikasi
                </span>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-ink">
              {event.title}
            </h1>

            <p className="mt-4 text-sm sm:text-base text-ink leading-relaxed">
              {event.description}
            </p>

            {/* Event Key Highlights Box */}
            <div className="mt-8 rounded-xl border border-line bg-surface-alt p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-3">
                <CalendarIcon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-ink font-semibold">Tanggal & Waktu:</strong>
                  <span className="text-ink-muted">{formatDate(event.eventDate)}</span>
                  {event.eventEnd && (
                    <span className="block text-ink-muted">s.d. {formatDate(event.eventEnd)}</span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-ink font-semibold">Lokasi Penyelenggaraan:</strong>
                  <span className="text-ink-muted">{event.location}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-ink font-semibold">Penyelenggara / Komunitas:</strong>
                  <span className="text-ink-muted">{event.organizer}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Ticket className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-ink font-semibold">Tiket & Pendaftaran:</strong>
                  <span className="text-ink-muted">{event.priceNote || (isFree ? "Bebas Biaya" : "Berbayar")}</span>
                </div>
              </div>
            </div>

            {/* Action Bar: ICS Export + Maps + Registration */}
            <div className="mt-8 flex flex-wrap gap-3 pt-6 border-t border-line">
              <a
                href={`/api/events/${event.id || event.slug}/ics`}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-hover transition-colors shadow-xs"
                download
              >
                <CalendarPlus className="h-4 w-4" /> Tambah ke Kalender (.ics)
              </a>

              {event.gmapsLink && (
                <a
                  href={sanitizeUrl(event.gmapsLink)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface-alt px-4 py-2.5 text-xs font-semibold text-ink hover:bg-surface-alt/80 transition-colors"
                >
                  <MapPin className="h-4 w-4 text-primary" /> Petunjuk Arah Google Maps <ExternalLink className="h-3 w-3" />
                </a>
              )}

              {event.registrationLink && (
                <a
                  href={sanitizeUrl(event.registrationLink)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary/10 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" /> Link Registrasi / Tiket
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar: Upcoming Other Events */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-line bg-surface p-5 shadow-xs">
            <h3 className="font-serif text-sm font-bold text-ink uppercase tracking-wider border-b border-line pb-3 mb-4">
              Agenda Mendatang Lainnya
            </h3>
            <div className="space-y-3">
              {upcomingOther.map((e) => (
                <Link
                  key={e.id}
                  href={`/kalender/${e.slug}`}
                  className="block p-3 rounded-lg border border-line hover:border-primary/50 hover:bg-surface-alt transition-colors group"
                >
                  <span className="text-[10px] font-semibold text-primary uppercase block">
                    {formatDateShort(e.eventDate)}
                  </span>
                  <h4 className="text-xs font-bold text-ink group-hover:text-primary transition-colors mt-0.5">
                    {e.title}
                  </h4>
                  <p className="text-[11px] text-ink-muted line-clamp-1 mt-1">
                    {e.location}
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-line">
              <Link
                href="/kalender"
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                Lihat Kalender Lengkap &rarr;
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
