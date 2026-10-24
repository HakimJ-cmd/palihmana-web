import React from "react";
import Link from "next/link";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata = {
  title: `Hubungi Redaksi — ${SITE_CONFIG.name}`,
  description: "Kontak resmi tim redaksi, kerja sama komunitas, dan laporan informasi warga Tasikmalaya.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-read px-4 py-8 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-ink-muted">
        <Link href="/" className="hover:text-primary">
          Beranda
        </Link>
        <span>/</span>
        <span className="font-medium text-ink">Kontak</span>
      </nav>

      <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Hubungi Redaksi Palihmana.id
      </h1>

      <p className="mt-4 text-base text-ink-muted">
        Punya informasi lapangan, masukan panduan layanan warga, atau ingin berkolaborasi? Kami senang mendengar dari Anda.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface p-5 shadow-xs">
          <div className="flex items-center gap-2 text-primary">
            <Mail className="h-5 w-5" />
            <span className="font-serif font-bold">Email Redaksi & Kerja Sama</span>
          </div>
          <a href="mailto:Palihmanaid@gmail.com" className="mt-2 block text-sm font-semibold text-primary hover:underline font-mono">
            Palihmanaid@gmail.com
          </a>
          <p className="mt-1 text-xs text-ink-muted">Untuk rilis pers, perbaikan fakta, informasi warga, dan kemitraan</p>
        </div>

        <div className="rounded-xl border border-line bg-surface p-5 shadow-xs">
          <div className="flex items-center gap-2 text-primary">
            <MessageCircle className="h-5 w-5" />
            <span className="font-serif font-bold">Laporan & Hotline Warga</span>
          </div>
          <p className="mt-2 text-sm text-ink font-mono font-semibold">+62 812-2234-5678</p>
          <p className="mt-1 text-xs text-ink-muted">WhatsApp hotline untuk tip berita, info darurat, dan utilitas</p>
        </div>
      </div>

      {/* Kanal Sosial Resmi */}
      <div className="mt-6 rounded-xl border border-line bg-surface p-6 shadow-xs">
        <h3 className="font-serif text-lg font-bold text-ink mb-3">Kanal Media Sosial Resmi</h3>
        <p className="text-xs text-ink-muted mb-4">Terhubung langsung dengan tim redaksi dan komunitas pembaca di Tasikmalaya:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="https://www.instagram.com/palihmana.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-lg border border-line bg-surface-alt hover:border-primary transition-all text-xs"
          >
            <div>
              <p className="font-bold text-ink">@palihmana.id</p>
              <p className="text-[11px] text-ink-muted">Instagram Redaksi</p>
            </div>
            <span className="text-primary font-bold">↗</span>
          </a>

          <a
            href="https://www.tiktok.com/@palihmana.id"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-lg border border-line bg-surface-alt hover:border-primary transition-all text-xs"
          >
            <div>
              <p className="font-bold text-ink">@palihmana.id</p>
              <p className="text-[11px] text-ink-muted">TikTok Video</p>
            </div>
            <span className="text-primary font-bold">↗</span>
          </a>

          <a
            href="https://www.instagram.com/pmg.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-lg border border-amber-500/30 bg-amber-500/5 hover:border-amber-500 transition-all text-xs"
          >
            <div>
              <p className="font-bold text-amber-700 dark:text-amber-400">@pmg.id</p>
              <p className="text-[11px] text-ink-muted">Gaming & Toys Hub</p>
            </div>
            <span className="text-amber-600 font-bold">↗</span>
          </a>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-line bg-surface-alt p-6">
        <div className="flex items-center gap-2 text-ink">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="font-serif font-bold">Kantor Redaksi</span>
        </div>
        <p className="mt-2 text-sm text-ink-muted leading-relaxed">
          Jl. Mayor S.L. Tobing No. 45, Cihideung, Kota Tasikmalaya, Jawa Barat 46122.<br />
          Liputan wilayah: Kota Tasikmalaya, Kabupaten Tasikmalaya, dan Priangan Timur.
        </p>
      </div>
    </div>
  );
}
