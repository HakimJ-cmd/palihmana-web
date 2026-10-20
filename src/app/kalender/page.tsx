"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Search, 
  Filter, 
  PlusCircle, 
  Bookmark, 
  ExternalLink, 
  Ticket, 
  CheckCircle2, 
  Clock, 
  Share2, 
  AlertCircle,
  X
} from "lucide-react";
import { FALLBACK_EVENTS, EventItem } from "@/modules/events/queries";

export default function EventsCalendarPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState<"ALL" | "FREE" | "PAID">("ALL");
  const [activeDateIndex, setActiveDateIndex] = useState(2); // Kamis (Hari Ini)
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const events = FALLBACK_EVENTS;

  // Filter events
  const filteredEvents = events.filter((evt) => {
    if (selectedPrice === "FREE" && evt.priceType !== "FREE") return false;
    if (selectedPrice === "PAID" && evt.priceType !== "PAID") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = evt.title.toLowerCase().includes(q) || 
                    evt.description.toLowerCase().includes(q) || 
                    evt.location.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const categories = [
    { id: "all", label: "Semua Kategori (48)" },
    { id: "budaya", label: "Seni & Budaya (14)" },
    { id: "kuliner", label: "Festival Kuliner & UMKM (12)" },
    { id: "musik", label: "Konser Musik (8)" },
    { id: "expo", label: "Pameran & Expo (6)" },
    { id: "workshop", label: "Seminar & Workshop (5)" },
  ];

  const weekDays = [
    { day: "SEN", date: "21", count: 0 },
    { day: "SEL", date: "22", count: 1 },
    { day: "RAB", date: "23", count: 2 },
    { day: "KAM", date: "24", count: 3, isToday: true },
    { day: "JUM", date: "25", count: 1 },
    { day: "SAB", date: "26", count: 4 },
    { day: "MIN", date: "27", count: 2 },
  ];

  return (
    <div className="w-full bg-[#f8f9ff] dark:bg-[#0b1c30] min-h-screen">
      {/* ─── Breadcrumb ─────────────────────────────────────────────── */}
      <section className="w-full bg-white dark:bg-[#132238] py-2.5 px-4 sm:px-6 lg:px-8 border-b border-line">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-ink-muted">
          <nav className="flex items-center gap-1.5">
            <Link href="/" className="hover:text-primary transition-colors">
              Beranda
            </Link>
            <span className="text-line">/</span>
            <span className="text-primary font-semibold">Kalender Event & Agenda Pasundan</span>
          </nav>
          <span className="hidden sm:inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" /> Kurasi Terverifikasi Dewan Redaksi
          </span>
        </div>
      </section>

      {/* ─── Section 1: Page Header & Search Bar ─────────────────────── */}
      <section className="w-full bg-white dark:bg-[#132238] shadow-xs border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-primary text-xs uppercase font-bold tracking-widest mb-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span>Panduan Budaya & Agenda Publik Jawa Barat</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-ink font-bold tracking-tight">
                Agenda Pasundan: <span className="text-primary italic">Kalender Acara</span> & Festival
              </h1>
              <p className="text-xs sm:text-sm text-ink-muted mt-2 leading-relaxed">
                Pusat direktori resmi perayaan tradisi, simposium pembangunan, etalase kriya UMKM Priangan, konser musik kreasi, dan ruang temu komunitas di 27 kabupaten dan kota se-Jawa Barat.
              </p>
            </div>

            <div className="shrink-0">
              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="px-5 py-3 rounded-lg bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary-hover transition-colors shadow-xs flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Kirim Info Agenda Warga</span>
              </button>
            </div>
          </div>

          {/* Search & Regional Filter Multi-bar */}
          <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#0b1c30] border border-line">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <div className="md:col-span-5 relative flex items-center">
                <Search className="absolute left-3.5 h-4 w-4 text-ink-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari festival, pameran UMKM, lokasi kota, nama penampil..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#132238] text-xs sm:text-sm text-ink placeholder:text-ink-muted rounded-lg border border-line focus:outline-none focus:border-primary shadow-xs"
                />
              </div>

              <div className="md:col-span-4 relative flex items-center">
                <MapPin className="absolute left-3.5 h-4 w-4 text-primary" />
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 bg-white dark:bg-[#132238] text-xs sm:text-sm text-ink rounded-lg border border-line focus:outline-none focus:border-primary appearance-none cursor-pointer shadow-xs"
                >
                  <option value="all">Semua Wilayah Jawa Barat</option>
                  <option value="tasik">Kota & Kab. Tasikmalaya (Priangan Timur)</option>
                  <option value="bandung">Kota & Kab. Bandung (Bandung Raya)</option>
                  <option value="pangandaran">Kab. Pangandaran & Pantai Selatan</option>
                  <option value="garut">Kab. Garut & Ciamis</option>
                  <option value="cirebon">Kota & Kab. Cirebon (Pantura)</option>
                </select>
              </div>

              <div className="md:col-span-3 flex items-center gap-2">
                <div className="inline-flex rounded-lg border border-line bg-white dark:bg-[#132238] p-1 w-full justify-between text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setSelectedPrice("ALL")}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      selectedPrice === "ALL" ? "bg-primary text-white" : "text-ink hover:text-primary"
                    }`}
                  >
                    Semua
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPrice("FREE")}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      selectedPrice === "FREE" ? "bg-primary text-white" : "text-ink hover:text-primary"
                    }`}
                  >
                    Gratis
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedPrice("PAID")}
                    className={`px-3 py-1.5 rounded-md transition-colors ${
                      selectedPrice === "PAID" ? "bg-primary text-white" : "text-ink hover:text-primary"
                    }`}
                  >
                    Tiket
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 2: Category Pills & Weekly Date Rail Strip ──────── */}
      <section className="w-full bg-[#f8f9ff] dark:bg-[#0b1c30] py-4 border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 no-scrollbar text-xs">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition-colors shadow-xs ${
                  selectedCategory === c.id
                    ? "bg-primary text-white"
                    : "bg-white dark:bg-[#132238] border border-line text-ink hover:bg-surface-alt"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Weekly Date Rail Strip */}
          <div className="mt-2 grid grid-cols-7 gap-2">
            {weekDays.map((wd, i) => {
              const isActive = activeDateIndex === i;
              return (
                <button
                  key={wd.day}
                  type="button"
                  onClick={() => setActiveDateIndex(i)}
                  className={`p-2.5 rounded-xl text-center flex flex-col items-center transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-md ring-2 ring-primary/30"
                      : "bg-white dark:bg-[#132238] border border-line text-ink hover:border-primary/50"
                  }`}
                >
                  <span className={`text-[10px] font-bold ${isActive ? "text-white/80" : "text-ink-muted"}`}>
                    {wd.day}
                  </span>
                  <span className="font-serif text-base sm:text-lg font-bold leading-tight mt-0.5">
                    {wd.date}
                  </span>
                  {wd.count > 0 && (
                    <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isActive ? "bg-white" : "bg-primary"}`}></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Section 3: Spotlight Hero Banner ────────────────────────── */}
      <section className="w-full py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white dark:bg-[#132238] rounded-2xl shadow-md border border-line overflow-hidden mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Spotlight Image */}
              <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[380px] bg-black">
                <Image
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop"
                  alt="Festival Nelayan Pangandaran"
                  fill
                  sizes="(max-width: 1024px) 100vw, 700px"
                  className="object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded shadow-xs">
                    Sorotan Redaksi Pekan Ini
                  </span>
                  <span className="px-3 py-1 bg-[#213145]/90 text-white text-xs font-semibold rounded backdrop-blur-xs">
                    Seni Tradisi & Bahari
                  </span>
                </div>

                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold uppercase rounded shadow-xs">
                    GRATIS • TERBUKA UNTUK UMUM
                  </span>
                </div>
              </div>

              {/* Spotlight Details */}
              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-primary text-xs font-bold mb-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Sabtu - Senin, 26 - 28 Oktober 2026</span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-ink tracking-tight">
                    Festival Nelayan Pangandaran & Kirab Bahari Pasundan 2026
                  </h2>
                  <p className="text-xs sm:text-sm text-ink-muted mt-3 leading-relaxed">
                    Ritual syukuran laut kidul yang dirangkai dengan parade perahu hias 100 nelayan, pameran hasil laut olahan UMKM pesisir, serta pentas seni Helaran Rampak Kendang di bibir pantai.
                  </p>

                  <div className="mt-4 pt-4 border-t border-line flex flex-col gap-2 text-xs text-ink">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Pantai Barat & Lapangan Katapang Doyong, Pangandaran</span>
                    </div>
                    <div className="flex items-center gap-2 text-ink-muted">
                      <Clock className="h-4 w-4 text-primary shrink-0" />
                      <span>Pukul 06.30 - 22.00 WIB (3 Hari Penuh)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 flex items-center gap-3">
                  <a
                    href="https://maps.google.com/?q=Pantai+Barat+Pangandaran"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-4 bg-primary text-white text-center rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-primary-hover transition-colors shadow-xs"
                  >
                    Buka Panduan Lokasi
                  </a>
                  <button
                    type="button"
                    className="p-2.5 rounded-lg border border-line bg-surface-alt text-ink hover:text-primary transition-colors"
                    title="Simpan ke kalender"
                  >
                    <Bookmark className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Events Catalog Grid ─────────────────────────────────── */}
          <div className="flex items-center justify-between pb-2 mb-6 border-b border-line">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-primary rounded-[3px]"></span>
              <h3 className="font-serif text-xl sm:text-2xl text-ink font-bold tracking-tight">
                Katalog Agenda Mendatang
              </h3>
            </div>
            <span className="text-xs text-ink-muted">
              Menampilkan <strong>{filteredEvents.length}</strong> agenda terverifikasi
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEvents.map((evt) => {
              const d = new Date(evt.eventDate);
              const day = d.getDate();
              const month = d.toLocaleString("id-ID", { month: "short" }).toUpperCase();
              const isFree = evt.priceType === "FREE";

              return (
                <article
                  key={evt.id}
                  className="bg-white dark:bg-[#132238] rounded-xl border border-line/80 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      {/* Date Badge */}
                      <div className="bg-primary text-white rounded-xl p-2 text-center shrink-0 w-14 shadow-xs">
                        <span className="block text-[10px] uppercase font-bold tracking-wider">{month}</span>
                        <span className="block font-serif text-2xl font-bold leading-tight">{day}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isFree 
                              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300" 
                              : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                          }`}>
                            {isFree ? "Akses Gratis" : "Tiket / Berbayar"}
                          </span>

                          {evt.isVerified && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              <CheckCircle2 className="h-3 w-3" /> Terverifikasi
                            </span>
                          )}
                        </div>

                        <Link href={`/kalender/${evt.slug}`} className="hover:underline">
                          <h4 className="font-serif text-base sm:text-lg font-bold text-ink group-hover:text-primary transition-colors leading-snug">
                            {evt.title}
                          </h4>
                        </Link>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-ink-muted line-clamp-2 mt-3 leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-line/60 flex flex-col gap-1.5 text-xs text-ink-muted">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-ink">Penyelenggara:</span>
                        <span>{evt.organizer}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-[#eff4ff] dark:bg-[#0b1c30] border-t border-line/60 flex items-center justify-between flex-wrap gap-2">
                    <span className="text-[11px] text-ink-muted">
                      {evt.priceNote || (isFree ? "Terbuka untuk umum" : "Pendaftaran berbayar")}
                    </span>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/kalender/${evt.slug}`}
                        className="px-3 py-1.5 rounded-lg border border-line bg-white dark:bg-[#132238] text-xs font-semibold text-ink hover:text-primary transition-colors flex items-center gap-1"
                      >
                        Detail
                      </Link>
                      <a
                        href={`/api/events/${evt.id || evt.slug}/ics`}
                        download
                        title="Simpan ke Google / Apple Calendar"
                        className="px-2.5 py-1.5 rounded-lg border border-line bg-white dark:bg-[#132238] text-xs font-semibold text-ink hover:text-primary transition-colors flex items-center gap-1"
                      >
                        + .ICS
                      </a>
                      {evt.registrationLink && (
                        <a
                          href={evt.registrationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <Ticket className="h-3 w-3" />
                          <span>Daftar</span>
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── Modal Submit Agenda ─────────────────────────────────────── */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#132238] border border-line rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
            <button
              type="button"
              onClick={() => {
                setIsSubmitModalOpen(false);
                setSubmitSuccess(false);
              }}
              className="absolute top-4 right-4 text-ink-muted hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-ink">
              Kirim Informasi Agenda ke Redaksi
            </h3>
            <p className="text-xs text-ink-muted mt-1">
              Komunitas, panitia festival, atau instansi dapat mendaftarkan agenda kegiatan untuk diverifikasi tim editorial Palihmana.ID.
            </p>

            {submitSuccess ? (
              <div className="my-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-200">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mb-1" />
                <p className="font-bold">Info agenda berhasil dikirim!</p>
                <p className="mt-1">Tim redaksi kami akan memverifikasi dan mempublikasikan agenda ini dalam 1x24 jam.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitSuccess(true);
                }}
                className="mt-4 flex flex-col gap-3 text-xs"
              >
                <div>
                  <label className="block font-bold text-ink mb-1">Nama Agenda / Acara</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Pameran Kriya & Wayang Golek 2026"
                    className="w-full px-3 py-2 rounded-lg border border-line bg-[#eff4ff] dark:bg-[#0b1c30] text-ink focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-ink mb-1">Tanggal Acara</label>
                    <input
                      type="date"
                      required
                      className="w-full px-3 py-2 rounded-lg border border-line bg-[#eff4ff] dark:bg-[#0b1c30] text-ink focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-ink mb-1">Lokasi Kota/Kab</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Dadaha, Tasikmalaya"
                      className="w-full px-3 py-2 rounded-lg border border-line bg-[#eff4ff] dark:bg-[#0b1c30] text-ink focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-ink mb-1">Kontak Panitia / Link Pendaftaran</label>
                  <input
                    type="text"
                    required
                    placeholder="WhatsApp atau link website panitia"
                    className="w-full px-3 py-2 rounded-lg border border-line bg-[#eff4ff] dark:bg-[#0b1c30] text-ink focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2 rounded-lg border border-line text-ink hover:bg-surface-alt font-medium"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary-hover shadow-xs"
                  >
                    Kirim ke Redaksi
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
