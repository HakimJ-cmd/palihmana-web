import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Tag as TagIcon, ArrowRight, BookOpen } from "lucide-react";
import { getArticlesByTagSlug, getAllTags } from "@/modules/articles/queries";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Badge } from "@/components/ui/Badge";
import { SITE_CONFIG } from "@/lib/constants";

interface TagPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { tagName } = await getArticlesByTagSlug(slug);

  return {
    title: `Topik: #${tagName} — Arsip Pengetahuan ${SITE_CONFIG.name}`,
    description: `Kumpulan artikel, investigasi, panduan utilitas, dan liputan kontekstual terkait topik #${tagName} di Tasikmalaya.`,
  };
}

export default async function TagArchivePage({ params }: TagPageProps) {
  const { slug } = await params;
  const { articles, tagName } = await getArticlesByTagSlug(slug);
  const allTags = await getAllTags();

  return (
    <div className="mx-auto max-w-page px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      {/* ─── Breadcrumb ─────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-ink-muted">
        <Link href="/" className="hover:text-primary transition-colors">
          Beranda
        </Link>
        <span>/</span>
        <span>Topik</span>
        <span>/</span>
        <span className="font-semibold text-primary">#{tagName}</span>
      </nav>

      {/* ─── Tag Header ─────────────────────────────────────────────── */}
      <div className="mb-8 border-b border-line pb-6">
        <div className="flex items-center gap-2 text-xs text-primary font-bold uppercase tracking-wider mb-2">
          <TagIcon className="h-4 w-4" />
          <span>Arsip Topik Redaksi</span>
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Topik: <span className="text-primary italic">#{tagName}</span>
        </h1>
        <p className="mt-2 text-sm text-ink-muted max-w-2xl">
          Menampilkan {articles.length} artikel dan liputan mendalam yang terhubung dengan topik #{tagName} untuk masyarakat Tasikmalaya.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Article Grid */}
        <div className="lg:col-span-3">
          {articles.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line p-10 text-center bg-surface">
              <BookOpen className="mx-auto h-10 w-10 text-ink-muted/50" />
              <h3 className="mt-3 font-serif text-lg font-bold text-ink">
                Belum ada artikel untuk topik ini
              </h3>
              <p className="mt-1 text-xs text-ink-muted max-w-sm mx-auto">
                Redaksi sedang menyusun liputan terkait topik ini. Silakan jelajahi topik dan pilar lainnya.
              </p>
              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary-hover transition-colors shadow-xs"
                >
                  Kembali ke Beranda <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: Explore Other Tags */}
        <aside className="lg:col-span-1">
          <div className="rounded-xl border border-line bg-surface p-5 sticky top-20 shadow-xs">
            <h3 className="font-serif text-sm font-bold text-ink uppercase tracking-wider border-b border-line pb-3 mb-4">
              Jelajahi Topik Lainnya
            </h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((t) => {
                const isActive = t.slug === slug.toLowerCase();
                return (
                  <Link
                    key={t.id}
                    href={`/tag/${t.slug}`}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-white font-bold"
                        : "bg-surface-alt text-ink-muted hover:bg-surface-alt/80 hover:text-ink"
                    }`}
                  >
                    <span>#{t.name}</span>
                    <span className="text-[10px] opacity-75 tabular-nums">({t.count})</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-line">
              <h4 className="text-xs font-bold text-ink mb-2">Ingin mengajukan liputan topik?</h4>
              <p className="text-[11px] text-ink-muted leading-relaxed mb-3">
                Kirimkan ide liputan dan laporan warga seputar Tasikmalaya kepada tim redaksi.
              </p>
              <Link
                href="/kontak"
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                Hubungi Meja Redaksi &rarr;
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
