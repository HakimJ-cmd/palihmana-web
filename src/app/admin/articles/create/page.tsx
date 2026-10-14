"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
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
    coverImage: "",
    coverAlt: "",
    coverCredit: "",
    readingMinutes: 4,
    bodyText: "",
  });

  const [summaryPoints, setSummaryPoints] = useState<string[]>([
    "",
  ]);

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

    try {
      const payload = {
        ...formData,
        summaryPoints: summaryPoints.filter((p) => p.trim() !== ""),
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
          ? "Artikel berhasil disimpan (mode lokal/pratinjau)."
          : "Artikel berhasil disimpan dan siap ditayangkan!"
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
        </Link>
      </div>

      {/* ─── Header ─────────────────────────────────────────────────── */}
      <div className="mb-8 border-b border-line pb-4">
        <h1 className="font-serif text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Tulis Artikel Baru
        </h1>
        <p className="mt-1 text-xs text-ink-muted">
          Patuhi panduan anti-sensasionalisme dan lengkapi sumber verifikasi
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
              <label className="block text-xs font-semibold text-ink">Cakupan Wilayah</label>
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

          <div className="pt-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-ink cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="h-4 w-4 rounded border-line text-primary focus:ring-primary"
              />
              Jadikan Sorotan Hero di Beranda
            </label>
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
              className="inline-flex items-center gap-1 rounded border border-line px-2.5 py-1 text-xs font-semibold text-ink hover:bg-surface-alt"
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
                min={1}
                max={30}
                value={formData.readingMinutes}
                onChange={(e) => setFormData({ ...formData, readingMinutes: Number(e.target.value) })}
                className="h-8 w-16 rounded border border-line bg-surface px-2 text-center text-xs text-ink"
              />
              <span className="text-xs text-ink-muted">menit</span>
            </div>
          </div>

          <textarea
            required
            rows={12}
            placeholder="Ketik isi artikel di sini... Pisahkan antar paragraf dengan dua kali enter (baris baru ganda)."
            value={formData.bodyText}
            onChange={(e) => setFormData({ ...formData, bodyText: e.target.value })}
            className="w-full rounded border border-line bg-surface p-4 font-sans text-sm leading-relaxed text-ink focus:border-primary focus:outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 border-t border-line pt-6">
          <Link
            href="/admin"
            className="rounded border border-line bg-surface px-5 py-2.5 text-xs font-semibold text-ink hover:bg-surface-alt transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded bg-primary px-6 py-2.5 text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-50 transition-colors"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Menyimpan..." : "Simpan Artikel"}
          </button>
        </div>
      </form>
    </div>
  );
}
