import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  HeartPulse,
  Flame,
  ShieldCheck,
  Phone,
  MapPin,
  Clock,
  ExternalLink,
  Search,
  FileText,
  Car,
  Briefcase,
  AlertTriangle,
  Building2,
  Calendar,
} from "lucide-react";
import { getUtilities, UtilityItem } from "@/modules/utilities/queries";
import { getLatestArticles } from "@/modules/articles/queries";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Badge } from "@/components/ui/Badge";
import { UTILITY_LABELS, SITE_CONFIG } from "@/lib/constants";
import { UtilityCategory } from "@prisma/client";

export const metadata: Metadata = {
  title: `Pusat Layanan Warga & Panduan Publik — ${SITE_CONFIG.name}`,
  description: "Direktori resmi layanan publik, nomor darurat 24 jam, panduan dokumen KTP/KK/SIM, dan informasi transportasi Kota Tasikmalaya.",
};

export default async function LayananHubPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori } = await searchParams;
  const validCategory = kategori && Object.keys(UTILITY_LABELS).includes(kategori.toUpperCase())
    ? (kategori.toUpperCase() as UtilityCategory)
    : undefined;

  const utilities = await getUtilities(validCategory);
  const utilityArticles = await getLatestArticles({
    limit: 6,
    pilar: "UTILITY",
  });

  return (
    <div className="mx-auto max-w-page px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      {/* ─── Breadcrumb ─────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-ink-muted">
        <Link href="/" className="hover:text-primary">
          Beranda
        </Link>
        <span>/</span>
        <span className="font-medium text-ink">Pusat Layanan Warga</span>
      </nav>

      {/* ─── Hub Header ─────────────────────────────────────────────── */}
      <div className="mb-8 border-b border-line pb-6">
        <div className="mb-3 flex items-center gap-2">
          <Badge variant="utility" size="md">
            Pusat Utilitas & Panduan Resmi
          </Badge>
          <span className="text-xs text-ink-muted flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            Terverifikasi Redaksi
          </span>
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Direktori Layanan & Nomor Darurat Tasikmalaya
        </h1>
        <p className="mt-2 max-w-3xl text-sm sm:text-base text-ink-muted leading-relaxed">
          Semua kontak penting, jam buka kantor instansi, alur pembuatan dokumen kependudukan, dan rute transportasi terverifikasi untuk kemudahan hidup sehari-hari warga Tasikmalaya.
        </p>
      </div>

      {/* ─── Emergency Call section (F2-UTL-03: Click-to-call besar) ─── */}
      <section className="mb-10 rounded-xl border border-danger/30 bg-danger/5 dark:bg-danger/10 p-5 sm:p-6 shadow-xs">
        <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-danger animate-ping"></span>
            <h2 className="font-serif text-lg font-bold text-ink sm:text-xl">
              Kontak Darurat Kota Tasikmalaya (Click-to-Call 24 Jam)
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-danger uppercase tracking-wider bg-white dark:bg-[#0e1b2e] px-2.5 py-1 rounded border border-danger/20">
            Respons Cepat
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <a
            href="tel:+62265331411"
            className="flex min-h-[58px] items-center justify-between rounded-xl bg-danger px-4 py-3 text-white transition-opacity hover:opacity-90 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <HeartPulse className="h-6 w-6 shrink-0" />
              <div>
                <p className="text-xs font-bold leading-tight">IGD RSUD dr. Soekardjo</p>
                <p className="font-mono text-xs opacity-90 tabular-nums">(0265) 331-411</p>
              </div>
            </div>
            <span className="rounded-lg bg-white/20 px-2.5 py-1 text-[11px] font-bold uppercase">
              Telepon
            </span>
          </a>

          <a
            href="tel:+62265313113"
            className="flex min-h-[58px] items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 text-ink transition-colors hover:bg-surface-alt shadow-xs"
          >
            <div className="flex items-center gap-3">
              <Flame className="h-6 w-6 shrink-0 text-accent" />
              <div>
                <p className="text-xs font-bold leading-tight">Damkar Kota Tasik</p>
                <p className="font-mono text-xs text-ink-muted tabular-nums">(0265) 313-113</p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-primary">
              <Phone className="h-3.5 w-3.5" /> Panggil
            </span>
          </a>

          <a
            href="tel:+62265321113"
            className="flex min-h-[58px] items-center justify-between rounded-xl border border-line bg-surface px-4 py-3 text-ink transition-colors hover:bg-surface-alt shadow-xs"
          >
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6 shrink-0 text-primary" />
              <div>
                <p className="text-xs font-bold leading-tight">BPBD Penanggulangan Bencana</p>
                <p className="font-mono text-xs text-ink-muted tabular-nums">(0265) 321-113</p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-primary">
              <Phone className="h-3.5 w-3.5" /> Panggil
            </span>
          </a>
        </div>
      </section>

      {/* ─── Category Filter Pills (PRD F2-UTL-01) ────────────────────── */}
      <div className="mb-8 flex flex-wrap items-center gap-2 border-b border-line pb-4 text-xs font-semibold">
        <Link
          href="/layanan"
          className={`px-3.5 py-1.5 rounded-lg transition-colors ${
            !validCategory
              ? "bg-primary text-white"
              : "bg-surface text-ink-muted hover:bg-surface-alt"
          }`}
        >
          Semua Kategori
        </Link>
        {Object.entries(UTILITY_LABELS).map(([catKey, label]) => {
          const isActive = validCategory === catKey;
          return (
            <Link
              key={catKey}
              href={`/layanan?kategori=${catKey.toLowerCase()}`}
              className={`px-3.5 py-1.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "bg-surface text-ink-muted hover:bg-surface-alt"
              }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* ─── Public Services Grid ───────────────────────────────────── */}
      <section className="mb-14">
        <div className="mb-6 flex items-baseline justify-between border-b border-line pb-3">
          <div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-ink">
              Direktori Layanan & Kontak Resmi
            </h2>
            <p className="mt-1 text-xs text-ink-muted">
              Nomor resmi, jam buka pelayanan, dan titik Google Maps instansi
            </p>
          </div>
          <span className="text-xs font-medium text-ink-muted">
            Menampilkan {utilities.length} data layanan
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {utilities.map((item) => {
            const categoryLabel = UTILITY_LABELS[item.category] || item.category;
            return (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-xl border border-line bg-surface p-5 shadow-xs hover:border-primary/50 transition-all"
              >
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge variant="utility" size="sm">
                      {categoryLabel}
                    </Badge>
                    {item.lastVerifiedAt && (
                      <span className="text-[11px] text-ink-muted">
                        Dicek {new Date(item.lastVerifiedAt).toLocaleDateString("id-ID", { month: "short", day: "numeric" })}
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-lg font-bold text-ink mb-1.5">
                    {item.title}
                  </h3>

                  <p className="text-xs text-ink-muted leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  {item.address && (
                    <p className="mt-3 flex items-start gap-1.5 text-xs text-ink-muted">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" />
                      <span>{item.address}</span>
                    </p>
                  )}

                  {item.openingHours && (
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-ink-muted">
                      <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
                      <span>{item.openingHours}</span>
                    </p>
                  )}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-line/60 pt-3">
                  {item.contactNumber ? (
                    <a
                      href={`tel:${item.contactNumber}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-hover transition-colors shadow-xs"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      <span>Telepon</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-ink-muted italic">Tidak ada nomor darurat</span>
                  )}

                  {item.gmapsLink && (
                    <a
                      href={item.gmapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-ink-muted hover:text-primary transition-colors"
                    >
                      <span>Buka di Maps</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Related Utility Guides / Articles ──────────────────────── */}
      <section className="border-t border-line pt-10">
        <div className="mb-6 flex items-baseline justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-ink">
              Panduan Prosedur & Syarat Kependudukan
            </h2>
            <p className="mt-1 text-xs text-ink-muted">
              Langkah bernomor, berkas persyaratan, dan tips menghindari pungli
            </p>
          </div>
          <Link
            href="/utility"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Arsip Lengkap Utility →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {utilityArticles.map((article) => (
            <ArticleCard key={article.id} article={article} variant="standard" />
          ))}
        </div>
      </section>
    </div>
  );
}
