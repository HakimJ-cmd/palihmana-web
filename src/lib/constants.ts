import { Pilar, GeoScope, ArticleStatus, UtilityCategory, PriceType, EventStatus } from "@prisma/client";

// ─── Pilar labels ───────────────────────────────────────────────
export const PILAR_LABELS: Record<Pilar, string> = {
  UTILITY: "Utility",
  UNDERSTAND: "Understand",
  OPINION: "Opini",
  DISCOVER: "Discover",
  PEOPLE: "People",
  FIELD_NOTES: "Catatan Lapangan",
};

export const PILAR_SLUGS: Record<Pilar, string> = {
  UTILITY: "utility",
  UNDERSTAND: "understand",
  OPINION: "opini",
  DISCOVER: "discover",
  PEOPLE: "people",
  FIELD_NOTES: "catatan-lapangan",
};

export const SLUG_TO_PILAR: Record<string, Pilar> = {
  utility: Pilar.UTILITY,
  understand: Pilar.UNDERSTAND,
  opini: Pilar.OPINION,
  discover: Pilar.DISCOVER,
  people: Pilar.PEOPLE,
  "catatan-lapangan": Pilar.FIELD_NOTES,
};

// ─── GeoScope labels ────────────────────────────────────────────
export const GEO_LABELS: Record<GeoScope, string> = {
  LOCAL: "Tasikmalaya",
  REGIONAL: "Jawa Barat",
  NATIONAL: "Nasional",
};

// ─── ArticleStatus labels ───────────────────────────────────────
export const STATUS_LABELS: Record<ArticleStatus, string> = {
  DRAFT: "Draft",
  PRODUCTION: "Produksi",
  FACT_CHECK: "Fact Check",
  SCHEDULED: "Terjadwal",
  PUBLISHED: "Tayang",
  ARCHIVED: "Arsip",
};

// ─── Utility Category labels ────────────────────────────────────
export const UTILITY_LABELS: Record<UtilityCategory, string> = {
  EMERGENCY: "Darurat",
  TRANSPORT: "Transportasi",
  DOCUMENT: "Dokumen",
  HEALTH: "Kesehatan",
  UMKM: "UMKM",
};

// ─── Price Type labels ──────────────────────────────────────────
export const PRICE_LABELS: Record<PriceType, string> = {
  FREE: "Gratis",
  PAID: "Berbayar",
};

// ─── Event Status labels ────────────────────────────────────────
export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  SCHEDULED: "Akan Datang",
  CANCELLED: "Dibatalkan",
  POSTPONED: "Ditunda",
  FINISHED: "Selesai",
};

// ─── Site config ────────────────────────────────────────────────
export const SITE_CONFIG = {
  name: "Palihmana.id",
  tagline: "Media digital lokal Tasikmalaya",
  description: "Media digital lokal Tasikmalaya yang utility, explanatory, dan community-oriented. Informasi yang berguna, dapat dipercaya, dan mudah dipahami.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://palihmana.id",
  locale: "id-ID",
  timezone: "Asia/Jakarta",
  socials: {
    instagram: "https://instagram.com/palihmana.id",
    tiktok: "https://tiktok.com/@palihmana.id",
    facebook: "https://facebook.com/palihmana.id",
  },
};
