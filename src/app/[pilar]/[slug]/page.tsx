import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { 
  Clock, 
  Eye, 
  Calendar as CalendarIcon, 
  MapPin, 
  CheckCircle2, 
  UserCheck, 
  TrendingUp, 
  Share2, 
  Bookmark, 
  FileCheck, 
  Quote, 
  ArrowRight,
  Newspaper,
  Camera,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { getArticleBySlug, getLatestArticles } from "@/modules/articles/queries";
import { getUpcomingEvents } from "@/modules/events/queries";
import { PILAR_LABELS, PILAR_SLUGS, SITE_CONFIG } from "@/lib/constants";
import { formatDate, formatFreshness } from "@/lib/utils";
import { ArticleToolbar, ReaderReactions, ReaderCommentsSection } from "@/components/article/ArticleInteractiveBar";
import { ArticleContent } from "@/components/article/ArticleContent";
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

  const ogImageUrl = article.coverImage || `${SITE_CONFIG.url}/api/og?title=${encodeURIComponent(article.title)}&pilar=${article.pilar}`;

  return {
    title: article.title,
    description: article.subtitle || SITE_CONFIG.description,
    openGraph: {
      title: `${article.title} — ${SITE_CONFIG.name}`,
      description: article.subtitle || SITE_CONFIG.description,
      type: "article",
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.subtitle || SITE_CONFIG.description,
      images: [ogImageUrl],
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

  const readingTime = article.readingMinutes || 5;
  const currentUrl = `${SITE_CONFIG.url}/${pilarSlug}/${article.slug}`;

  // Related articles and popular articles for sidebar
  const relatedArticles = await getLatestArticles({
    limit: 4,
    excludeSlug: article.slug,
  });

  const popularArticles = await getLatestArticles({
    limit: 5,
  });

  const upcomingEvents = await getUpcomingEvents();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.subtitle || article.title,
    image: article.coverImage ? [article.coverImage] : [],
    datePublished: article.publishedAt ? new Date(article.publishedAt).toISOString() : new Date().toISOString(),
    dateModified: article.contentUpdatedAt
      ? new Date(article.contentUpdatedAt).toISOString()
      : article.publishedAt
      ? new Date(article.publishedAt).toISOString()
      : new Date().toISOString(),
    author: {
      "@type": "Person",
      name: article.author?.name || "Redaksi Palihmana",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
  };

  return (
    <div className="w-full bg-[#f8f9ff] dark:bg-[#0b1c30] min-h-screen">
      {/* Schema.org NewsArticle */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* ─── Breadcrumb & Classification Bar ─────────────────────────── */}
      <section className="w-full bg-white dark:bg-[#132238] py-2.5 px-4 sm:px-6 lg:px-8 border-b border-line">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-ink-muted">
          <nav className="flex items-center flex-wrap gap-1.5">
            <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <span>Beranda</span>
            </Link>
            <span className="text-line">/</span>
            <Link href={`/${pilarSlug}`} className="hover:text-primary transition-colors font-medium">
              {pilarLabel}
            </Link>
            <span className="text-line">/</span>
            <span className="text-primary font-semibold line-clamp-1 max-w-[200px] sm:max-w-md">
              {article.title}
            </span>
          </nav>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1 bg-[#eff4ff] dark:bg-[#1E314B] px-2 py-0.5 rounded text-ink font-semibold">
              <Clock className="h-3 w-3 text-primary" />
              <span>{readingTime} Menit Baca</span>
            </span>
            <span className="text-line hidden sm:inline">•</span>
            <span className="flex items-center gap-1 text-ink-muted hidden sm:flex">
              <Eye className="h-3.5 w-3.5 text-primary" />
              <span>24.810 Pembaca</span>
            </span>
          </div>
        </div>
      </section>

      {/* ─── Main Article Container ──────────────────────────────────── */}
      <article className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="max-w-5xl">
          {/* Tag Badges & Time */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-primary text-white text-[11px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
              {pilarLabel}
            </span>
            <span className="bg-[#eff4ff] dark:bg-[#1E314B] text-primary text-[11px] px-2.5 py-0.5 rounded font-semibold tracking-wide uppercase">
              Liputan Terverifikasi
            </span>
            {article.lastVerifiedAt && (
              <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[11px] px-2.5 py-0.5 rounded font-semibold tracking-wide flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                <span>Terverifikasi Fakta</span>
              </span>
            )}
            {(article as any).isSponsored && (
              <span className="bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 text-[11px] px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                Konten Kemitraan / Sponsor
              </span>
            )}
            <span className="text-ink-muted text-[11px] ml-auto sm:ml-2 flex items-center gap-1">
              <CalendarIcon className="h-3.5 w-3.5 text-primary" />
              <span>{formatDate(article.publishedAt)}</span>
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[44px] lg:leading-[1.18] text-ink font-bold tracking-tight">
            {article.title}
          </h1>

          {/* Lead Excerpt */}
          {article.subtitle && (
            <p className="mt-3 text-base sm:text-lg text-ink-muted leading-relaxed font-normal">
              {article.subtitle}
            </p>
          )}

          {/* Byline Profile Row & Toolbar */}
          <div className="mt-6 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-base">
                {article.author?.name ? article.author.name.charAt(0) : "P"}
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-ink text-sm">
                    {article.author?.name || "Redaksi Palihmana"}
                  </span>
                  <CheckCircle2 className="h-4 w-4 text-primary fill-primary/20" />
                  <span className="text-[10px] text-ink-muted bg-surface-alt px-1.5 py-0.5 rounded font-medium">
                    Jurnalis Lapangan
                  </span>
                </div>
                <p className="text-xs text-ink-muted truncate">
                  Editor: <span className="text-ink font-medium">Ridwan Kamilah</span> • Foto: <span className="text-ink font-medium">Fauzan Zulfikar</span>
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Toolbar (TTS Audio Player, Font Resize, Share, Bookmark) */}
          <ArticleToolbar article={article} url={currentUrl} />
        </div>

        {/* ─── Main Hero Image Frame ─────────────────────────────────── */}
        <div className="my-6 flex flex-col gap-2 max-w-5xl">
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden bg-surface-alt shadow-sm">
            <Image
              src={article.coverImage || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop"}
              alt={article.coverAlt || article.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1000px"
              className="object-cover"
            />
            <div className="absolute top-3 left-3 bg-[#213145]/90 backdrop-blur-xs text-white text-[11px] uppercase tracking-wider px-2.5 py-1 rounded flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>Dokumentasi Jurnalistik Palihmana.ID</span>
            </div>
          </div>
          <figcaption className="text-xs text-ink-muted flex items-start gap-1.5 px-1">
            <Camera className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
            <span>
              {article.coverAlt || "Liputan lapangan tim investigasi Palihmana.id di kawasan Tatar Pasundan."}{" "}
              <strong className="text-ink font-semibold">(Foto: Palihmana.id/Dokumentasi)</strong>
            </span>
          </figcaption>
        </div>

        {/* ─── 2-Column Body Layout (Main 8 Cols + Sidebar 4 Cols) ───── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 items-start">
          
          {/* MAIN ARTICLE COLUMN (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Correction Note Box (PRD F1-READ-06) */}
            {article.corrections && article.corrections.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-600 p-5 rounded-r-xl shadow-xs">
                <div className="flex items-center gap-2 mb-2 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-bold tracking-wide uppercase">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>Catatan Koreksi & Ralat Redaksi</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {article.corrections.map((corr: any, idx: number) => (
                    <div key={idx} className="text-xs sm:text-sm text-amber-900 dark:text-amber-200">
                      <p className="font-semibold text-[11px] text-amber-700 dark:text-amber-400 mb-0.5">
                        {corr.createdAt ? formatDate(corr.createdAt) : "Terverifikasi"}:
                      </p>
                      <p className="leading-relaxed">{corr.note || corr.correction}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Takeaways Box (Inti Berita & Poin Kunci) */}
            {article.summaryPoints && article.summaryPoints.length > 0 && (
              <div className="bg-[#eff4ff] dark:bg-[#132238] border-l-4 border-primary p-5 sm:p-6 rounded-r-xl shadow-xs">
                <div className="flex items-center gap-2 mb-3 text-primary text-xs sm:text-sm font-bold tracking-wide uppercase">
                  <FileCheck className="h-4 w-4" />
                  <span>Inti Berita & Poin Kunci</span>
                </div>
                <ul className="flex flex-col gap-2 text-xs sm:text-sm text-ink list-none">
                  {article.summaryPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Editorial Prose Content with Drop Cap */}
            <div id="article-prose-container" className="font-sans text-[17px] sm:text-[18px] leading-[1.75] text-ink flex flex-col gap-4">
              {/* Drop cap first paragraph */}
              <div className="first-letter:float-left first-letter:text-primary first-letter:font-serif first-letter:text-[60px] first-letter:leading-[48px] first-letter:font-bold first-letter:mr-3 first-letter:mt-1">
                {article.bodyText ? (
                  <p className="leading-relaxed">{article.bodyText}</p>
                ) : (
                  <p className="leading-relaxed">
                    Menelusuri langsung realitas lapangan di berbagai sudut Tatar Pasundan, tim investigasi Palihmana.id menemukan beragam dinamika sosial, tantangan infrastruktur, dan denyut ekonomi warga yang sarat makna.
                  </p>
                )}
              </div>

              {/* Render structured content */}
              <ArticleContent contentJson={typeof article.bodyJson === "string" ? article.bodyJson : JSON.stringify(article.bodyJson)} />

              {/* Editorial Pull Quote */}
              <blockquote className="my-6 p-6 bg-[#eff4ff] dark:bg-[#132238] rounded-xl border-l-4 border-primary relative overflow-hidden shadow-xs">
                <Quote className="h-16 w-16 text-primary/10 absolute -right-2 -bottom-4 pointer-events-none" />
                <p className="font-serif text-base sm:text-lg italic font-semibold text-ink leading-snug relative z-10 mb-2">
                  &ldquo;Kami tidak sekadar melaporkan peristiwa, melainkan menyajikan fakta teruji, panduan yang berguna, dan ruang suara jujur bagi warga Tatar Pasundan.&rdquo;
                </p>
                <cite className="block text-xs font-bold text-primary not-italic">
                  — Dewan Redaksi Palihmana.ID
                  <span className="block text-[11px] font-normal text-ink-muted">Standar Integritas & Jurnalisme Siber</span>
                </cite>
              </blockquote>
            </div>

            {/* Article Topic Tags Cloud */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-4 border-t border-line flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold uppercase text-ink-muted mr-1">Topik Berita:</span>
                {article.tags.map((t: any, idx: number) => (
                  <Link
                    key={idx}
                    href={`/cari?q=${encodeURIComponent(t.tag?.name || t.name)}`}
                    className="px-3 py-1 rounded-lg bg-white dark:bg-[#132238] border border-line hover:bg-primary hover:text-white font-medium transition-colors"
                  >
                    #{t.tag?.name || t.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Reader Reaction Bar */}
            <ReaderReactions />

            {/* Reader Comments Section */}
            <ReaderCommentsSection />

          </div>

          {/* RIGHT SIDEBAR COLUMN (4 Cols) */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Journalist Bio Widget */}
            <div className="bg-white dark:bg-[#132238] border border-line p-5 rounded-xl shadow-xs">
              <div className="flex items-start gap-3">
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-xl font-serif">
                  {article.author?.name ? article.author.name.charAt(0) : "P"}
                </div>
                <div className="flex flex-col">
                  <h4 className="font-serif text-sm font-bold text-ink">
                    {article.author?.name || "Redaksi Palihmana"}
                  </h4>
                  <p className="text-[11px] text-primary font-semibold">Jurnalis Senior Investigasi</p>
                  <p className="text-xs text-ink-muted mt-1 leading-snug">
                    Spesialis liputan agraria, tata ruang, denyut UMKM, dan dinamika warga Priangan Timur.
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-xs">
                <span className="text-ink-muted">148 Artikel Liputan</span>
                <button
                  type="button"
                  className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover transition-colors shadow-xs"
                >
                  Ikuti Penulis
                </button>
              </div>
            </div>

            {/* Berita Terpopuler Hari Ini */}
            <div className="bg-white dark:bg-[#132238] border border-line rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between border-b-2 border-primary pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <h3 className="font-serif text-xs font-bold uppercase text-ink tracking-wider">
                    Terpopuler Hari Ini
                  </h3>
                </div>
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              </div>

              <div className="flex flex-col divide-y divide-line/60">
                {popularArticles.map((pop, idx) => (
                  <Link
                    key={pop.id}
                    href={`/${PILAR_SLUGS[pop.pilar] || "utility"}/${pop.slug}`}
                    className="py-3 flex items-start gap-3 group"
                  >
                    <span className="font-serif text-2xl font-bold text-primary/70 group-hover:text-primary transition-colors w-5">
                      {idx + 1}
                    </span>
                    <div className="flex flex-col flex-1">
                      <span className="text-[10px] uppercase font-bold text-primary">
                        {PILAR_LABELS[pop.pilar] || "BERITA"}
                      </span>
                      <h4 className="font-serif text-xs font-bold text-ink group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {pop.title}
                      </h4>
                      <span className="text-[10px] text-ink-muted mt-0.5">
                        {pop.readingMinutes || 4} mnt baca
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Agenda Pekan Ini */}
            <div className="bg-white dark:bg-[#132238] border border-line rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between border-b-2 border-primary pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  <h3 className="font-serif text-xs font-bold uppercase text-ink tracking-wider">
                    Agenda Event Pekan Ini
                  </h3>
                </div>
                <Link href="/kalender" className="text-xs text-primary font-bold hover:underline">
                  Semua
                </Link>
              </div>

              <div className="flex flex-col gap-2.5">
                {upcomingEvents.slice(0, 2).map((ev) => {
                  const d = new Date(ev.eventDate);
                  return (
                    <div key={ev.id} className="p-2.5 rounded-lg bg-[#eff4ff] dark:bg-[#0b1c30] flex items-start gap-3">
                      <div className="bg-primary text-white text-center px-2 py-1 rounded text-xs font-bold shrink-0 w-11 shadow-xs">
                        <span className="block text-[9px] uppercase font-bold">
                          {d.toLocaleString("id-ID", { month: "short" })}
                        </span>
                        <span className="font-serif text-base leading-none">{d.getDate()}</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-ink hover:text-primary cursor-pointer line-clamp-1">
                          {ev.title}
                        </h4>
                        <p className="text-[11px] text-ink-muted line-clamp-1 mt-0.5">
                          {ev.location}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sticky Newsletter Subscription Card */}
            <div className="sticky top-44 bg-[#213145] text-white p-5 rounded-xl shadow-md border-t-4 border-primary flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Buletin Media Berkualitas
                </span>
              </div>
              <h4 className="font-serif text-sm font-bold text-white">
                Jangan Tertinggal Berita Pilihan Jawa Barat
              </h4>
              <p className="text-xs text-[#bec6e0] leading-relaxed">
                Dapatkan kurasi berita mendalam, investigasi eksklusif, dan analisis kebijakan publik langsung di kotak masuk Anda setiap pagi.
              </p>
              <form action="#" className="flex flex-col gap-2 mt-1">
                <input
                  type="email"
                  placeholder="Alamat email aktif Anda..."
                  className="px-3 py-2 bg-white/10 border border-white/20 text-white placeholder-[#bec6e0]/70 rounded text-xs focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  className="py-2 bg-primary text-white text-xs uppercase font-bold rounded hover:bg-primary-hover transition-colors shadow-xs"
                >
                  Berlangganan Sekarang
                </button>
              </form>
              <p className="text-[10px] text-[#bec6e0] text-center">Bebas spam. Berhenti berlangganan kapan pun.</p>
            </div>

          </aside>
        </div>
      </article>

      {/* ─── Rekomendasi Berita Terkait Lainnya (Bottom Grid) ─────────── */}
      <section className="w-full bg-[#eff4ff] dark:bg-[#132238] border-t border-line py-10 sm:py-12 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between border-b-2 border-primary pb-2">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink">
              Liputan Khusus & Berita Terkait Lainnya
            </h2>
            <Link href={`/${pilarSlug}`} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              <span>Arsip {pilarLabel}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedArticles.map((rel) => (
              <article key={rel.id} className="bg-white dark:bg-[#0b1c30] border border-line rounded-xl overflow-hidden flex flex-col group shadow-xs hover:shadow-md transition-shadow">
                <Link
                  href={`/${PILAR_SLUGS[rel.pilar] || "utility"}/${rel.slug}`}
                  className="relative aspect-video bg-surface-alt overflow-hidden block"
                >
                  <Image
                    src={rel.coverImage || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=400&auto=format&fit=crop"}
                    alt={rel.title}
                    fill
                    sizes="280px"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-primary text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase shadow-xs">
                    {PILAR_LABELS[rel.pilar] || "KABAR"}
                  </span>
                </Link>
                <div className="p-4 flex flex-col flex-1 justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-ink-muted">Tasikmalaya • Terverifikasi</span>
                    <h3 className="font-serif text-xs sm:text-sm text-ink group-hover:text-primary transition-colors font-bold leading-snug mt-1 line-clamp-2">
                      <Link href={`/${PILAR_SLUGS[rel.pilar] || "utility"}/${rel.slug}`}>
                        {rel.title}
                      </Link>
                    </h3>
                  </div>
                  <p className="text-xs text-ink-muted line-clamp-2">
                    {rel.subtitle || "Ulasan informatif dan data faktual bagi kebutuhan harian masyarakat Jawa Barat."}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
