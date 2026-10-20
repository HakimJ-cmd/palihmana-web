import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  Phone,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  HelpCircle,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { getUtilityBySlug, getUtilities } from "@/modules/utilities/queries";
import { getLatestArticles } from "@/modules/articles/queries";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Badge } from "@/components/ui/Badge";
import { UTILITY_LABELS, SITE_CONFIG } from "@/lib/constants";
import { formatDateShort } from "@/lib/utils";
import { sanitizeUrl } from "@/lib/sanitize";

interface UtilityDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: UtilityDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const utility = await getUtilityBySlug(slug);

  if (!utility) {
    return { title: "Layanan Tidak Ditemukan" };
  }

  return {
    title: `${utility.title} — Panduan Layanan Publik ${SITE_CONFIG.name}`,
    description: `${utility.description} Kontak, alamat, jam operasional, dan alur prosedur resmi di Kota Tasikmalaya.`,
  };
}

export default async function UtilityDetailPage({ params }: UtilityDetailPageProps) {
  const { slug } = await params;
  const utility = await getUtilityBySlug(slug);

  if (!utility) {
    notFound();
  }

  const categoryLabel = UTILITY_LABELS[utility.category] || utility.category;
  const otherUtilities = (await getUtilities(utility.category))
    .filter((u) => u.slug !== utility.slug)
    .slice(0, 3);

  const relatedArticles = await getLatestArticles({
    limit: 3,
    pilar: "UTILITY",
  });

  // Schema.org structured data (GovernmentService / LocalBusiness)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": utility.category === "EMERGENCY" ? "EmergencyService" : "GovernmentService",
    name: utility.title,
    description: utility.description,
    telephone: utility.contactNumber || undefined,
    address: utility.address
      ? {
          "@type": "PostalAddress",
          streetAddress: utility.address,
          addressLocality: "Tasikmalaya",
          addressRegion: "Jawa Barat",
          addressCountry: "ID",
        }
      : undefined,
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
        <Link href="/layanan" className="hover:text-primary transition-colors">
          Pusat Layanan Warga
        </Link>
        <span>/</span>
        <span className="font-semibold text-primary truncate max-w-xs">{utility.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Guide Content */}
        <div className="lg:col-span-2">
          {/* Header Card */}
          <div className="rounded-xl border border-line bg-surface p-6 sm:p-8 shadow-xs mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="utility" size="md">
                {categoryLabel}
              </Badge>
              {utility.lastVerifiedAt && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Diverifikasi Redaksi {formatDateShort(utility.lastVerifiedAt)}
                </span>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-ink">
              {utility.title}
            </h1>

            <p className="mt-3 text-sm sm:text-base text-ink-muted leading-relaxed">
              {utility.description}
            </p>

            {/* Quick Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3 pt-6 border-t border-line">
              {utility.contactNumber && (
                <a
                  href={`tel:${utility.contactNumber}`}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-hover transition-colors shadow-xs"
                >
                  <Phone className="h-4 w-4" /> Hubungi Sekarang ({utility.contactNumber})
                </a>
              )}

              {utility.gmapsLink && (
                <a
                  href={sanitizeUrl(utility.gmapsLink)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface-alt px-4 py-2.5 text-xs font-semibold text-ink hover:bg-surface-alt/80 transition-colors"
                >
                  <MapPin className="h-4 w-4 text-primary" /> Buka di Google Maps <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>

          {/* Operational Info Section */}
          <section className="rounded-xl border border-line bg-surface p-6 mb-8">
            <h2 className="font-serif text-lg font-bold text-ink mb-4 border-b border-line pb-2">
              Informasi Operasional & Lokasi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-alt">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-ink font-semibold">Jam Pelayanan:</strong>
                  <span className="text-ink-muted">{utility.openingHours || "Hubungi kantor terkait"}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-alt">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-ink font-semibold">Alamat Kantor:</strong>
                  <span className="text-ink-muted">{utility.address || "Kota Tasikmalaya"}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Procedural Step-by-Step Guide */}
          <section className="rounded-xl border border-line bg-surface p-6 mb-8">
            <h2 className="font-serif text-lg font-bold text-ink mb-4 border-b border-line pb-2 flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-primary" />
              Alur Prosedur & Syarat Resmi
            </h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  1
                </span>
                <div>
                  <h3 className="text-sm font-bold text-ink">Persiapan Dokumen Persyaratan</h3>
                  <p className="mt-1 text-xs text-ink-muted leading-relaxed">
                    Siapkan dokumen asli dan salinan fotokopi (Kartu Keluarga, KTP, dan surat pengantar kelurahan jika dipersyaratkan). Pastikan data kependudukan telah sinkron di database pusat.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  2
                </span>
                <div>
                  <h3 className="text-sm font-bold text-ink">Pengambilan Antrean & Verifikasi Berkas</h3>
                  <p className="mt-1 text-xs text-ink-muted leading-relaxed">
                    Datang lebih awal pada jam operasional kantor. Ambil tiket antrean di loket terpadu dan serahkan berkas ke petugas verifikasi meja satu.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  3
                </span>
                <div>
                  <h3 className="text-sm font-bold text-ink">Pemrosesan & Pengambilan Dokumen</h3>
                  <p className="mt-1 text-xs text-ink-muted leading-relaxed">
                    Petugas akan memproses permohonan. Lama proses berkisar 1 hari kerja hingga 14 hari tergantung ketersediaan blangko atau verifikasi teknis instansi terkait.
                  </p>
                </div>
              </div>
            </div>

            {/* Verification & Transparency Alert */}
            <div className="mt-6 rounded-lg bg-surface-alt p-4 border border-line text-xs flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="text-ink-muted">
                <strong className="text-ink">Bebas Pungutan Liar:</strong> Seluruh pelayanan dasar kependudukan di Kota Tasikmalaya tidak dipungut biaya retribusi (100% Gratis). Laporkan indikasi pungli melalui kanal aduan resmi pemerintah kota.
              </div>
            </div>
          </section>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-10">
              <h2 className="font-serif text-xl font-bold text-ink mb-4">
                Panduan Terkait dari Redaksi
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedArticles.slice(0, 2).map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Other Services in Category */}
          <div className="rounded-xl border border-line bg-surface p-5 shadow-xs">
            <h3 className="font-serif text-sm font-bold text-ink uppercase tracking-wider border-b border-line pb-3 mb-4">
              Layanan {categoryLabel} Lainnya
            </h3>
            <div className="space-y-3">
              {otherUtilities.map((u) => (
                <Link
                  key={u.id}
                  href={`/layanan/${u.slug}`}
                  className="block p-3 rounded-lg border border-line hover:border-primary/50 hover:bg-surface-alt transition-colors group"
                >
                  <h4 className="text-xs font-bold text-ink group-hover:text-primary transition-colors">
                    {u.title}
                  </h4>
                  <p className="text-[11px] text-ink-muted line-clamp-2 mt-1">
                    {u.description}
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-line">
              <Link
                href="/layanan"
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                Lihat Semua Direktori Layanan &rarr;
              </Link>
            </div>
          </div>

          {/* Redaksi Verification Commitment */}
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-xs text-ink-muted">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Standar Verifikasi Palihmana</span>
            </div>
            <p className="leading-relaxed">
              Nomor kontak dan prosedur diperbarui secara berkala oleh tim redaksi melalui konfirmasi langsung ke kantor pelayanan publik terkait. Jika menemukan data yang usang, hubungi redaksi untuk pembaruan instan.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
