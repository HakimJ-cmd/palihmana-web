import React from "react";
import Link from "next/link";
import { Phone, ArrowRight, ShieldCheck, Flame, HeartPulse } from "lucide-react";
import { ArticleCard } from "@/components/article/ArticleCard";
import { getFeaturedArticle, getLatestArticles } from "@/modules/articles/queries";

export const revalidate = 60; // ISR cache 60 seconds

export default async function HomePage() {
  const featured = await getFeaturedArticle();
  const latestArticles = await getLatestArticles({
    limit: 6,
    excludeSlug: featured?.slug,
  });

  return (
    <div className="mx-auto max-w-page px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* ─── Top Trust Banner ────────────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4 text-xs text-ink-muted">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-success"></span>
          <span className="font-medium text-ink">Edisi Tasikmalaya</span>
          <span>·</span>
          <span>Informasi lokal terverifikasi & bebas sensasi</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/pedoman-editorial" className="hover:text-primary">
            Standar Verifikasi
          </Link>
          <Link href="/kebijakan-koreksi" className="hover:text-primary">
            Koreksi Terbuka
          </Link>
        </div>
      </div>

      {/* ─── Hero Section ────────────────────────────────────────────── */}
      <section className="mb-12">
        {featured && (
          <ArticleCard article={featured} variant="hero" priority={true} />
        )}
      </section>

      {/* ─── Emergency & Quick Utility Widget ────────────────────────── */}
      <section className="mb-14 rounded border border-line bg-surface p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-line/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-danger animate-pulse"></span>
              <h2 className="font-serif text-lg font-bold text-ink sm:text-xl">
                Kontak Cepat & Layanan Darurat Tasikmalaya
              </h2>
            </div>
            <p className="mt-1 text-xs text-ink-muted">
              Nomor resmi terverifikasi untuk kebutuhan mendesak warga kota dan kabupaten
            </p>
          </div>
          <Link
            href="/utility"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover"
          >
            Lihat Semua Panduan <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Emergency 1 */}
          <a
            href="tel:+62265331411"
            className="flex min-h-[56px] items-center justify-between rounded bg-danger px-4 py-3 text-white transition-opacity hover:opacity-95 focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="Telepon IGD RSUD dr. Soekardjo"
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

          {/* Emergency 2 */}
          <a
            href="tel:+62265313113"
            className="flex min-h-[56px] items-center justify-between rounded border border-line bg-surface-alt px-4 py-3 text-ink transition-colors hover:bg-line/40 focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="Telepon Damkar Kota Tasikmalaya"
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

          {/* Emergency 3 */}
          <a
            href="tel:+62265321113"
            className="flex min-h-[56px] items-center justify-between rounded border border-line bg-surface-alt px-4 py-3 text-ink transition-colors hover:bg-line/40 focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="Telepon BPBD Tasikmalaya"
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

      {/* ─── Latest News Section ─────────────────────────────────────── */}
      <section className="mb-16">
        <div className="mb-6 flex items-baseline justify-between border-b border-line pb-3">
          <div>
            <h2 className="font-serif text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Kabar & Catatan Terkini
            </h2>
            <p className="mt-1 text-xs text-ink-muted sm:text-sm">
              Laporan mendalam, panduan, dan peristiwa penting di Tasikmalaya
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestArticles.map((article, idx) => (
            <ArticleCard
              key={article.id}
              article={article}
              variant="standard"
              priority={idx < 3}
            />
          ))}
        </div>
      </section>

      {/* ─── Explanatory & Utility Double-Column Section ─────────────── */}
      <section className="mb-16 border-t border-line pt-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Kolom Kiri: Understand & Opini */}
          <div className="lg:col-span-7">
            <div className="mb-5 flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-serif text-xl font-bold text-ink">
                Understand · Memahami Isu
              </h3>
              <Link href="/understand" className="text-xs font-semibold text-primary hover:text-primary-hover">
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-2">
              {latestArticles
                .filter((a) => a.pilar === "UNDERSTAND" || a.pilar === "OPINION")
                .map((a) => (
                  <ArticleCard key={a.id} article={a} variant="compact" />
                ))}
            </div>
          </div>

          {/* Kolom Kanan: Discover & People */}
          <div className="lg:col-span-5">
            <div className="mb-5 flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-serif text-xl font-bold text-ink">
                Discover & Warga
              </h3>
              <Link href="/discover" className="text-xs font-semibold text-primary hover:text-primary-hover">
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-2">
              {latestArticles
                .filter((a) => a.pilar === "DISCOVER" || a.pilar === "PEOPLE" || a.pilar === "FIELD_NOTES")
                .map((a) => (
                  <ArticleCard key={a.id} article={a} variant="compact" />
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Mission Callout / Editorial Statement ──────────────────── */}
      <section className="rounded border border-line bg-surface-alt p-6 sm:p-10">
        <div className="mx-auto max-w-read text-center">
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-primary">
            Komitmen Kami
          </span>
          <h3 className="mt-2 font-serif text-xl font-bold text-ink sm:text-2xl">
            Jurnalisme yang Berguna untuk Kehidupan Sehari-hari Warga
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Palihmana.id tidak mengejar klik sensasional atau gosip tak berdasar. Kami hadir untuk menjawab pertanyaan praktis: bagaimana mengurus izin usaha di Tasik, memahami alokasi APBD, menikmati ruang kota, dan mendengarkan suara sesama warga.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
            <Link
              href="/pedoman-editorial"
              className="rounded bg-primary px-4 py-2 text-white hover:bg-primary-hover transition-colors"
            >
              Baca Pedoman Redaksi
            </Link>
            <Link
              href="/tentang"
              className="rounded border border-line bg-surface px-4 py-2 text-ink hover:bg-surface-alt transition-colors"
            >
              Tentang Palihmana.id
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
