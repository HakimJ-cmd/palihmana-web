import React from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata = {
  title: `Kebijakan Privasi — ${SITE_CONFIG.name}`,
  description: "Perlindungan data pribadi dan privasi pembaca di Palihmana.id.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-read px-4 py-8 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-ink-muted">
        <Link href="/" className="hover:text-primary">
          Beranda
        </Link>
        <span>/</span>
        <span className="font-medium text-ink">Kebijakan Privasi</span>
      </nav>

      <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Kebijakan Privasi
      </h1>

      <div className="mt-8 space-y-6 text-base leading-relaxed text-ink">
        <section>
          <h2 className="font-serif text-2xl font-bold text-ink">Prinsip Minim Data</h2>
          <p className="mt-2 text-ink-muted">
            Palihmana.id menghormati privasi Anda. Kami tidak memasang pelacak pihak ketiga yang invasif, tidak menjual data pembaca kepada pialang data, dan hanya mengumpulkan data teknis anonim dasar untuk memantau performa situs.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-ink">Kuki (Cookies) & Penyimpanan Lokal</h2>
          <p className="mt-2 text-ink-muted">
            Kami hanya menggunakan penyimpanan lokal (localStorage) di peramban Anda untuk mengingat preferensi tema tampilan (terang atau gelap) dan preferensi artikel yang Anda simpan secara lokal di perangkat Anda.
          </p>
        </section>
      </div>
    </div>
  );
}
