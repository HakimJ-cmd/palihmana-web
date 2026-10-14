import React from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata = {
  title: `Pedoman Editorial — ${SITE_CONFIG.name}`,
  description: "Standar verifikasi fakta, independensi, dan etika jurnalisme Palihmana.id di Tasikmalaya.",
};

export default function EditorialGuidelinesPage() {
  return (
    <div className="mx-auto max-w-read px-4 py-8 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-ink-muted">
        <Link href="/" className="hover:text-primary">
          Beranda
        </Link>
        <span>/</span>
        <span className="font-medium text-ink">Pedoman Editorial</span>
      </nav>

      <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Pedoman Editorial & Etika
      </h1>

      <div className="mt-8 space-y-6 text-base leading-relaxed text-ink">
        <section>
          <h2 className="font-serif text-2xl font-bold text-ink">1. Verifikasi Berjenjang</h2>
          <p className="mt-2 text-ink-muted">
            Setiap informasi yang kami publikasikan harus melalui proses pengecekan fakta minimal 2 sumber independen atau dokumen resmi instansi terkait. Kami memisahkan secara tegas antara opini, analisis data, dan berita fakta.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-ink">2. Larangan Sensasionalisme</h2>
          <p className="mt-2 text-ink-muted">
            Palihmana.id melarang keras penggunaan judul umpan klik (clickbait), visual vulgar, atau eksploitasi penderitaan warga demi traffic semata.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-ink">3. Transparansi Sponsor & Iklan</h2>
          <p className="mt-2 text-ink-muted">
            Setiap konten kerja sama komersial atau sponsor wajib diberi label jelas &ldquo;KONTEN SPONSOR&rdquo; dan tidak boleh memengaruhi independensi redaksional.
          </p>
        </section>
      </div>
    </div>
  );
}
