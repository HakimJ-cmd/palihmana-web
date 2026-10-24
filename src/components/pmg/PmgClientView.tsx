"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Gamepad2,
  Sparkles,
  Trophy,
  Flame,
  Star,
  Layers,
  Cpu,
  Tv,
  ExternalLink,
  ChevronRight,
  Share2,
  Calendar,
  Users,
  Compass,
  MapPin,
  Clock,
  Instagram,
} from "lucide-react";
import { PmgItem } from "@/modules/pmg/queries";
import { PmgCategory, PMG_CATEGORY_LABELS, SITE_CONFIG } from "@/lib/constants";
import { formatDateShort } from "@/lib/utils";

interface PmgClientViewProps {
  initialItems: PmgItem[];
}

export function PmgClientView({ initialItems }: PmgClientViewProps) {
  const [items, setItems] = useState<PmgItem[]>(initialItems);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<PmgItem | null>(null);

  const featuredItem = items.find((i) => i.featured) || items[0];

  const filteredItems = items.filter((item) => {
    const matchesTab = activeTab === "ALL" || item.category === activeTab;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.platform && item.platform.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  return (
    <div className="w-full bg-[#080B10] text-[#E2E8F0] min-h-screen selection:bg-amber-400 selection:text-black">
      {/* ─── 1. Futuristic Cyber HUD Header ───────────────────────── */}
      <section className="relative w-full border-b border-cyan-500/20 bg-gradient-to-b from-[#0F1726] via-[#090D15] to-[#080B10] overflow-hidden pt-8 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        {/* Subtle geometric grid background */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #00F2FE 1px, transparent 1px), linear-gradient(to bottom, #00F2FE 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-7xl mx-auto flex flex-col gap-6">
          {/* Top Status Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="text-cyan-400 font-bold uppercase tracking-widest text-[11px]">
                [SYS.ONLINE] PALIHMANA GAMING & TOYS ZONE
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-400 hidden sm:inline">OFFICIAL CHANNELS:</span>
              <a
                href="https://www.instagram.com/pmg.id/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/40 text-amber-300 font-bold hover:bg-amber-500/20 transition-all flex items-center gap-1.5"
              >
                <span>IG @pmg.id</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://www.tiktok.com/@palihmana.id"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 font-bold hover:bg-cyan-500/20 transition-all flex items-center gap-1.5"
              >
                <span>TikTok @palihmana.id</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Main Hero Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
                <Gamepad2 className="h-4 w-4" /> RUANG GAMER & KOMUNITAS HOBI PRIANGAN
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-sans uppercase">
                PALIHMANA <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">GAMING</span> & TOYS
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                Review game jujur tanpa sponsor terselubung, panduan merakit gunpla & diecast Tasikmalaya, turnamen esports lokal, info rental PS5, serta komunitas mabar seru.
              </p>
            </div>

            {/* Quick stats counter */}
            <div className="grid grid-cols-3 gap-3 shrink-0 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="px-3 py-1.5 text-center">
                <p className="text-xl font-black text-amber-400 font-mono">100%</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Independent</p>
              </div>
              <div className="px-3 py-1.5 text-center border-x border-slate-800">
                <p className="text-xl font-black text-cyan-400 font-mono">64+</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Esports Team</p>
              </div>
              <div className="px-3 py-1.5 text-center">
                <p className="text-xl font-black text-purple-400 font-mono">5 Rubrik</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Game & Mainan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 2. Featured Showcase Card (Hero Drop) ──────────────────── */}
      {featuredItem && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-10">
          <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-[#111827] via-[#0E1524] to-[#0A0E1A] p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Image Showcase */}
              <div className="lg:col-span-5 relative aspect-video sm:aspect-4/3 rounded-xl overflow-hidden border border-slate-700/80 shadow-lg">
                <img
                  src={featuredItem.coverImage}
                  alt={featuredItem.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-amber-400 text-black text-xs font-black uppercase tracking-wider shadow-md">
                    FEATURED DROP 🔥
                  </span>
                  {featuredItem.platform && (
                    <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-xs text-white text-xs font-mono border border-white/20">
                      {featuredItem.platform}
                    </span>
                  )}
                </div>

                {featuredItem.rating && (
                  <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-amber-400/50 flex items-center gap-1.5 text-amber-300 font-bold text-sm">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>{featuredItem.rating.toFixed(1)} / 10</span>
                  </div>
                )}
              </div>

              {/* Right Details */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                    {PMG_CATEGORY_LABELS[featuredItem.category] || featuredItem.category}
                  </span>
                  <span className="text-slate-400 font-mono">•</span>
                  <span className="text-slate-400 font-mono">{formatDateShort(featuredItem.publishedAt)}</span>
                  <span className="text-slate-400 font-mono">•</span>
                  <span className="text-slate-300 font-semibold">{featuredItem.author}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white hover:text-amber-400 transition-colors leading-tight">
                  {featuredItem.title}
                </h2>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
                  {featuredItem.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {featuredItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <button
                    onClick={() => setSelectedItem(featuredItem)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2"
                  >
                    <span>Baca Ulasan Lengkap</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>

                  <a
                    href="https://www.instagram.com/pmg.id/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <Instagram className="h-4 w-4 text-amber-400" />
                    <span>Diskusikan di @pmg.id</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── 3. Filter Nav & Search ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-5">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeTab === "ALL"
                  ? "bg-amber-400 text-black shadow-md"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              Semua Drop ({items.length})
            </button>
            <button
              onClick={() => setActiveTab("GAME_REVIEW")}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeTab === "GAME_REVIEW"
                  ? "bg-amber-400 text-black shadow-md"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              🎮 Game Review
            </button>
            <button
              onClick={() => setActiveTab("TOYS_HOBBY")}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeTab === "TOYS_HOBBY"
                  ? "bg-amber-400 text-black shadow-md"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              🤖 Mainan & Koleksi
            </button>
            <button
              onClick={() => setActiveTab("ESPORTS_EVENT")}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeTab === "ESPORTS_EVENT"
                  ? "bg-amber-400 text-black shadow-md"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              🏆 Esports Lokal
            </button>
            <button
              onClick={() => setActiveTab("GEAR_TECH")}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeTab === "GEAR_TECH"
                  ? "bg-amber-400 text-black shadow-md"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              ⚡ Gaming Gear
            </button>
            <button
              onClick={() => setActiveTab("COMMUNITY")}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeTab === "COMMUNITY"
                  ? "bg-amber-400 text-black shadow-md"
                  : "bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              👥 Spot & Mabar
            </button>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Cari game, tamiya, gunpla..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </section>

      {/* ─── 4. Main Content Grid ───────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-sm">Tidak ada konten yang sesuai dengan pencarian.</p>
            <button
              onClick={() => {
                setActiveTab("ALL");
                setSearchQuery("");
              }}
              className="mt-3 px-4 py-2 rounded-lg bg-amber-400 text-black font-bold text-xs uppercase"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="group flex flex-col rounded-xl border border-slate-800 hover:border-amber-500/50 bg-[#0D121D] hover:bg-[#111726] transition-all duration-300 overflow-hidden shadow-lg hover:shadow-amber-500/5"
              >
                {/* Image Cover */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-black/80 text-amber-400 border border-amber-400/40 backdrop-blur-xs">
                      {PMG_CATEGORY_LABELS[item.category] || item.category}
                    </span>
                  </div>

                  {item.rating && (
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-1 rounded bg-black/80 backdrop-blur-xs border border-white/20 flex items-center gap-1 text-[11px] font-bold text-amber-300">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{item.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
                      <span className="text-cyan-400 font-semibold">{item.platform || "Tasikmalaya"}</span>
                      <span>{formatDateShort(item.publishedAt)}</span>
                    </div>

                    <h3
                      onClick={() => setSelectedItem(item)}
                      className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 cursor-pointer leading-snug"
                    >
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  {/* Footer & Action */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Users className="h-3.5 w-3.5 text-slate-500" />
                      <span>{item.author}</span>
                    </div>

                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Detail</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ─── 5. Spot Hobi & Arena Komunitas Tasikmalaya ─────────────── */}
      <section className="w-full bg-[#06080C] border-t border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-2">
                <MapPin className="h-3 w-3" /> DIRECTORY OF LOCAL SPOTS
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                Spot Rental, Mainan Hobi & Arena Mabar Tasikmalaya
              </h2>
            </div>
            <a
              href="https://www.instagram.com/pmg.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1"
            >
              Usulkan Tempatmu ke @pmg.id ↗
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-[#0B0F19] flex flex-col gap-2">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">[RENTAL PS5]</span>
              <h4 className="font-bold text-white text-sm">Zone VIP Rental & Lounge</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Jl. Cihideung No. 88. 8 Unit PS5 Layar 4K HDR, sofa nyaman, snack bar & turnamen mini mingguan.
              </p>
              <div className="mt-auto pt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>09:00 - 24:00 WIB</span>
                <span className="text-amber-400 font-bold">Rp15k / jam</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-[#0B0F19] flex flex-col gap-2">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">[TAMIYA MINI 4WD]</span>
              <h4 className="font-bold text-white text-sm">Dadaha Raceway Arena</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kompleks Olahraga Dadaha. Sirkuit 5-lane teknikal, pit stop racer, dan penjualan spare part original.
              </p>
              <div className="mt-auto pt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Sabtu & Minggu</span>
                <span className="text-emerald-400 font-bold">Free Track</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-[#0B0F19] flex flex-col gap-2">
              <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">[GUNPLA & DIECAST]</span>
              <h4 className="font-bold text-white text-sm">Priangan Hobby Shop</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Plaza Asia Lantai 1. Koleksi resmi Bandai Gunpla, cat Tamiya, tools pemula, serta Hot Wheels blister.
              </p>
              <div className="mt-auto pt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>10:00 - 21:30 WIB</span>
                <span className="text-cyan-400 font-bold">Koleksi Lengkap</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-[#0B0F19] flex flex-col gap-2">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">[BOARD GAME & TCG]</span>
              <h4 className="font-bold text-white text-sm">Warung Mabar & Kartu Tasik</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kawasan Tawang. Arena bermain Catan, Werewolf, Pokemon TCG, dan One Piece Card Game dengan kopi santai.
              </p>
              <div className="mt-auto pt-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>14:00 - 23:00 WIB</span>
                <span className="text-amber-400 font-bold">Mabar Rutin</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. Big Social Media Banner (@pmg.id) ───────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 via-purple-600/15 to-cyan-500/20 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-2xl">
            <span className="px-2.5 py-1 rounded bg-amber-400 text-black text-xs font-black uppercase tracking-wider">
              KOMUNITAS INSTAGRAM RESMI
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-2">
              Follow Akun Instagram Resmi @pmg.id
            </h3>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed">
              Dapatkan reel unboxing game & mainan, meme lokal, polling hero favorit, clip mabar lucu, dan pengumuman turnamen teranyar di Tasikmalaya.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <a
              href="https://www.instagram.com/pmg.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm uppercase tracking-wider text-center transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Instagram className="h-4 w-4" />
              <span>Follow @pmg.id ↗</span>
            </a>
            <Link
              href="/"
              className="w-full sm:w-auto px-4 py-3 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-white font-semibold text-xs text-center transition-colors"
            >
              Kembali ke Portal Palihmana
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Item Detail Modal ──────────────────────────────────────── */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#0D121D] text-white rounded-2xl border border-amber-500/40 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="relative aspect-video w-full bg-slate-900 shrink-0">
              <img
                src={selectedItem.coverImage}
                alt={selectedItem.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/70 text-white hover:bg-black flex items-center justify-center text-sm font-bold border border-white/20 transition-all"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-amber-400 text-black text-xs font-black uppercase">
                  {PMG_CATEGORY_LABELS[selectedItem.category] || selectedItem.category}
                </span>
                {selectedItem.platform && (
                  <span className="px-2.5 py-1 rounded bg-black/80 text-white text-xs font-mono border border-white/20">
                    {selectedItem.platform}
                  </span>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Penulis: {selectedItem.author}</span>
                <span>{formatDateShort(selectedItem.publishedAt)}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
                {selectedItem.title}
              </h2>

              {selectedItem.rating && (
                <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-mono uppercase">SKOR ULASAN PMG:</span>
                  <div className="flex items-center gap-1.5 text-amber-400 font-black text-base">
                    <Star className="h-5 w-5 fill-amber-400" />
                    <span>{selectedItem.rating.toFixed(1)} / 10</span>
                  </div>
                </div>
              )}

              <p className="text-sm text-slate-300 font-sans leading-relaxed border-l-2 border-amber-400 pl-4 py-1 italic bg-amber-400/5">
                {selectedItem.summary}
              </p>

              <div className="text-sm text-slate-200 leading-relaxed space-y-4 pt-2">
                {selectedItem.content}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-400 mr-2">Topik:</span>
                {selectedItem.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-slate-300 border border-slate-700"
                  >
                    #{t}
                  </span>
                ))}
              </div>

              {/* Share / Social Action */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
                <a
                  href="https://www.instagram.com/pmg.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-amber-500 text-black font-bold uppercase flex items-center gap-1.5 hover:bg-amber-400 transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                  <span>Kunjungi @pmg.id</span>
                </a>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
