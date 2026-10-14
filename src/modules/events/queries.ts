import { db } from "@/lib/db";
import { PriceType, EventStatus } from "@prisma/client";

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  eventDate: Date | string;
  eventEnd?: Date | string | null;
  location: string;
  gmapsLink?: string | null;
  organizer: string;
  priceType: PriceType;
  priceNote?: string | null;
  isVerified: boolean;
  verifiedAt?: Date | string | null;
  registrationLink?: string | null;
  status: EventStatus;
}

export const FALLBACK_EVENTS: EventItem[] = [
  {
    id: "evt-1",
    title: "Pameran Bordir & Tenun Tasikmalaya 2026",
    slug: "pameran-bordir-tenun-tasikmalaya-2026",
    description: "Eksibisi karya maestro bordir Kawalu dan perajin tenun Taraju. Menampilkan demonstrasi sulaman langsung dan pasar kriya lokal.",
    eventDate: new Date(Date.now() + 86400000 * 3), // 3 days from now
    eventEnd: new Date(Date.now() + 86400000 * 5),
    location: "Gedung Kesenian Kota Tasikmalaya, Kompleks Dadaha",
    gmapsLink: "https://maps.google.com/?q=Gedung+Kesenian+Tasikmalaya",
    organizer: "Dekranasda & Komunitas Kriya Tasik",
    priceType: "FREE" as PriceType,
    priceNote: "Gratis untuk umum",
    isVerified: true,
    verifiedAt: new Date(),
    registrationLink: null,
    status: "SCHEDULED" as EventStatus,
  },
  {
    id: "evt-2",
    title: "Pasar Buku & Diskusi Gagasan Warga",
    slug: "pasar-buku-diskusi-gagasan-warga",
    description: "Lapak buku alternatif, tukar bacaan, dan diskusi publik mengenai ruang terbuka hijau serta tata kota Tasikmalaya masa depan.",
    eventDate: new Date(Date.now() + 86400000 * 7), // 7 days from now
    eventEnd: null,
    location: "Pelataran Perpustakaan Daerah Kota Tasikmalaya",
    gmapsLink: "https://maps.google.com/?q=Perpustakaan+Daerah+Kota+Tasikmalaya",
    organizer: "Kolektif Literasi Priangan",
    priceType: "FREE" as PriceType,
    priceNote: "Terbuka untuk umum",
    isVerified: true,
    verifiedAt: new Date(),
    registrationLink: null,
    status: "SCHEDULED" as EventStatus,
  },
  {
    id: "evt-3",
    title: "Workshop Seduh Manual & Sensori Kopi Lokal",
    slug: "workshop-seduh-manual-sensori-kopi-lokal",
    description: "Pelatihan teknik seduh V60, tubruk presisi, dan pengenalan karakter biji kopi Gunung Galunggung bersama barista lokal.",
    eventDate: new Date(Date.now() + 86400000 * 12), // 12 days from now
    eventEnd: null,
    location: "Ruang Komunitas Rumah Kopi, Cihideung, Tasikmalaya",
    gmapsLink: "https://maps.google.com/?q=Cihideung+Tasikmalaya",
    organizer: "Asosiasi Barista Tasikmalaya",
    priceType: "PAID" as PriceType,
    priceNote: "Rp 50.000 (termasuk modul & cupping)",
    isVerified: true,
    verifiedAt: new Date(),
    registrationLink: "https://wa.me/628122200000",
    status: "SCHEDULED" as EventStatus,
  },
  {
    id: "evt-4",
    title: "Pentas Musik Akustik & Tari Tradisi Payung Geulis",
    slug: "pentas-musik-akustik-tari-tradisi-payung-geulis",
    description: "Penampilan seniman muda membawakan aransemen gamelan kontemporer diiringi tarian khas payung geulis di bawah pohon beringin.",
    eventDate: new Date(Date.now() + 86400000 * 18),
    eventEnd: null,
    location: "Taman Kota Alun-Alun Tasikmalaya",
    gmapsLink: "https://maps.google.com/?q=Alun-alun+Kota+Tasikmalaya",
    organizer: "Dinas Kepemudaan, Olahraga, Kebudayaan dan Pariwisata",
    priceType: "FREE" as PriceType,
    priceNote: "Gratis",
    isVerified: false,
    verifiedAt: null,
    registrationLink: null,
    status: "SCHEDULED" as EventStatus,
  },
];

export async function getUpcomingEvents(): Promise<EventItem[]> {
  try {
    const events = await db.event.findMany({
      where: {
        eventDate: { gte: new Date(Date.now() - 86400000) },
        status: { in: [EventStatus.SCHEDULED, EventStatus.POSTPONED] },
      },
      orderBy: { eventDate: "asc" },
    });

    if (events && events.length > 0) return events as unknown as EventItem[];
  } catch (e) {
    // Database fallback
  }

  return FALLBACK_EVENTS;
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  try {
    const event = await db.event.findUnique({
      where: { slug },
    });

    if (event) return event as unknown as EventItem;
  } catch (e) {
    // Database fallback
  }

  return FALLBACK_EVENTS.find((e) => e.slug === slug) || null;
}
