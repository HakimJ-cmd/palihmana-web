"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, Sun, Moon, Bookmark } from "lucide-react";
import { PILAR_SLUGS, PILAR_LABELS } from "@/lib/constants";
import { Pilar } from "@prisma/client";

const PILAR_NAV = [
  { slug: "utility", label: "Utility" },
  { slug: "understand", label: "Understand" },
  { slug: "opini", label: "Opini" },
  { slug: "discover", label: "Discover" },
  { slug: "people", label: "People" },
  { slug: "catatan-lapangan", label: "Catatan Lapangan" },
  { slug: "kalender", label: "Kalender" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.getAttribute("data-theme") === "dark";
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("palihmana-theme", nextTheme);
    setIsDark(!isDark);
  };

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-line bg-bg/95 backdrop-blur-sm transition-colors">
      {/* Top Navbar */}
      <div className="mx-auto flex h-14 max-w-page items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Mobile Menu Button & Desktop Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded text-ink hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-primary lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu navigasi"}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link
            href="/"
            className="group flex items-center gap-2 font-serif text-xl font-bold tracking-tight text-primary transition-opacity hover:opacity-90 sm:text-2xl"
          >
            <span className="text-primary group-hover:text-primary-hover">PALIHMANA</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">.ID</span>
          </Link>
        </div>

        {/* Center / Desktop Links */}
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navigasi Utama">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/" ? "font-semibold text-primary" : "text-ink-muted"
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
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "font-semibold text-primary" : "text-ink-muted"
                }`}
              >
                {p.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Search & Theme Toggle */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/simpanan"
            className="flex h-10 w-10 items-center justify-center rounded text-ink hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="Artikel tersimpan"
            title="Simpanan Saya"
          >
            <Bookmark className="h-5 w-5" />
          </Link>

          <Link
            href="/cari"
            className="flex h-10 w-10 items-center justify-center rounded text-ink hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-primary"
            aria-label="Cari artikel dan informasi"
          >
            <Search className="h-5 w-5" />
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded text-ink hover:bg-surface-alt focus-visible:outline-2 focus-visible:outline-primary"
            aria-label={isDark ? "Beralih ke mode terang" : "Beralih ke mode gelap"}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Subnav / Pilar Tab Scrollbar (Mobile & Tablet) */}
      <div className="border-t border-line/60 bg-surface lg:hidden">
        <div className="mx-auto flex max-w-page gap-4 overflow-x-auto px-4 py-2.5 text-xs font-medium no-scrollbar">
          <Link
            href="/"
            className={`whitespace-nowrap px-1 py-0.5 transition-colors ${
              pathname === "/"
                ? "border-b-2 border-primary font-bold text-primary"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            Semua
          </Link>
          {PILAR_NAV.map((p) => {
            const href = `/${p.slug}`;
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={p.slug}
                href={href}
                className={`whitespace-nowrap px-1 py-0.5 transition-colors ${
                  isActive
                    ? "border-b-2 border-primary font-bold text-primary"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                {p.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-14 z-50 bg-black/40 backdrop-blur-xs lg:hidden">
          <div className="flex h-full w-full max-w-xs flex-col border-r border-line bg-surface p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between border-b border-line pb-4">
              <span className="font-serif text-lg font-bold text-ink">Navigasi</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded p-1 text-ink-muted hover:text-ink"
                aria-label="Tutup menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-3 font-medium text-ink">
              <Link
                href="/"
                className={`rounded px-3 py-2 text-base transition-colors hover:bg-surface-alt ${
                  pathname === "/" ? "bg-primary-tint font-semibold text-primary" : ""
                }`}
              >
                Beranda
              </Link>
              <div className="my-1 border-t border-line/60" />
              <div className="px-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                Pilar Konten
              </div>
              {PILAR_NAV.map((p) => {
                const href = `/${p.slug}`;
                const isActive = pathname.startsWith(href);
                return (
                  <Link
                    key={p.slug}
                    href={href}
                    className={`rounded px-3 py-2 text-base transition-colors hover:bg-surface-alt ${
                      isActive ? "bg-primary-tint font-semibold text-primary" : ""
                    }`}
                  >
                    {p.label}
                  </Link>
                );
              })}

              <div className="my-2 border-t border-line/60" />
              <Link
                href="/simpanan"
                className="flex items-center gap-2 rounded px-3 py-2 text-base text-ink hover:bg-surface-alt"
              >
                <Bookmark className="h-4 w-4" /> Simpanan Saya
              </Link>
              <Link
                href="/cari"
                className="flex items-center gap-2 rounded px-3 py-2 text-base text-ink hover:bg-surface-alt"
              >
                <Search className="h-4 w-4" /> Cari Informasi
              </Link>
            </nav>

            <div className="mt-auto border-t border-line pt-4 text-xs text-ink-muted">
              <p className="font-serif italic">Media digital lokal Tasikmalaya</p>
              <p className="mt-1">Utility · Explanatory · Community</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
