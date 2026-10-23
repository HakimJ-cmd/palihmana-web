"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, Vote, CheckCircle, BarChart3 } from "lucide-react";
import { ArticleItem } from "@/types";
import { PILAR_SLUGS } from "@/lib/constants";

interface BreakingTickerProps {
  articles: ArticleItem[];
}

export function BreakingNewsTicker({ articles }: BreakingTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const items = articles.length > 0 ? articles.slice(0, 4) : [];

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  const currentItem = items[currentIndex];
  const pilarSlug = PILAR_SLUGS[currentItem.pilar] || "utility";

  return (
    <div className="w-full mb-6">
      <div className="bg-surface dark:bg-[#0E2226] border border-line shadow-xs rounded-xl p-2 flex flex-col sm:flex-row items-center gap-3 overflow-hidden">
        {/* Badge Indicator */}
        <div className="flex items-center gap-2 bg-primary px-3 py-1.5 rounded-lg text-white shrink-0 self-stretch sm:self-auto justify-center">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider">KILAS TERKINI</span>
        </div>

        {/* Carousel Content */}
        <div className="relative flex-1 overflow-hidden h-7 w-full flex items-center">
          <div className="flex items-center justify-between text-xs sm:text-sm text-ink w-full truncate">
            <div className="flex items-center gap-2 truncate">
              <span className="px-1.5 py-0.5 rounded-[4px] bg-[#eff4ff] dark:bg-[#1E314B] text-primary text-[10px] font-bold">
                TERBARU
              </span>
              <Link
                href={`/${pilarSlug}/${currentItem.slug}`}
                className="font-medium hover:text-primary transition-colors truncate"
              >
                {currentItem.title}
              </Link>
            </div>
            <span className="text-ink-muted text-[11px] hidden md:inline ml-3 shrink-0">
              {currentItem.readingMinutes || 4} mnt baca
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="hidden lg:flex items-center gap-1 shrink-0 text-ink-muted">
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)}
            className="p-1 hover:bg-surface-alt rounded transition-colors"
            aria-label="Sebelumnya"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setCurrentIndex((prev) => (prev + 1) % items.length)}
            className="p-1 hover:bg-surface-alt rounded transition-colors"
            aria-label="Selanjutnya"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <span className="text-line mx-1">|</span>
          <Link
            href="/utility"
            className="text-[11px] font-bold text-primary hover:underline flex items-center gap-0.5"
          >
            Semua Indeks <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export function CivicPollWidget() {
  const [selected, setSelected] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selected) {
      setHasVoted(true);
    }
  };

  return (
    <div className="bg-surface dark:bg-[#0E2226] rounded-xl p-5 border border-line/80 shadow-xs flex flex-col gap-3">
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <Vote className="h-5 w-5 text-primary" />
          <h4 className="font-sans text-sm font-bold text-ink uppercase tracking-wide">
            Jajak Pendapat Warga
          </h4>
        </div>
        <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-[4px]">
          AKTIF
        </span>
      </div>

      <p className="text-xs sm:text-sm text-ink font-semibold leading-snug">
        Menurut Anda, apakah transportasi umum & konektivitas jalur Tasikmalaya-Bandung (termasuk Tol Getaci) sudah mendesak untuk diakselerasi?
      </p>

      {!hasVoted ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-1">
          <label className="flex items-center gap-3 p-2.5 rounded-lg bg-[#F0F7F5] dark:bg-[#071518] hover:bg-[#E6F2EF] dark:hover:bg-[#163035] cursor-pointer transition-colors text-xs text-ink">
            <input
              type="radio"
              name="poll"
              value="sangat_mendesak"
              checked={selected === "sangat_mendesak"}
              onChange={() => setSelected("sangat_mendesak")}
              className="accent-primary"
            />
            <span>Sangat mendesak, pangkas waktu tempuh & dorong ekonomi</span>
          </label>

          <label className="flex items-center gap-3 p-2.5 rounded-lg bg-[#F0F7F5] dark:bg-[#071518] hover:bg-[#E6F2EF] dark:hover:bg-[#163035] cursor-pointer transition-colors text-xs text-ink">
            <input
              type="radio"
              name="poll"
              value="cukup_penting"
              checked={selected === "cukup_penting"}
              onChange={() => setSelected("cukup_penting")}
              className="accent-primary"
            />
            <span>Penting, namun utamakan transparansi ganti rugi lahan</span>
          </label>

          <label className="flex items-center gap-3 p-2.5 rounded-lg bg-[#eff4ff] dark:bg-[#0b1c30] hover:bg-[#e5eeff] dark:hover:bg-[#1E314B] cursor-pointer transition-colors text-xs text-ink">
            <input
              type="radio"
              name="poll"
              value="fokus_jalan_lokal"
              checked={selected === "fokus_jalan_lokal"}
              onChange={() => setSelected("fokus_jalan_lokal")}
              className="accent-primary"
            />
            <span>Lebih baik prioritaskan perbaikan jalan kabupaten/kota</span>
          </label>

          <div className="flex items-center justify-between mt-2 pt-2">
            <button
              type="submit"
              disabled={!selected}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors shadow-xs"
            >
              Kirim Suara Saya
            </button>
            <span className="text-[11px] text-ink-muted">4.892 Warga Bersuara</span>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-2.5 mt-1 pt-1">
          <div>
            <div className="flex justify-between text-xs text-ink mb-1">
              <span>Sangat mendesak</span>
              <span className="font-bold text-primary">68%</span>
            </div>
            <div className="w-full bg-[#eff4ff] dark:bg-[#0b1c30] rounded-full h-2">
              <div className="bg-primary h-2 rounded-full" style={{ width: "68%" }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-ink mb-1">
              <span>Utamakan transparansi lahan</span>
              <span className="font-bold">22%</span>
            </div>
            <div className="w-full bg-[#eff4ff] dark:bg-[#0b1c30] rounded-full h-2">
              <div className="bg-[#565e74] h-2 rounded-full" style={{ width: "22%" }}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-ink mb-1">
              <span>Prioritaskan jalan lokal</span>
              <span className="font-bold">10%</span>
            </div>
            <div className="w-full bg-[#eff4ff] dark:bg-[#0b1c30] rounded-full h-2">
              <div className="bg-line h-2 rounded-full" style={{ width: "10%" }}></div>
            </div>
          </div>

          <p className="text-[11px] text-center text-emerald-600 dark:text-emerald-400 font-medium mt-2">
            ✓ Terima kasih atas partisipasi civic Anda!
          </p>
        </div>
      )}
    </div>
  );
}
