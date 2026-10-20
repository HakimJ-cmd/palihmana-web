"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Menu, X, Sun, Moon, Bookmark, Calendar, CloudSun, Megaphone, Sparkles, BookOpen, User } from "lucide-react";
import { PILAR_SLUGS, PILAR_LABELS, SITE_CONFIG } from "@/lib/constants";

const PILAR_NAV = [
  { slug: "utility", label: "Utility & Panduan" },
  { slug: "understand", label: "Understand & Konteks" },
  { slug: "opini", label: "Kolom Opini" },
  { slug: "discover", label: "Budaya & Kuliner" },
  { slug: "people", label: "Sosok & Tokoh" },
  { slug: "catatan-lapangan", label: "Catatan Lapangan" },
  { slug: "kalender", label: "Kalender Event" },
];

const TRENDING_TAGS = [
  { tag: "#TolGetaci", href: "/cari?q=Tol+Getaci" },
  { tag: "#PilkadaJabar", href: "/cari?q=Pilkada" },
  { tag: "#BordirTasik", href: "/cari?q=Bordir" },
  { tag: "#FestivalKuliner", href: "/cari?q=Kuliner" },
  { tag: "#WisataLokal", href: "/cari?q=Wisata" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDateStr, setCurrentDateStr] = useState("Rabu, 24 Oktober 2026");

  useEffect(() => {
    const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark" || document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    try {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      setCurrentDateStr(now.toLocaleDateString("id-ID", options));
    } catch {
      // Fallback
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    localStorage.setItem("palihmana-theme", nextTheme);
    setIsDark(!isDark);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/cari?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] dark:bg-[#132238] dark:shadow-none border-b border-line/80">
      {/* ─── Top Utility Bar ────────────────────────────────────────── */}
      <div className="w-full bg-[#f8f9ff] dark:bg-[#0b1c30] border-b border-[#e5eeff] dark:border-[#1E314B] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto h-9 flex items-center justify-between text-[11px] sm:text-xs text-ink-muted">
          {/* Left: Date & Weather */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-medium text-ink">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>{currentDateStr}</span>
            </div>
            <span className="text-line hidden sm:inline">|</span>
            <div className="hidden sm:flex items-center gap-1.5 text-ink-muted">
              <CloudSun className="h-3.5 w-3.5 text-amber-600" />
              <span>Tasikmalaya & Priangan 28°C Cerah Berawan</span>
            </div>
          </div>

          {/* Right: Trending Topics */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded-[4px] bg-primary text-white text-[10px] font-bold uppercase tracking-wider">
                TRENDING
              </span>
              <div className="hidden md:flex items-center gap-2 text-ink">
                {TRENDING_TAGS.map((t, idx) => (
                  <React.Fragment key={t.tag}>
                    <Link href={t.href} className="hover:text-primary transition-colors">
                      {t.tag}
                    </Link>
                    {idx < TRENDING_TAGS.length - 1 && <span className="text-line">•</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-line/60">
              <button
                type="button"
                onClick={toggleTheme}
                className="p-1 text-ink-muted hover:text-primary transition-colors"
                title={isDark ? "Mode Terang" : "Mode Gelap"}
              >
                {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Middle Brand & Search Bar ─────────────────────────────── */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-3 bg-white dark:bg-[#132238]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 lg:gap-8">
          {/* Mobile Menu Button + Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-ink hover:bg-surface-alt lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Menu Navigasi"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="flex flex-col">
              <div className="flex items-baseline gap-1 font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-primary leading-none">
                <span>PALIHMANA</span>
                <span className="text-ink dark:text-white font-light text-xl sm:text-2xl">.ID</span>
              </div>
              <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-ink-muted font-semibold mt-1">
                Suara & Inspirasi Tatar Pasundan
              </span>
            </Link>
          </div>

          {/* Search Box Desktop */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-auto flex-col">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berita daerah, regulasi, investigasi, atau topik hangat..."
                className="w-full bg-[#eff4ff] dark:bg-[#0b1c30] text-xs sm:text-sm text-ink placeholder-ink-muted/70 pl-4 pr-24 py-2 rounded-lg border border-[#e5eeff] dark:border-[#2C3E55] focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="absolute right-1 px-3 py-1.5 bg-primary text-white rounded-md text-xs font-semibold hover:bg-primary-hover transition-colors flex items-center gap-1 shadow-xs"
              >
                <Search className="h-3.5 w-3.5" />
                <span>Cari</span>
              </button>
            </form>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-ink-muted">
              <span className="text-primary font-bold">Populer:</span>
              <Link href="/cari?q=Tol+Getaci" className="hover:underline">Tol Getaci</Link>
              <span>,</span>
              <Link href="/cari?q=KTP+Elektronik" className="hover:underline">Panduan KTP</Link>
              <span>,</span>
              <Link href="/cari?q=UMKM+Tasik" className="hover:underline">Bordir Kawalu</Link>
              <span>,</span>
              <Link href="/cari?q=Alun-alun" className="hover:underline">Event Dadaha</Link>
            </div>
          </div>

          {/* Quick Actions Desktop */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/pedoman-editorial"
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#dce9ff] dark:bg-[#1E314B] text-ink dark:text-white text-xs font-semibold hover:bg-primary hover:text-white transition-colors"
            >
              <BookOpen className="h-4 w-4 text-primary" />
              <span>Pedoman Editorial</span>
            </Link>

            <Link
              href="/simpanan"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-ink-muted hover:text-primary hover:bg-surface-alt transition-colors text-xs font-medium"
              title="Artikel Tersimpan"
            >
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Simpanan</span>
            </Link>

            <Link
              href="/akun"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-ink-muted hover:text-primary hover:bg-surface-alt transition-colors text-xs font-medium"
              title="Akun Baraya"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Akun</span>
            </Link>

            <div className="flex items-center gap-2 pl-2 border-l border-line/60">
              <Link
                href="/kontak"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white hover:text-white hover:bg-primary-hover transition-colors shadow-xs"
              >
                <Megaphone className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Kirim Info Warga</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bottom Navigation Bar (Dark Navy Inverse Surface) ─────── */}
      <div className="w-full bg-[#213145] text-[#eaf1ff] px-4 sm:px-6 lg:px-8 border-b-2 border-primary">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex items-center overflow-x-auto py-0 no-scrollbar" aria-label="Navigasi Kategori">
            <Link
              href="/"
              className={`px-3.5 py-2.5 text-xs sm:text-sm transition-colors whitespace-nowrap font-medium ${
                pathname === "/"
                  ? "bg-primary text-white font-bold"
                  : "text-[#eaf1ff]/90 hover:bg-white/10 hover:text-white"
              }`}
            >
              Beranda
            </Link>
            {PILAR_NAV.map((p) => {
              const href = `/${p.slug}`;
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={p.slug}
                  href={href}
                  className={`px-3.5 py-2.5 text-xs sm:text-sm transition-colors whitespace-nowrap font-medium ${
                    isActive
                      ? "bg-primary text-white font-bold"
                      : "text-[#eaf1ff]/90 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {p.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2 pl-4">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-medium text-emerald-300 uppercase tracking-wider">
              Edisi Tasikmalaya
            </span>
          </div>
        </div>
      </div>

      {/* ─── Mobile Menu Drawer ──────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[110px] z-50 bg-black/50 backdrop-blur-xs lg:hidden">
          <div className="flex h-full w-full max-w-xs flex-col border-r border-line bg-white dark:bg-[#132238] p-5 shadow-2xl overflow-y-auto">
            {/* Search form mobile */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berita atau pilar..."
                  className="w-full rounded-lg border border-line bg-[#eff4ff] dark:bg-[#0b1c30] px-3 py-2 text-xs text-ink placeholder-ink-muted focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 rounded bg-primary p-1.5 text-white"
                >
                  <Search className="h-3 w-3" />
                </button>
              </div>
            </form>

            <nav className="flex flex-col gap-1 text-sm font-medium text-ink">
              <Link
                href="/"
                className={`rounded-lg px-3 py-2 transition-colors ${
                  pathname === "/" ? "bg-primary text-white font-bold" : "hover:bg-surface-alt"
                }`}
              >
                Beranda
              </Link>
              <div className="my-2 border-t border-line/60" />
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                Pilar Jurnalisme & Fitur
              </div>
              {PILAR_NAV.map((p) => {
                const href = `/${p.slug}`;
                const isActive = pathname.startsWith(href);
                return (
                  <Link
                    key={p.slug}
                    href={href}
                    className={`rounded-lg px-3 py-2 transition-colors ${
                      isActive ? "bg-primary text-white font-bold" : "hover:bg-surface-alt"
                    }`}
                  >
                    {p.label}
                  </Link>
                );
              })}

              <div className="my-2 border-t border-line/60" />
              <Link
                href="/akun"
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-surface-alt text-xs"
              >
                <User className="h-4 w-4 text-primary" />
                <span>Akun Saya & Masuk</span>
              </Link>
              <Link
                href="/simpanan"
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-surface-alt text-xs"
              >
                <Bookmark className="h-4 w-4 text-primary" />
                <span>Simpanan Saya</span>
              </Link>
              <Link
                href="/pedoman-editorial"
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-surface-alt text-xs"
              >
                <BookOpen className="h-4 w-4 text-primary" />
                <span>Pedoman Editorial</span>
              </Link>
              <Link
                href="/kontak"
                className="flex items-center gap-2 rounded-lg px-3 py-2 bg-primary/10 text-primary font-bold text-xs hover:bg-primary/20 transition-colors"
              >
                <Megaphone className="h-4 w-4" />
                <span>Kirim Info & Usulan Warga</span>
              </Link>
            </nav>

            <div className="mt-auto border-t border-line pt-4 text-xs text-ink-muted">
              <p className="font-serif font-bold text-ink">PALIHMANA.ID</p>
              <p className="mt-0.5 text-[11px]">Jurnalisme Presisi & Solutif Tatar Pasundan</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
