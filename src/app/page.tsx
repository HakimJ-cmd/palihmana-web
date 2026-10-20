import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Flame, 
  ArrowRight, 
  Clock, 
  MapPin, 
  Play, 
  MessageSquare, 
  Share2, 
  Calendar as CalendarIcon, 
  Camera, 
  Video, 
  Eye, 
  FileText, 
  HelpCircle,
  Megaphone,
  CheckCircle2
} from "lucide-react";
import { getFeaturedArticle, getLatestArticles } from "@/modules/articles/queries";
import { getUpcomingEvents } from "@/modules/events/queries";
import { PILAR_SLUGS, PILAR_LABELS } from "@/lib/constants";
import { BreakingNewsTicker, CivicPollWidget } from "@/components/home/HomeInteractiveWidgets";
import { formatDateShort } from "@/lib/utils";

export const revalidate = 60; // ISR cache 60 seconds

export default async function HomePage() {
  const featured = await getFeaturedArticle();
  const latestArticles = await getLatestArticles({ limit: 12 });
  const events = await getUpcomingEvents();

  // Curate articles across sections
  const editorialPicks = latestArticles.slice(0, 4);
  const mainHero = featured || latestArticles[0];
  const subLead = latestArticles[1] || featured;
  const trendingArticles = latestArticles.slice(2, 7);
  const focusArticles = latestArticles.slice(4, 8);
  const feedArticles = latestArticles.slice(1, 6);

  return (
    <div className="w-full bg-[#f8f9ff] dark:bg-[#0b1c30] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* ─── 1. BREAKING NEWS TICKER ─────────────────────────────────── */}
        <BreakingNewsTicker articles={latestArticles} />

        {/* ─── 2. EDITORIAL GRID (3-Column Layout) ─────────────────────── */}
        <section className="w-full mb-10 sm:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* LEFT COLUMN (3 Cols): Pilihan Redaksi */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-1 border-b border-line">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-primary rounded-full"></span>
                  <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-ink">
                    Pilihan Redaksi
                  </h3>
                </div>
                <span className="text-[11px] text-ink-muted">Kurasi Harian</span>
              </div>

              {/* Featured Left Story */}
              {editorialPicks[0] && (
                <article className="bg-white dark:bg-[#132238] rounded-xl overflow-hidden border border-line/80 shadow-xs hover:shadow-md transition-shadow group flex flex-col">
                  <Link 
                    href={`/${PILAR_SLUGS[editorialPicks[0].pilar] || "utility"}/${editorialPicks[0].slug}`}
                    className="relative w-full h-44 overflow-hidden bg-surface-alt block"
                  >
                    <Image
                      src={editorialPicks[0].coverImage || "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop"}
                      alt={editorialPicks[0].coverAlt || editorialPicks[0].title}
                      fill
                      sizes="320px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-[#213145]/90 text-white px-2 py-0.5 rounded text-[11px] font-medium backdrop-blur-xs">
                      <Clock className="h-3 w-3 text-primary" />
                      <span>{editorialPicks[0].readingMinutes || 4} Mnt Baca</span>
                    </div>
                  </Link>
                  <div className="p-4 flex flex-col gap-1.5 flex-1">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="text-primary font-bold uppercase tracking-wider">
                        {PILAR_LABELS[editorialPicks[0].pilar] || "UTILITY"}
                      </span>
                      <span className="text-line">•</span>
                      <span className="text-ink-muted">Terverifikasi</span>
                    </div>
                    <h4 className="font-serif text-base font-bold text-ink group-hover:text-primary transition-colors leading-snug">
                      <Link href={`/${PILAR_SLUGS[editorialPicks[0].pilar] || "utility"}/${editorialPicks[0].slug}`}>
                        {editorialPicks[0].title}
                      </Link>
                    </h4>
                    <p className="text-xs text-ink-muted line-clamp-2 mt-0.5">
                      {editorialPicks[0].subtitle || "Ulasan mendalam dan panduan teruji untuk kebutuhan harian warga Jawa Barat."}
                    </p>
                    <div className="mt-auto pt-3 flex items-center justify-between text-[11px] text-ink-muted border-t border-line/60">
                      <span>Oleh <strong className="text-ink">{editorialPicks[0].author?.name || "Redaksi"}</strong></span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> 2.1k</span>
                    </div>
                  </div>
                </article>
              )}

              {/* Compact Stacked Items */}
              <div className="flex flex-col gap-3">
                {editorialPicks.slice(1, 4).map((item) => (
                  <article key={item.id} className="bg-white dark:bg-[#132238] rounded-xl p-3 border border-line/70 hover:bg-[#eff4ff] dark:hover:bg-[#1E314B] transition-colors shadow-xs flex items-start gap-3 group">
                    <Link
                      href={`/${PILAR_SLUGS[item.pilar] || "utility"}/${item.slug}`}
                      className="w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-surface-alt relative block"
                    >
                      <Image
                        src={item.coverImage || "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=300&auto=format&fit=crop"}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-[10px] text-ink-muted mb-0.5 font-bold uppercase tracking-wider">
                        <span className="text-primary">{PILAR_LABELS[item.pilar] || "KABAR"}</span>
                      </div>
                      <h5 className="font-serif text-xs font-bold leading-tight text-ink group-hover:text-primary transition-colors line-clamp-2">
                        <Link href={`/${PILAR_SLUGS[item.pilar] || "utility"}/${item.slug}`}>
                          {item.title}
                        </Link>
                      </h5>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* CENTER COLUMN (6 Cols): Sorotan Utama (Dominant Hero Banner) */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-1 border-b border-line">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse"></span>
                  <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-ink">
                    Sorotan Utama
                  </h3>
                </div>
                <span className="text-[11px] text-primary font-bold">Investigasi & Analisis</span>
              </div>

              {/* Dominant Main Story Banner */}
              {mainHero && (
                <article className="relative w-full rounded-2xl overflow-hidden shadow-md group bg-[#213145] min-h-[380px] lg:min-h-[420px] flex flex-col justify-end">
                  <div className="absolute inset-0">
                    <Image
                      src={mainHero.coverImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop"}
                      alt={mainHero.coverAlt || mainHero.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 680px"
                      className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1c30] via-[#0b1c30]/65 to-transparent"></div>
                  </div>

                  <div className="relative z-10 p-5 sm:p-7 flex flex-col gap-2.5 text-white">
                    <div className="flex items-center gap-2">
                      <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        LIPUTAN KHUSUS
                      </span>
                      <span className="bg-white/20 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {mainHero.readingMinutes || 6} Menit Baca
                      </span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl lg:text-[32px] lg:leading-[1.18] text-white font-bold tracking-tight group-hover:text-primary-fixed-dim transition-colors">
                      <Link href={`/${PILAR_SLUGS[mainHero.pilar] || "utility"}/${mainHero.slug}`}>
                        {mainHero.title}
                      </Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-[#bec6e0] line-clamp-2 leading-relaxed">
                      {mainHero.subtitle || "Laporan eksklusif redaksi mengenai proyek strategis, tata kelola lingkungan, dan dampak langsung terhadap kesejahteraan warga lokal."}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-[#bec6e0] text-xs border-t border-white/20">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                          {mainHero.author?.name ? mainHero.author.name.charAt(0) : "P"}
                        </div>
                        <div>
                          <span className="font-semibold text-white">{mainHero.author?.name || "Redaksi Palihmana"}</span>
                          <span className="mx-1">•</span>
                          <span className="text-[11px]">Koresponden</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> 84</span>
                        <span className="flex items-center gap-1"><Share2 className="h-3.5 w-3.5" /> 1.2k</span>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* Sub-Lead Highlight Card */}
              {subLead && (
                <article className="bg-white dark:bg-[#132238] rounded-xl p-4 border border-line/80 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 items-center group">
                  <div className="relative w-full sm:w-48 h-32 rounded-lg overflow-hidden shrink-0 bg-surface-alt">
                    <Image
                      src={subLead.coverImage || "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=400&auto=format&fit=crop"}
                      alt={subLead.title}
                      fill
                      sizes="200px"
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Play className="h-4 w-4 fill-white ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-1.5 right-1.5 bg-[#213145]/90 text-white text-[10px] px-1.5 py-0.5 rounded">
                      Eksklusif
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col gap-1 w-full">
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="text-tertiary font-bold uppercase tracking-wider">
                        {PILAR_LABELS[subLead.pilar] || "OPINI & ANALISIS"}
                      </span>
                      <span className="text-line">•</span>
                      <span className="text-ink-muted">Terverifikasi</span>
                    </div>
                    <h4 className="font-serif text-base font-bold text-ink group-hover:text-primary transition-colors leading-snug">
                      <Link href={`/${PILAR_SLUGS[subLead.pilar] || "utility"}/${subLead.slug}`}>
                        {subLead.title}
                      </Link>
                    </h4>
                    <p className="text-xs text-ink-muted line-clamp-2">
                      {subLead.subtitle || "Menyelami silang pandang kebijakan publik dan fakta di lapangan secara objektif."}
                    </p>
                  </div>
                </article>
              )}
            </div>

            {/* RIGHT COLUMN (3 Cols): Trending Now / Populer */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <div className="flex items-center justify-between pb-1 border-b border-line">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-tertiary rounded-full"></span>
                  <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-ink">
                    Paling Populer
                  </h3>
                </div>
                <Flame className="h-4 w-4 text-primary" />
              </div>

              {/* 5 Numbered Trending Items */}
              <div className="bg-white dark:bg-[#132238] rounded-xl p-4 border border-line/80 shadow-xs flex flex-col gap-4">
                {trendingArticles.map((art, idx) => (
                  <React.Fragment key={art.id}>
                    <article className="flex items-start gap-3 group">
                      <span className={`w-6 h-6 rounded-full font-serif text-xs font-bold flex items-center justify-center shrink-0 ${
                        idx === 0 
                          ? "bg-primary text-white" 
                          : "bg-[#213145] text-white dark:bg-[#1E314B]"
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">
                          {PILAR_LABELS[art.pilar] || "TOPIK HANGAT"}
                        </span>
                        <h5 className="font-serif text-xs sm:text-sm font-bold leading-tight text-ink group-hover:text-primary transition-colors mt-0.5 line-clamp-2">
                          <Link href={`/${PILAR_SLUGS[art.pilar] || "utility"}/${art.slug}`}>
                            {art.title}
                          </Link>
                        </h5>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-ink-muted">
                          <span>{art.readingMinutes || 4} mnt baca</span>
                          <span>•</span>
                          <span className="text-primary font-medium">+1.4k dibaca</span>
                        </div>
                      </div>
                    </article>
                    {idx < trendingArticles.length - 1 && <div className="h-px bg-line/60"></div>}
                  </React.Fragment>
                ))}
              </div>

              {/* E-Paper Digital Banner */}
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex items-center justify-between gap-3">
                <div>
                  <p className="font-serif text-xs text-primary font-bold uppercase tracking-wider">
                    E-PAPER EDISI TERBARU
                  </p>
                  <p className="text-[11px] text-ink-muted mt-0.5">
                    Unduh format buletin digital resolusi tinggi
                  </p>
                </div>
                <Link
                  href="/pedoman-editorial"
                  className="px-3 py-1.5 bg-primary text-white hover:text-white hover:bg-primary-hover text-[11px] font-bold rounded-lg transition-colors shrink-0 shadow-xs"
                >
                  Buka E-Paper
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* ─── 3. FEATURED POSTS HORIZONTAL 4-CARD STRIP ─────────────── */}
        <section className="w-full mb-10 sm:mb-12">
          <div className="flex items-center justify-between pb-2 mb-4 border-b border-line">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-primary rounded-[3px]"></span>
              <h3 className="font-serif text-xl sm:text-2xl text-ink font-bold tracking-tight">
                Fokus Berita Pilihan
              </h3>
            </div>
            <Link
              href="/utility"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Lihat Semua Liputan <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {focusArticles.map((card, idx) => {
              const tags = ["EKONOMI & BISNIS", "TEKNOLOGI", "KULINER LOKAL", "KOMUNITAS"];
              return (
                <article key={card.id} className="bg-white dark:bg-[#132238] rounded-xl overflow-hidden border border-line/80 shadow-xs hover:shadow-md transition-shadow group flex flex-col">
                  <Link 
                    href={`/${PILAR_SLUGS[card.pilar] || "utility"}/${card.slug}`}
                    className="relative w-full h-44 overflow-hidden bg-surface-alt block"
                  >
                    <Image
                      src={card.coverImage || "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600&auto=format&fit=crop"}
                      alt={card.title}
                      fill
                      sizes="280px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow-xs">
                      {tags[idx % tags.length]}
                    </span>
                    <span className="absolute bottom-2 right-2 bg-[#213145]/90 text-white text-[10px] px-1.5 py-0.5 rounded">
                      {card.readingMinutes || 4} Mnt
                    </span>
                  </Link>

                  <div className="p-4 flex flex-col flex-1 gap-1.5">
                    <span className="text-[11px] text-ink-muted">
                      {PILAR_LABELS[card.pilar] || "Utilitas"} • Terverifikasi
                    </span>
                    <h4 className="font-serif text-sm font-bold text-ink group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      <Link href={`/${PILAR_SLUGS[card.pilar] || "utility"}/${card.slug}`}>
                        {card.title}
                      </Link>
                    </h4>
                    <p className="text-xs text-ink-muted line-clamp-2 mt-0.5">
                      {card.subtitle || "Ulasan informatif dan data faktual bagi kebutuhan masyarakat Jawa Barat."}
                    </p>
                    <div className="mt-auto pt-3 flex items-center justify-between text-[11px] text-ink-muted border-t border-line/60">
                      <span className="font-medium text-ink">{card.author?.name || "Redaksi"}</span>
                      <span>2.1k baca</span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ─── 4. DUAL COLUMN CONTENT FEED (Main Feed 8 Cols + Sidebar 4 Cols) ─ */}
        <section className="w-full mb-10 sm:mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* MAIN FEED LEFT COLUMN (8 Cols) */}
            <div className="lg:col-span-8 flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-line">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-primary rounded-full"></span>
                  <h3 className="font-serif text-xl sm:text-2xl text-ink font-bold tracking-tight">
                    Kabar Daerah Terkini
                  </h3>
                </div>
                <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 sm:pb-0 text-xs">
                  <span className="px-3 py-1 rounded-lg bg-primary text-white font-semibold shrink-0">
                    Semua Wilayah
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white dark:bg-[#132238] border border-line text-ink font-medium shrink-0">
                    Tasikmalaya & Priangan
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white dark:bg-[#132238] border border-line text-ink font-medium shrink-0">
                    Bandung Raya
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-white dark:bg-[#132238] border border-line text-ink font-medium shrink-0">
                    Pantai Selatan
                  </span>
                </div>
              </div>

              {/* Feed List Items */}
              <div className="flex flex-col gap-4">
                {feedArticles.map((row) => (
                  <article key={row.id} className="bg-white dark:bg-[#132238] rounded-xl p-4 sm:p-5 border border-line/80 shadow-xs hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-4 items-start group">
                    <Link
                      href={`/${PILAR_SLUGS[row.pilar] || "utility"}/${row.slug}`}
                      className="relative w-full sm:w-56 h-36 rounded-lg overflow-hidden shrink-0 bg-surface-alt block"
                    >
                      <Image
                        src={row.coverImage || "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=400&auto=format&fit=crop"}
                        alt={row.title}
                        fill
                        sizes="240px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow-xs">
                        {PILAR_LABELS[row.pilar] || "BERITA"}
                      </span>
                    </Link>

                    <div className="flex-1 flex flex-col gap-1.5 w-full">
                      <div className="flex items-center gap-2 text-[11px] text-ink-muted">
                        <span className="font-bold text-ink">TASIKMALAYA & JABAR</span>
                        <span>•</span>
                        <span>{row.readingMinutes || 4} Mnt Baca</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5"><MessageSquare className="h-3 w-3" /> 18 Komentar</span>
                      </div>

                      <h4 className="font-serif text-lg font-bold text-ink group-hover:text-primary transition-colors leading-tight">
                        <Link href={`/${PILAR_SLUGS[row.pilar] || "utility"}/${row.slug}`}>
                          {row.title}
                        </Link>
                      </h4>

                      <p className="text-xs sm:text-sm text-ink-muted line-clamp-2 leading-relaxed">
                        {row.subtitle || "Informasi komprehensif diverifikasi langsung di lapangan demi kemudahan dan kepastian bagi warga."}
                      </p>

                      <div className="pt-2 flex items-center justify-between text-xs text-ink-muted border-t border-line/50 mt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                            {row.author?.name ? row.author.name.charAt(0) : "R"}
                          </span>
                          <span>Oleh <strong className="text-ink">{row.author?.name || "Redaksi"}</strong></span>
                        </div>

                        <Link 
                          href={`/${PILAR_SLUGS[row.pilar] || "utility"}/${row.slug}`}
                          className="text-primary hover:underline flex items-center gap-0.5 font-bold text-xs"
                        >
                          Baca Selengkapnya <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Load More Button */}
              <div className="pt-2 flex justify-center">
                <Link
                  href="/utility"
                  className="px-6 py-2.5 rounded-xl bg-white dark:bg-[#132238] hover:bg-primary hover:text-white text-ink border border-line text-xs font-bold transition-all shadow-xs flex items-center gap-2"
                >
                  <span>Muat Berita & Panduan Lainnya</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* SIDEBAR RIGHT COLUMN (4 Cols) */}
            <aside className="lg:col-span-4 flex flex-col gap-6">
              
              {/* WIDGET 1: Agenda Pasundan & Kalender Event */}
              <div className="bg-white dark:bg-[#132238] rounded-xl p-5 border border-line/80 shadow-xs flex flex-col gap-3">
                <div className="flex items-center justify-between pb-1 border-b border-line">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    <h4 className="font-serif text-sm font-bold text-ink uppercase tracking-wide">
                      Agenda Pasundan
                    </h4>
                  </div>
                  <Link href="/kalender" className="text-xs text-primary font-bold hover:underline">
                    Semua
                  </Link>
                </div>

                <div className="flex flex-col gap-2.5">
                  {events.slice(0, 3).map((evt) => {
                    const d = new Date(evt.eventDate);
                    const day = d.getDate();
                    const month = d.toLocaleString("id-ID", { month: "short" }).toUpperCase();
                    return (
                      <div key={evt.id} className="p-3 rounded-lg bg-[#eff4ff] dark:bg-[#0b1c30] flex items-start gap-3 hover:bg-[#e5eeff] dark:hover:bg-[#1E314B] transition-colors">
                        <div className="bg-primary text-white rounded-lg p-1.5 text-center shrink-0 w-12 shadow-xs">
                          <span className="block text-[9px] uppercase font-bold">{month}</span>
                          <span className="block font-serif text-lg font-bold leading-none">{day}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">
                            {evt.priceType === "FREE" ? "GRATIS" : "TERBATAS"}
                          </span>
                          <h5 className="font-serif text-xs font-bold text-ink leading-tight truncate mt-0.5">
                            {evt.title}
                          </h5>
                          <p className="text-[11px] text-ink-muted flex items-center gap-1 mt-1 truncate">
                            <MapPin className="h-3 w-3 text-primary shrink-0" />
                            <span>{evt.location}</span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Link
                  href="/kalender"
                  className="w-full text-center py-2 bg-[#dce9ff] dark:bg-[#1E314B] hover:bg-primary hover:text-white rounded-lg text-xs text-ink font-semibold transition-colors mt-1"
                >
                  Buka Kalender Event Lengkap
                </Link>
              </div>

              {/* WIDGET 2: Kolom Opini & Wacana Warga */}
              <div className="bg-white dark:bg-[#132238] rounded-xl p-5 border border-line/80 shadow-xs flex flex-col gap-3">
                <div className="flex items-center justify-between pb-1 border-b border-line">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[20px]">edit_note</span>
                    <h4 className="font-serif text-sm font-bold text-ink uppercase tracking-wide">
                      Kolom Opini
                    </h4>
                  </div>
                  <Link href="/opini" className="text-xs text-primary font-bold hover:underline">
                    Kirim Tulisan
                  </Link>
                </div>

                <div className="flex flex-col gap-3">
                  <article className="flex items-start gap-3 group">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-sm">
                      CH
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-primary">Prof. Dr. Ir. Cecep Haryanto</p>
                      <p className="text-[10px] text-ink-muted">Guru Besar Tata Ruang Wilayah</p>
                      <h5 className="font-serif text-xs sm:text-sm leading-snug text-ink group-hover:text-primary transition-colors mt-1 font-bold">
                        <Link href="/opini">
                          &ldquo;Menyelamatkan Ruang Hidup Petani dari Serbuan Beton Tanpa Regulasi Tegas&rdquo;
                        </Link>
                      </h5>
                    </div>
                  </article>

                  <div className="h-px bg-line/60"></div>

                  <article className="flex items-start gap-3 group">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0 text-sm">
                      SK
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-primary">Nyi Mas Santi Kusuma</p>
                      <p className="text-[10px] text-ink-muted">Pemerhati Kebudayaan Pasundan</p>
                      <h5 className="font-serif text-xs sm:text-sm leading-snug text-ink group-hover:text-primary transition-colors mt-1 font-bold">
                        <Link href="/opini">
                          &ldquo;Bahasa Sunda di Era Algoritma: Tantangan atau Peluang Revitalisasi Global?&rdquo;
                        </Link>
                      </h5>
                    </div>
                  </article>
                </div>
              </div>

              {/* WIDGET 3: Jajak Pendapat Warga (Interactive Civic Poll) */}
              <CivicPollWidget />

              {/* WIDGET 4: Kanal Aspirasi & Layanan Pengaduan Warga */}
              <div className="bg-[#213145] text-white rounded-xl p-5 shadow-md flex flex-col gap-3 relative overflow-hidden">
                <div className="relative z-10 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-primary-fixed-dim">
                    <Megaphone className="h-4 w-4 text-primary" />
                    <span className="text-[10px] uppercase tracking-wider font-bold text-primary-fixed-dim">
                      KANAL ADVOKASI CIVIC
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-white">
                    Lapor Warga & Suara Redaksi
                  </h4>
                  <p className="text-xs text-[#bec6e0] leading-relaxed">
                    Menemukan jalan rusak berbahaya, pungutan liar dokumen, atau fasilitas umum terbengkalai di wilayah Anda? Kirimkan bukti foto dan laporan ringkas kepada tim investigasi Palihmana.ID.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <Link
                      href="/kontak"
                      className="px-4 py-2 bg-primary text-white hover:text-white hover:bg-primary-hover text-center rounded-lg text-xs font-bold transition-colors shadow-xs"
                    >
                      Kirim Laporan Cepat
                    </Link>
                    <Link
                      href="/kebijakan-koreksi"
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-center rounded-lg text-xs font-medium transition-colors"
                    >
                      Standar Verifikasi
                    </Link>
                  </div>
                </div>
              </div>

            </aside>
          </div>
        </section>

        {/* ─── 5. FOTO & VIDEO REPORTASE (Media Gallery Section) ──────── */}
        <section className="w-full mb-8">
          <div className="bg-[#213145] text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/15">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-white">
                  <Camera className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl text-white font-bold tracking-tight">
                    Galeri Foto & Dokumenter Video
                  </h3>
                  <p className="text-xs text-[#bec6e0]">
                    Visual jurnalistik presisi dari pelosok pesisir hingga pegunungan Tatar Pasundan
                  </p>
                </div>
              </div>
              <Link
                href="/catatan-lapangan"
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-primary text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>Jelajah Arsip Visual</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {/* Big Video Card (Takes 2 cols) */}
              <article className="md:col-span-2 relative rounded-xl overflow-hidden group min-h-[260px] flex flex-col justify-end bg-black">
                <Image
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1000&auto=format&fit=crop"
                  alt="Dokumenter konservasi pesisir"
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                  <span className="bg-primary text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1">
                    <Video className="h-3 w-3" /> VIDEO DOKUMENTER
                  </span>
                  <span className="bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">14:20</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-14 h-14 rounded-full bg-primary/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="h-6 w-6 fill-white ml-1" />
                  </div>
                </div>
                <div className="relative z-10 p-5 flex flex-col gap-1 text-white">
                  <span className="text-[11px] text-[#bec6e0]">Dokumenter Investigatif • Seri Konservasi Laut</span>
                  <h4 className="font-serif text-lg font-bold text-white group-hover:text-primary-fixed-dim transition-colors leading-snug">
                    Menjaga Napas Terumbu Karang: Perjuangan Generasi Ketiga Nelayan Batu Karas
                  </h4>
                </div>
              </article>

              {/* Photo Essay Card 1 */}
              <article className="relative rounded-xl overflow-hidden group min-h-[260px] flex flex-col justify-end bg-black">
                <Image
                  src="https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop"
                  alt="Foto esai penenun kriya"
                  fill
                  sizes="300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-[#213145]/90 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1">
                    <Camera className="h-3 w-3" /> 18 FOTO
                  </span>
                </div>
                <div className="relative z-10 p-4 flex flex-col gap-1 text-white">
                  <span className="text-[11px] text-[#bec6e0]">Esai Foto Budaya</span>
                  <h4 className="font-serif text-sm font-bold text-white group-hover:text-primary-fixed-dim transition-colors leading-snug">
                    Detak Ritmis Mesin Bordir Manual yang Bertahan di Bilangan Kawalu
                  </h4>
                </div>
              </article>

              {/* Photo Essay Card 2 */}
              <article className="relative rounded-xl overflow-hidden group min-h-[260px] flex flex-col justify-end bg-black">
                <Image
                  src="https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=600&auto=format&fit=crop"
                  alt="Lensa lanskap alun-alun"
                  fill
                  sizes="300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-[#213145]/90 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1">
                    <Camera className="h-3 w-3" /> 12 FOTO
                  </span>
                </div>
                <div className="relative z-10 p-4 flex flex-col gap-1 text-white">
                  <span className="text-[11px] text-[#bec6e0]">Lensa Lanskap Kota</span>
                  <h4 className="font-serif text-sm font-bold text-white group-hover:text-primary-fixed-dim transition-colors leading-snug">
                    Gemintang di Atap Priangan: Refleksi Kehidupan Warga Menjelang Tengah Malam
                  </h4>
                </div>
              </article>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
