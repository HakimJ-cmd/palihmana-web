"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Mail, Phone, CheckCircle2, ShieldCheck, Newspaper } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="w-full bg-[#213145] text-[#eaf1ff] pt-12 sm:pt-16 pb-8 border-t-4 border-primary mt-16 sm:mt-24 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Col 1 & 2: Brand, Identity & Contacts */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                PALIHMANA<span className="text-primary">.ID</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-[#bec6e0] leading-relaxed pr-0 lg:pr-6">
              Portal berita jurnalisme presisi dan media digital independen yang berakar pada dinamika Tasikmalaya, Priangan Timur, dan Tatar Pasundan. Menghadirkan liputan solutif, kabar civic, denyut ekonomi UMKM, dan perayaan khazanah budaya dengan integritas redaksional tertinggi.
            </p>

            <div className="flex flex-col gap-2 text-xs text-[#bec6e0] mt-1">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>Jl. Mayor S.L. Tobing No. 45, Cihideung, Kota Tasikmalaya, Jawa Barat 46122</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span>redaksi@palihmana.id | sapa@palihmana.id</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>(0265) 752-1980 / +62 812-2234-5678</span>
              </div>
            </div>
          </div>

          {/* Col 3: Kategori Liputan / Pilar */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-white border-b border-white/15 pb-2">
              Rubrikasi & Pilar
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-[#bec6e0]">
              <li>
                <Link href="/utility" className="hover:text-white transition-colors">
                  Utility & Panduan Warga
                </Link>
              </li>
              <li>
                <Link href="/understand" className="hover:text-white transition-colors">
                  Understand & Analisis Data
                </Link>
              </li>
              <li>
                <Link href="/opini" className="hover:text-white transition-colors">
                  Kolom Opini & Wacana
                </Link>
              </li>
              <li>
                <Link href="/discover" className="hover:text-white transition-colors">
                  Budaya & Kuliner Priangan
                </Link>
              </li>
              <li>
                <Link href="/people" className="hover:text-white transition-colors">
                  Sosok & Tokoh Inspiratif
                </Link>
              </li>
              <li>
                <Link href="/catatan-lapangan" className="hover:text-white transition-colors">
                  Catatan Lapangan & Sketsa
                </Link>
              </li>
              <li>
                <Link href="/layanan" className="hover:text-white transition-colors">
                  Pusat Layanan Warga
                </Link>
              </li>
              <li>
                <Link href="/kalender" className="hover:text-white transition-colors">
                  Kalender Event & Agenda
                </Link>
              </li>
              <li>
                <Link href="/simpanan" className="hover:text-white transition-colors">
                  Simpanan Saya
                </Link>
              </li>
              <li>
                <Link href="/akun" className="hover:text-white transition-colors">
                  Akun Baraya & Keanggotaan
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Integritas Redaksi */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-white border-b border-white/15 pb-2">
              Integritas Redaksi
            </h4>
            <ul className="flex flex-col gap-2 text-xs text-[#bec6e0]">
              <li>
                <Link href="/pedoman-editorial" className="hover:text-white transition-colors">
                  Pedoman Pemberitaan Siber
                </Link>
              </li>
              <li>
                <Link href="/kebijakan-koreksi" className="hover:text-white transition-colors">
                  Mekanisme Hak Jawab & Koreksi
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-white transition-colors">
                  Struktur Dewan Redaksi
                </Link>
              </li>
              <li>
                <Link href="/privasi" className="hover:text-white transition-colors">
                  Kebijakan Privasi & Data
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-white transition-colors">
                  Kirim Pengaduan & Lapor Warga
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-white transition-colors">
                  Kerja Sama Media & Iklan
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Buletin Pagi */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs uppercase font-bold tracking-wider text-white border-b border-white/15 pb-2">
              Buletin Digital
            </h4>
            <p className="text-xs text-[#bec6e0] leading-relaxed">
              Dapatkan rangkuman kurasi informasi terverifikasi dan agenda kota langsung di inbox Anda setiap pagi.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Ketik email aktif Anda..."
                className="px-3 py-2 bg-white/10 border border-white/20 text-white rounded text-xs placeholder:text-[#bec6e0]/70 focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                className="py-2 px-3 bg-primary text-white text-xs font-bold uppercase rounded hover:bg-primary-hover transition-colors shadow-xs"
              >
                Langganan Buletin
              </button>
            </form>

            <div className="flex items-center gap-2 pt-2 text-[#bec6e0] text-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span className="text-[11px] font-medium">Bebas Sensasi · Taat Kode Etik Pers</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Standards */}
        <div className="border-t border-white/15 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#bec6e0] text-xs">
          <div>
            © {new Date().getFullYear()} PT Palih Mana Multimedia Nusantara. Hak cipta dilindungi Undang-Undang.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/pedoman-editorial" className="hover:text-white transition-colors">
              Standar Verifikasi
            </Link>
            <span>•</span>
            <Link href="/kebijakan-koreksi" className="hover:text-white transition-colors">
              Koreksi Terbuka
            </Link>
            <span>•</span>
            <Link href="/sitemap.xml" className="hover:text-white transition-colors">
              Sitemap RSS
            </Link>
            <span>•</span>
            <Link href="/admin" className="opacity-40 hover:opacity-100 hover:text-white transition-opacity" title="Akses Redaksi Internal">
              Akses Staf
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
