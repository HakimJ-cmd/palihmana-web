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
        <div className="rounded border border-line bg-surface p-5">
          <div className="flex items-center gap-2 text-primary">
            <Mail className="h-5 w-5" />
            <span className="font-serif font-bold">Email Redaksi</span>
          </div>
          <p className="mt-2 text-sm text-ink font-mono">redaksi@palihmana.id</p>
          <p className="mt-1 text-xs text-ink-muted">Untuk rilis pers, hak jawab, dan perbaikan fakta</p>
        </div>

        <div className="rounded border border-line bg-surface p-5">
          <div className="flex items-center gap-2 text-primary">
            <MessageCircle className="h-5 w-5" />
            <span className="font-serif font-bold">Laporan Warga</span>
          </div>
          <p className="mt-2 text-sm text-ink font-mono">+62 812-2200-XXXX</p>
          <p className="mt-1 text-xs text-ink-muted">WhatsApp hotline untuk tip berita dan info utilitas</p>
        </div>
      </div>

      <div className="mt-8 rounded border border-line bg-surface-alt p-6">
        <div className="flex items-center gap-2 text-ink">
          <MapPin className="h-5 w-5 text-primary" />
          <span className="font-serif font-bold">Kantor Redaksi</span>
        </div>
        <p className="mt-2 text-sm text-ink-muted leading-relaxed">
          Kota Tasikmalaya, Jawa Barat, Indonesia.<br />
          Liputan wilayah: Kota Tasikmalaya, Kabupaten Tasikmalaya, dan Priangan Timur.
        </p>
      </div>
    </div>
  );
}
