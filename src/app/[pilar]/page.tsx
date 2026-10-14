import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { HeartPulse, Flame, ShieldCheck, Phone, MapPin, Clock, ExternalLink } from "lucide-react";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Badge } from "@/components/ui/Badge";
import { getLatestArticles } from "@/modules/articles/queries";
import { getUtilities } from "@/modules/utilities/queries";
import { SLUG_TO_PILAR, PILAR_LABELS, UTILITY_LABELS, SITE_CONFIG } from "@/lib/constants";
import { formatPhone } from "@/lib/utils";

interface PageProps {
  params: Promise<{
    pilar: string;
  }>;
}

const PILAR_DESCRIPTIONS: Record<string, string> = {
  utility: "Panduan praktis, syarat layanan publik, nomor darurat, dan direktori berguna sehari-hari warga Tasikmalaya.",
  understand: "Penjelasan mendalam, data, analisis kebijakan publik, dan konteks di balik isu-isu penting Tasikmalaya.",
  opini: "Ruang gagasan kritis dan perspektif warga, akademisi, serta komunitas untuk kemajuan daerah.",
  discover: "Rekomendasi tempat tersembunyi, kuliner otentik, warisan budaya, dan sudut menarik di Tasikmalaya.",
  people: "Profil dan kisah sosok-sosok lokal yang menggerakkan, berkarya, dan menjaga tradisi di Tasikmalaya.",
  "catatan-lapangan": "Catatan reflektif, suasana kota, percakapan sehari-hari, dan denyut kehidupan warga di lapangan.",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pilar } = await params;
  const pilarEnum = SLUG_TO_PILAR[pilar];
  if (!pilarEnum) return { title: "Kategori Tidak Ditemukan" };

  const label = PILAR_LABELS[pilarEnum];
  return {
    title: `${label} — ${SITE_CONFIG.name}`,
    description: PILAR_DESCRIPTIONS[pilar] || SITE_CONFIG.description,
  };
}

export default async function PilarCategoryPage({ params }: PageProps) {
  const { pilar: pilarSlug } = await params;
  const pilarEnum = SLUG_TO_PILAR[pilarSlug];

  if (!pilarEnum) {
    notFound();
  }

  const pilarLabel = PILAR_LABELS[pilarEnum];
  const isUtility = pilarEnum === "UTILITY";
  const description = PILAR_DESCRIPTIONS[pilarSlug];

  const articles = await getLatestArticles({
    limit: 20,
    pilar: pilarEnum,
  });

  const utilities = isUtility ? await getUtilities() : [];

  return (
    <div className="mx-auto max-w-page px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      {/* ─── Breadcrumb ─────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-ink-muted">
        <Link href="/" className="hover:text-primary">
          Beranda
        </Link>
        <span>/</span>
        <span className="font-medium text-ink">{pilarLabel}</span>
      </nav>

      {/* ─── Category Header ────────────────────────────────────────── */}
      <div className="mb-10 border-b border-line pb-6">
        <div className="mb-3">
          <Badge variant={isUtility ? "utility" : "default"} size="md">
            Pilar {pilarLabel}
          </Badge>
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {pilarLabel}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-base text-ink-muted">
            {description}
          </p>
        )}
      </div>

      {/* ─── Emergency Call section if Utility Hub ───────────────────── */}
      {isUtility && (
        <>
          <section className="mb-12 rounded border border-line bg-surface p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-danger animate-pulse"></span>
              <h2 className="font-serif text-lg font-bold text-ink sm:text-xl">
                Kontak Darurat Tasikmalaya (Click-to-Call)
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <a
                href="tel:+62265331411"
                className="flex min-h-[56px] items-center justify-between rounded bg-danger px-4 py-3 text-white transition-opacity hover:opacity-95"
              >
                <div className="flex items-center gap-3">
                  <HeartPulse className="h-5 w-5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold leading-tight">IGD RSUD dr. Soekardjo</p>
                    <p className="font-mono text-xs opacity-90 tabular-nums">(0265) 331-411</p>
                  </div>
                </div>
                <span className="rounded bg-white/20 px-2 py-1 text-[11px] font-semibold uppercase">
                  Telepon
                </span>
              </a>

              <a
                href="tel:+62265313113"
                className="flex min-h-[56px] items-center justify-between rounded border border-line bg-surface-alt px-4 py-3 text-ink transition-colors hover:bg-line/40"
              >
                <div className="flex items-center gap-3">
                  <Flame className="h-5 w-5 shrink-0 text-accent" />
                  <div>
                    <p className="text-xs font-bold leading-tight">Damkar Kota Tasik</p>
                    <p className="font-mono text-xs text-ink-muted tabular-nums">(0265) 313-113</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                  <Phone className="h-3.5 w-3.5" /> Panggil
                </span>
              </a>

              <a
                href="tel:+62265321113"
                className="flex min-h-[56px] items-center justify-between rounded border border-line bg-surface-alt px-4 py-3 text-ink transition-colors hover:bg-line/40"
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-xs font-bold leading-tight">BPBD Kebencanaan</p>
                    <p className="font-mono text-xs text-ink-muted tabular-nums">(0265) 321-113</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                  <Phone className="h-3.5 w-3.5" /> Panggil
                </span>
              </a>
            </div>
          </section>

          {/* ─── Public Services Directory ────────────────────────────── */}
          <section className="mb-14">
            <div className="mb-6 flex items-baseline justify-between border-b border-line pb-3">
              <div>
                <h2 className="font-serif text-2xl font-bold tracking-tight text-ink">
                  Direktori Layanan Warga
                </h2>
                <p className="mt-1 text-xs text-ink-muted">
                  Nomor telepon resmi, jam buka, dan lokasi instansi pelayanan publik
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {utilities.map((item) => {
                const categoryLabel = UTILITY_LABELS[item.category] || item.category;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between rounded border border-line bg-surface p-5 transition-all hover:border-ink-muted/50"
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

                      <h3 className="font-serif text-lg font-bold text-ink">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-xs text-ink-muted leading-relaxed">
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

                    <div className="mt-5 flex items-center gap-2 border-t border-line/60 pt-4">
                      {item.contactNumber && (
                        <a
                          href={`tel:${item.contactNumber}`}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded bg-primary px-3 py-2 text-xs font-semibold text-white hover:bg-primary-hover transition-colors"
                        >
                          <Phone className="h-3 w-3" /> Telepon
                        </a>
                      )}
                      {item.gmapsLink && (
                        <a
                          href={item.gmapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink hover:bg-surface-alt transition-colors"
                        >
                          <MapPin className="h-3 w-3" /> Maps
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {/* ─── Article Listing Grid ───────────────────────────────────── */}
      <div className="mb-6 flex items-baseline justify-between border-b border-line pb-3">
        <h2 className="font-serif text-2xl font-bold tracking-tight text-ink">
          {isUtility ? "Panduan & Catatan Terkait" : `Artikel ${pilarLabel}`}
        </h2>
      </div>

      {articles.length === 0 ? (
        <div className="rounded border border-dashed border-line p-12 text-center text-ink-muted">
          Belum ada artikel yang diterbitkan dalam kategori ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, idx) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="standard"
              priority={idx < 3}
            />
          ))}
        </div>
      )}
    </div>
  );
}
