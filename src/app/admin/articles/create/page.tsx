"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  Info,
} from "lucide-react";
import { PILAR_LABELS, STATUS_LABELS, GEO_LABELS } from "@/lib/constants";

export default function CreateArticlePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    pilar: "UTILITY",
    geoScope: "LOCAL",
    status: "DRAFT",
    isFeatured: false,
    isSponsored: false,
    coverImage: "",
    coverAlt: "",
    coverCredit: "",
    readingMinutes: 4,
    bodyText: "",
    // Fact-Check fields (PRD F4-CMS-02)
    claims: "",
    primarySources: "",
    secondarySources: "",
    unverifiedItemsText: "",
    riskLevel: "LOW",
    comparability: "SAFE_TO_COMPARE",
    factCheckStatus: "NEEDS_VERIFICATION",
    // Correction note (PRD F4-CMS-04)
    correctionNote: "",
  });

  const [summaryPoints, setSummaryPoints] = useState<string[]>([""]);

  const handlePointChange = (index: number, val: string) => {
    const updated = [...summaryPoints];
    updated[index] = val;
    setSummaryPoints(updated);
  };

  const addPoint = () => {
    setSummaryPoints([...summaryPoints, ""]);
  };

  const removePoint = (index: number) => {
    setSummaryPoints(summaryPoints.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    // Validation: prevent publish if status is high risk and not verified
    if (formData.status === "PUBLISHED" && formData.factCheckStatus !== "READY_FOR_NEWSROOM") {
      setErrorMsg("Standar Redaksi: Artikel tidak dapat ditayangkan langsung jika Fact-Check belum berstatus 'Ready for Newsroom'.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        summaryPoints: summaryPoints.filter((p) => p.trim() !== ""),
        unverifiedItems: formData.unverifiedItemsText
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      };

      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal menyimpan artikel.");
      }

      setSuccessMsg(
        json.simulated
          ? "Artikel berhasil disimpan dalam sistem redaksi (mode lokal)."
          : "Artikel dan lembar fact-check berhasil disimpan dan dicatat dalam audit log!"
      );

      setTimeout(() => {
        router.push("/admin");
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat menyimpan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ─── Breadcrumb & Back ────────────────────────────────────────── */}
      <div className="mb-6">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
        </Link>
      </div>

      {/* ─── Header ─────────────────────────────────────────────────── */}
      <div className="mb-8 border-b border-line pb-4">
        <h1 className="font-serif text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Tulis Artikel Baru & Verifikasi Redaksi
        </h1>
        <p className="mt-1 text-xs text-ink-muted">
          Patuhi panduan anti-sensasionalisme, sertakan sumber primer, dan catat verifikasi fakta (PRD & Operating Handbook)
        </p>
      </div>

      {successMsg && (
        <div className="mb-6 flex items-center gap-2 rounded bg-success/15 border border-success/30 p-4 text-xs font-semibold text-success">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 flex items-center gap-2 rounded bg-danger/15 border border-danger/30 p-4 text-xs font-semibold text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="rounded border border-line bg-surface p-6 space-y-4">
          <h2 className="font-serif text-base font-bold text-ink">Informasi Utama</h2>

          <div>
            <label className="block text-xs font-semibold text-ink">
              Judul Artikel (Wajib)
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Cara Membuat KTP Elektronik di Tasikmalaya: Panduan Lengkap 2026"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="mt-1 h-11 w-full rounded border border-line bg-surface px-3 text-sm text-ink focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink">
              Subjudul / Ringkasan Awal
            </label>
            <input
              type="text"
              placeholder="Satu atau dua kalimat penjelas konteks..."
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="mt-1 h-11 w-full rounded border border-line bg-surface px-3 text-sm text-ink focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-ink">Pilar Konten</label>
              <select
                value={formData.pilar}
                onChange={(e) => setFormData({ ...formData, pilar: e.target.value })}
                className="mt-1 h-10 w-full rounded border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
              >
                {Object.entries(PILAR_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink">Cakupan Wilayah (Geo Scope)</label>
              <select
                value={formData.geoScope}
                onChange={(e) => setFormData({ ...formData, geoScope: e.target.value })}
                className="mt-1 h-10 w-full rounded border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
              >
                {Object.entries(GEO_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink">Status Tayang</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="mt-1 h-10 w-full rounded border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
              >
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="h-4 w-4 rounded border-line text-primary focus:ring-primary"
              />
              Jadikan Sorotan Hero di Beranda
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isSponsored}
                onChange={(e) => setFormData({ ...formData, isSponsored: e.target.checked })}
                className="h-4 w-4 rounded border-line text-primary focus:ring-primary"
              />
              Konten Sponsor / Kemitraan (Wajib Dicantumkan)
            </label>
          </div>
        </div>

        {/* FACT CHECK & VERIFICATION LOGGER (PRD F4-CMS-02 & F4-CMS-03) */}
        <div className="rounded border border-primary/30 bg-[#F0F7F5] dark:bg-[#0E2226] p-6 space-y-4">
          <div className="flex items-center gap-2 text-primary border-b border-primary/20 pb-3">
            <ShieldCheck className="h-5 w-5" />
            <h2 className="font-serif text-base font-bold text-ink">
              Fact-Check & Verification Logger (Standar Akurasi Berita)
            </h2>
          </div>
          <p className="text-xs text-ink-muted">
            Setiap klaim faktual harus memiliki dokumen atau narasumber primer. Pisahkan secara eksplisit butir yang belum teruji.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-ink">
                Klaim Faktual Utama yang Diverifikasi
              </label>
              <textarea
                rows={3}
                placeholder="Tuliskan klaim penting (misal: syarat KTP tidak dipungut biaya, waktu pembuatan 3 hari)..."
                value={formData.claims}
                onChange={(e) => setFormData({ ...formData, claims: e.target.value })}
                className="mt-1 w-full rounded border border-line bg-surface p-2.5 text-xs text-ink focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink">
                Sumber Primer (Dokumen Resmi / Instansi / Wawancara)
              </label>
              <textarea
                rows={3}
                placeholder="Contoh: SK Kadisdukcapil Tasikmalaya No. 12/2026, Wawancara langsung Kabid Pelayanan..."
                value={formData.primarySources}
                onChange={(e) => setFormData({ ...formData, primarySources: e.target.value })}
                className="mt-1 w-full rounded border border-line bg-surface p-2.5 text-xs text-ink focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-ink">
                Sumber Sekunder (Riset / Media Kredibel)
              </label>
              <textarea
                rows={2}
                placeholder="Laporan BPS Kota Tasikmalaya 2025, Data Kemenpan RB..."
                value={formData.secondarySources}
                onChange={(e) => setFormData({ ...formData, secondarySources: e.target.value })}
                className="mt-1 w-full rounded border border-line bg-surface p-2.5 text-xs text-ink focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink">
                Butir Belum Terverifikasi (Wajib Dipisahkan Eksplisit)
              </label>
              <textarea
                rows={2}
                placeholder="Satu butir per baris jika ada hal yang masih menunggu konfirmasi..."
                value={formData.unverifiedItemsText}
                onChange={(e) => setFormData({ ...formData, unverifiedItemsText: e.target.value })}
                className="mt-1 w-full rounded border border-line bg-surface p-2.5 text-xs text-ink focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-ink">Tingkat Risiko Informasi</label>
              <select
                value={formData.riskLevel}
                onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
                className="mt-1 h-10 w-full rounded border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
              >
                <option value="LOW">Rendah (Low Risk)</option>
                <option value="MEDIUM">Sedang (Medium Risk)</option>
                <option value="HIGH">Tinggi (High Risk - Isu Sensitif/Hukum)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink">Uji Komparabilitas Data Lintas Tahun</label>
              <select
                value={formData.comparability}
                onChange={(e) => setFormData({ ...formData, comparability: e.target.value })}
                className="mt-1 h-10 w-full rounded border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
              >
                <option value="SAFE_TO_COMPARE">Aman Dibandingkan</option>
                <option value="NEEDS_NOTE">Perlu Catatan Metodologi</option>
                <option value="DO_NOT_COMPARE">Jangan Dibandingkan Langsung</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink">Status Fact-Check</label>
              <select
                value={formData.factCheckStatus}
                onChange={(e) => setFormData({ ...formData, factCheckStatus: e.target.value })}
                className="mt-1 h-10 w-full rounded border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none font-semibold text-primary"
              >
                <option value="NOT_READY">Belum Siap</option>
                <option value="NEEDS_VERIFICATION">Perlu Verifikasi Lanjutan</option>
                <option value="READY_FOR_NEWSROOM">Ready for Newsroom (Siap Terbit)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Media & Cover */}
        <div className="rounded border border-line bg-surface p-6 space-y-4">
          <h2 className="font-serif text-base font-bold text-ink">Foto Sampul & Visual</h2>

          <div>
            <label className="block text-xs font-semibold text-ink">URL Foto Sampul</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="mt-1 h-10 w-full rounded border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-ink">Teks Alternatif (Alt Text - Aksesibilitas)</label>
              <input
                type="text"
                placeholder="Deskripsi foto untuk pembaca tunanetra..."
                value={formData.coverAlt}
                onChange={(e) => setFormData({ ...formData, coverAlt: e.target.value })}
                className="mt-1 h-10 w-full rounded border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink">Kredit Foto / Sumber Visual</label>
              <input
                type="text"
                placeholder="Contoh: Dok. Disdukcapil Kota Tasikmalaya"
                value={formData.coverCredit}
                onChange={(e) => setFormData({ ...formData, coverCredit: e.target.value })}
                className="mt-1 h-10 w-full rounded border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Summary Points */}
        <div className="rounded border border-line bg-surface p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-base font-bold text-ink">Poin Ringkasan (Summary Box)</h2>
              <p className="text-xs text-ink-muted">3–5 poin ringkas di awal artikel untuk kenyamanan pembaca ponsel</p>
            </div>
            <button
              type="button"
              onClick={addPoint}
              className="inline-flex items-center gap-1 rounded border border-line px-2.5 py-1 text-xs font-semibold text-ink hover:bg-surface-alt transition-colors"
            >
              <Plus className="h-3.5 w-3.5" /> Tambah Poin
            </button>
          </div>

          <div className="space-y-2">
            {summaryPoints.map((point, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-xs font-bold text-primary">{idx + 1}.</span>
                <input
                  type="text"
                  placeholder={`Poin penting ke-${idx + 1}...`}
                  value={point}
                  onChange={(e) => handlePointChange(idx, e.target.value)}
                  className="h-9 flex-1 rounded border border-line bg-surface px-3 text-xs text-ink focus:border-primary focus:outline-none"
                />
                {summaryPoints.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePoint(idx)}
                    className="p-1.5 text-ink-muted hover:text-danger"
                    aria-label="Hapus poin"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Body Content */}
        <div className="rounded border border-line bg-surface p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-base font-bold text-ink">Isi Konten Artikel</h2>
            <div className="flex items-center gap-2">
              <label className="text-xs text-ink-muted">Estimasi waktu baca:</label>
              <input
                type="number"
                min="1"
                max="60"
                value={formData.readingMinutes}
                onChange={(e) => setFormData({ ...formData, readingMinutes: Number(e.target.value) })}
                className="h-8 w-16 rounded border border-line bg-surface px-2 text-xs text-center text-ink"
              />
              <span className="text-xs text-ink-muted">menit</span>
            </div>
          </div>

          <textarea
            required
            rows={12}
            placeholder="Tulis naskah lengkap di sini. Gunakan baris baru ganda antar paragraf..."
            value={formData.bodyText}
            onChange={(e) => setFormData({ ...formData, bodyText: e.target.value })}
            className="w-full rounded border border-line bg-surface p-3 font-sans text-sm text-ink leading-relaxed focus:border-primary focus:outline-none"
          />
        </div>

        {/* Correction Note Box (PRD F4-CMS-04) */}
        <div className="rounded border border-line bg-surface p-6 space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <h2 className="font-serif text-base font-bold text-ink">
              Catatan Ralat / Koreksi (Opsional)
            </h2>
          </div>
          <p className="text-xs text-ink-muted">
            Jika artikel ini merupakan perbaikan atas kekeliruan sebelumnya, tuliskan ralat secara transparan. Catatan akan tampil di kotak ralat bagian atas artikel.
          </p>
          <textarea
            rows={2}
            placeholder="Contoh: Ralat: Pada versi awal tertulis hari Senin. Jadwal resmi yang berlaku adalah setiap hari Selasa..."
            value={formData.correctionNote}
            onChange={(e) => setFormData({ ...formData, correctionNote: e.target.value })}
            className="w-full rounded border border-line bg-surface p-2.5 text-xs text-ink focus:border-primary focus:outline-none"
          />
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 border-t border-line pt-6">
          <Link
            href="/admin"
            className="rounded border border-line px-4 py-2.5 text-xs font-semibold text-ink hover:bg-surface-alt transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded bg-primary px-6 py-2.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-50 transition-colors shadow-xs"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Menyimpan..." : "Simpan & Rekam Verifikasi"}
          </button>
        </div>
      </form>
    </div>
  );
}
