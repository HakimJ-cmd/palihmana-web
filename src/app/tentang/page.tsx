import React from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata = {
  title: `Tentang Kami — ${SITE_CONFIG.name}`,
  description: "Mengenal visi, misi, dan pendekatan jurnalisme warga Palihmana.id di Tasikmalaya.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-read px-4 py-8 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-ink-muted">
        <Link href="/" className="hover:text-primary">
          Beranda
        </Link>
        <span>/</span>
        <span className="font-medium text-ink">Tentang Kami</span>
      </nav>

      <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Tentang Palihmana.id
      </h1>

      <p className="mt-4 text-lg leading-relaxed text-ink-muted">
        Media digital lokal Tasikmalaya yang berpijak pada kegunaan nyata, penjelasan jernih, dan keterlibatan komunitas.
      </p>

      <div className="mt-8 space-y-6 text-base leading-relaxed text-ink">
        <section>
          <h2 className="font-serif text-2xl font-bold text-ink">Mengapa Palihmana Lahir?</h2>
          <p className="mt-2 text-ink-muted">
            Di tengah banjir informasi di media sosial yang sering kali bising, tidak terverifikasi, dan sarat clickbait sensasional, warga Tasikmalaya membutuhkan pegangan informasi yang tenang, akurat, dan langsung menjawab kebutuhan hidup sehari-hari.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-ink">Tiga Pilar Nilai</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded border border-line bg-surface p-4">
              <h3 className="font-serif text-base font-bold text-primary">1. Utility (Kegunaan)</h3>
              <p className="mt-1 text-xs text-ink-muted">
                Informasi yang membantu warga bertindak: panduan birokrasi, nomor darurat, rute angkot, dan hak layanan publik.
              </p>
            </div>
            <div className="rounded border border-line bg-surface p-4">
              <h3 className="font-serif text-base font-bold text-primary">2. Explanatory (Konteks)</h3>
              <p className="mt-1 text-xs text-ink-muted">
                Menjelaskan mengapa sesuatu terjadi dengan data BPS dan APBD yang diterjemahkan ke bahasa yang mudah dimengerti.
              </p>
            </div>
            <div className="rounded border border-line bg-surface p-4">
              <h3 className="font-serif text-base font-bold text-primary">3. Community (Warga)</h3>
              <p className="mt-1 text-xs text-ink-muted">
                Mengangkat suara pengrajin, pedagang, dan inisiatif kolektif tanpa diskriminasi.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded border border-line bg-surface-alt p-6">
          <h2 className="font-serif text-xl font-bold text-ink">Prinsip Kami</h2>
          <blockquote className="mt-2 font-serif text-base italic text-ink-muted">
            &ldquo;Social membuat orang menemukan kami. Web membuat pengetahuan bertahan.&rdquo;
          </blockquote>
        </section>
      </div>
    </div>
  );
}
