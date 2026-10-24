import { Pilar, GeoScope, ArticleStatus, UtilityCategory, PriceType, EventStatus } from "@prisma/client";

// ─── Pilar labels ───────────────────────────────────────────────
export const PILAR_LABELS: Record<Pilar, string> = {
  UTILITY: "Utility & Panduan Warga",
  UNDERSTAND: "Understand & Analisis Data",
  OPINION: "Kolom Opini & Wacana",
  DISCOVER: "Budaya & Kuliner (Discover)",
  PEOPLE: "Sosok & Tokoh (People)",
  FIELD_NOTES: "Catatan Lapangan & Sketsa",
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

// ─── PMG (Palihmana Gaming, Toys & Pop Culture) ───────────────
export type PmgCategory = "GAME_REVIEW" | "TOYS_HOBBY" | "ESPORTS_EVENT" | "GEAR_TECH" | "COMMUNITY";

export const PMG_CATEGORY_LABELS: Record<PmgCategory, string> = {
  GAME_REVIEW: "Game Review & Tips",
  TOYS_HOBBY: "Mainan & Koleksi (Toys)",
  ESPORTS_EVENT: "Esports & Turnamen",
  GEAR_TECH: "Gaming Gear & Setup",
  COMMUNITY: "Komunitas & Mabar",
};

// ─── Site config ────────────────────────────────────────────────
export const SITE_CONFIG = {
  name: "Palihmana.id",
  tagline: "Media digital lokal Tasikmalaya",
  description: "Media digital lokal Tasikmalaya yang utility, explanatory, dan community-oriented. Informasi yang berguna, dapat dipercaya, dan mudah dipahami.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://palihmana.id",
  locale: "id-ID",
  timezone: "Asia/Jakarta",
  contact: {
    email: "Palihmanaid@gmail.com",
    phone: "(0265) 752-1980 / +62 812-2234-5678",
    address: "Jl. Mayor S.L. Tobing No. 45, Cihideung, Kota Tasikmalaya, Jawa Barat 46122",
  },
  socials: {
    instagram: "https://www.instagram.com/palihmana.id/",
    tiktok: "https://www.tiktok.com/@palihmana.id",
    facebook: "https://facebook.com/palihmana.id",
    pmgInstagram: "https://www.instagram.com/pmg.id/",
  },
};
