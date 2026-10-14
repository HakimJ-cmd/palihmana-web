import React from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata = {
  title: `Kebijakan Koreksi & Hak Jawab — ${SITE_CONFIG.name}`,
  description: "Mekanisme pengajuan ralat, perbaikan data, dan hak jawab warga Tasikmalaya di Palihmana.id.",
};

export default function CorrectionPolicyPage() {
  return (
    <div className="mx-auto max-w-read px-4 py-8 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-ink-muted">
        <Link href="/" className="hover:text-primary">
          Beranda
        </Link>
        <span>/</span>
        <span className="font-medium text-ink">Kebijakan Koreksi</span>
      </nav>

      <h1 className="font-serif text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        Kebijakan Koreksi & Hak Jawab
      </h1>

      <div className="mt-8 space-y-6 text-base leading-relaxed text-ink">
        <section>
          <h2 className="font-serif text-2xl font-bold text-ink">Komitmen terhadap Akurasi</h2>
          <p className="mt-2 text-ink-muted">
            Jika kami melakukan kekeliruan fakta, angka, nama, atau konteks, kami berkomitmen untuk memperbaikinya secara transparan secepat mungkin. Kami tidak menghapus jejak kesalahan secara diam-diam.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-ink">Kotak Catatan Koreksi</h2>
          <p className="mt-2 text-ink-muted">
            Setiap artikel yang mengalami perbaikan substansial akan memuat kotak catatan koreksi di bagian atas artikel, memuat rincian apa yang dikoreksi dan tanggal/waktu perubahan dilakukan.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-ink">Cara Mengajukan Ralat</h2>
          <p className="mt-2 text-ink-muted">
            Warga dan narasumber dapat mengirimkan permohonan ralat atau hak jawab melalui email redaksi di <span className="font-semibold text-primary">redaksi@palihmana.id</span> atau WhatsApp redaksi dengan menyertakan tautan artikel dan bukti pembanding yang valid.
          </p>
        </section>
      </div>
    </div>
  );
}
