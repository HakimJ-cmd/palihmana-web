import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { Clock, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { ArticleCard } from "@/components/article/ArticleCard";
import { BookmarkButton } from "@/components/article/BookmarkButton";
import { ArticleContent } from "@/components/article/ArticleContent";
import { getArticleBySlug, getLatestArticles } from "@/modules/articles/queries";
import { PILAR_LABELS, PILAR_SLUGS, SITE_CONFIG } from "@/lib/constants";
import { formatDate, formatFreshness } from "@/lib/utils";
import { Pilar } from "@prisma/client";

interface PageProps {
  params: Promise<{
    pilar: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Artikel Tidak Ditemukan" };
  }

  return {
    title: article.title,
    description: article.subtitle || SITE_CONFIG.description,
    openGraph: {
      title: `${article.title} — ${SITE_CONFIG.name}`,
      description: article.subtitle || SITE_CONFIG.description,
      type: "article",
      images: article.coverImage ? [{ url: article.coverImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.subtitle || SITE_CONFIG.description,
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { pilar: pilarParam, slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const pilarEnum = article.pilar as Pilar;
  const pilarSlug = PILAR_SLUGS[pilarEnum] || pilarParam;
  const pilarLabel = PILAR_LABELS[pilarEnum] || pilarParam;
  const isUtility = pilarEnum === "UTILITY";

  const readingTime = article.readingMinutes || 4;

  const freshness = formatFreshness(
    article.contentUpdatedAt ? new Date(article.contentUpdatedAt) : null,
    article.publishedAt ? new Date(article.publishedAt) : null,
    article.lastVerifiedAt ? new Date(article.lastVerifiedAt) : null
  );

  const relatedArticles = await getLatestArticles({
    limit: 3,
    pilar: pilarEnum,
    excludeSlug: article.slug,
  });

  return (
    <div className="mx-auto max-w-page px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      {/* ─── Breadcrumb ─────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-ink-muted">
        <Link href="/" className="hover:text-primary">
          Beranda
        </Link>
        <span>/</span>
        <Link href={`/${pilarSlug}`} className="hover:text-primary">
          {pilarLabel}
        </Link>
        <span>/</span>
        <span className="line-clamp-1 max-w-xs text-ink font-medium sm:max-w-md">
          {article.title}
        </span>
      </nav>

      {/* ─── Reader Container (Center-aligned 650px) ────────────────── */}
      <article className="mx-auto max-w-read">
        {/* Pilar Badge & Meta */}
        <div className="mb-3 flex items-center gap-2.5">
          <Link href={`/${pilarSlug}`}>
            <Badge variant={isUtility ? "utility" : "default"}>
              {pilarLabel}
            </Badge>
          </Link>
          <span className="text-xs text-ink-muted">·</span>
          <span className="flex items-center gap-1 text-xs text-ink-muted">
            <Clock className="h-3.5 w-3.5" /> {readingTime} menit baca
          </span>
        </div>

        {/* Headline (H1) */}
        <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-[42px] lg:leading-[1.18]">
          {article.title}
        </h1>

        {/* Subtitle */}
        {article.subtitle && (
          <p className="mt-3 text-lg leading-snug text-ink-muted sm:text-xl">
            {article.subtitle}
          </p>
        )}

        {/* Metadata Byline */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-line py-3 text-xs text-ink-muted">
          <div className="flex items-center gap-2">
            {article.author?.name && (
              <span className="font-semibold text-ink">{article.author.name}</span>
            )}
            {article.author?.name && <span>·</span>}
            <span>{formatDate(article.publishedAt)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded bg-surface-alt px-2 py-0.5 font-medium text-ink">
              {freshness}
            </span>
            <BookmarkButton article={article} size="sm" />
          </div>
        </div>

        {/* Correction Box (if any) */}
        {article.corrections && article.corrections.length > 0 && (
          <div className="my-6 rounded border-l-4 border-accent bg-accent-tint p-4 text-xs text-accent-ink">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
              <AlertCircle className="h-4 w-4" /> Catatan Koreksi
            </div>
            <p className="mt-1 leading-relaxed">
              {article.corrections[0].note || article.corrections[0].correction}
            </p>
          </div>
        )}

        {/* Summary Box (3-5 points) */}
        {article.summaryPoints && article.summaryPoints.length > 0 && (
          <div className="my-8 rounded border border-line bg-primary-tint/60 p-5 sm:p-6">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-primary">
              Poin Penting Ringkasan
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-ink">
              {article.summaryPoints.map((point: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-primary font-bold">✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Featured Cover Image */}
        {article.coverImage && (
          <figure className="my-8 overflow-hidden rounded border border-line bg-surface-alt">
            <div className="relative aspect-video w-full">
              <Image
                src={article.coverImage}
                alt={article.coverAlt || article.title}
                fill
                priority
                sizes="(max-width: 650px) 100vw, 650px"
                className="object-cover"
              />
            </div>
            {article.coverAlt && (
              <figcaption className="border-t border-line/60 bg-surface px-4 py-2 text-xs text-ink-muted">
                Foto: {article.coverAlt}
              </figcaption>
            )}
          </figure>
        )}

        {/* Article Body Content */}
        <ArticleContent contentJson={typeof article.bodyJson === "string" ? article.bodyJson : JSON.stringify(article.bodyJson)} />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center gap-2 border-t border-line pt-6">
            <span className="text-xs font-semibold uppercase text-ink-muted">Topik:</span>
            {article.tags.map((t: any, idx: number) => (
              <span
                key={idx}
                className="rounded border border-line bg-surface px-2.5 py-1 text-xs text-ink"
              >
                #{t.tag?.name || t.name}
              </span>
            ))}
          </div>
        )}

        {/* Share Section */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded border border-line bg-surface-alt p-4 text-xs">
          <span className="font-semibold text-ink">Bagikan informasi ini ke warga lain:</span>
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(
                `${article.title} - Baca di: ${SITE_CONFIG.url}/${pilarSlug}/${article.slug}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-[#25D366] px-3 py-1.5 font-medium text-white transition-opacity hover:opacity-90"
            >
              WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                `${SITE_CONFIG.url}/${pilarSlug}/${article.slug}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-[#1877F2] px-3 py-1.5 font-medium text-white transition-opacity hover:opacity-90"
            >
              Facebook
            </a>
          </div>
        </div>
      </article>

      {/* ─── Related Articles ────────────────────────────────────────── */}
      {relatedArticles && relatedArticles.length > 0 && (
        <section className="mx-auto mt-16 max-w-page border-t border-line pt-10">
          <div className="mb-6 flex items-baseline justify-between">
            <h3 className="font-serif text-xl font-bold text-ink sm:text-2xl">
              Artikel Terkait di {pilarLabel}
            </h3>
            <Link
              href={`/${pilarSlug}`}
              className="text-xs font-semibold text-primary hover:text-primary-hover"
            >
              Lihat Kategori {pilarLabel}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedArticles.map((rel) => (
              <ArticleCard key={rel.id} article={rel} variant="standard" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
