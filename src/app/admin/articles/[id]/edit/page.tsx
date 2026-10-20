"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  FileText,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
} from "lucide-react";
import { PILAR_LABELS } from "@/lib/constants";
import { Pilar, GeoScope, ArticleStatus } from "@prisma/client";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [pilar, setPilar] = useState<Pilar>("UTILITY");
  const [geoScope, setGeoScope] = useState<GeoScope>("LOCAL");
  const [status, setStatus] = useState<ArticleStatus>("DRAFT");
  const [readingMinutes, setReadingMinutes] = useState(4);
  const [coverImage, setCoverImage] = useState("");
  const [coverAlt, setCoverAlt] = useState("");
  const [coverCredit, setCoverCredit] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isSponsored, setIsSponsored] = useState(false);
  const [summaryPoints, setSummaryPoints] = useState<string[]>([""]);
  const [bodyText, setBodyText] = useState("");

  // Fact-Check Fields
  const [claims, setClaims] = useState("");
  const [primarySources, setPrimarySources] = useState("");
  const [secondarySources, setSecondarySources] = useState("");
  const [riskLevel, setRiskLevel] = useState("LOW");
  const [comparability, setComparability] = useState("SAFE_TO_COMPARE");
  const [factCheckStatus, setFactCheckStatus] = useState("NEEDS_VERIFICATION");

  // Correction note
  const [correctionNote, setCorrectionNote] = useState("");

  useEffect(() => {
    async function loadArticle() {
      try {
        const res = await fetch(`/api/admin/articles/${articleId}`);
        if (!res.ok) {
          throw new Error("Gagal mengambil data artikel");
        }
        const data = await res.json();
        setTitle(data.title || "");
        setSubtitle(data.subtitle || "");
        setPilar(data.pilar || "UTILITY");
        setGeoScope(data.geoScope || "LOCAL");
        setStatus(data.status || "DRAFT");
        setReadingMinutes(data.readingMinutes || 4);
        setCoverImage(data.coverImage || "");
        setCoverAlt(data.coverAlt || "");
        setCoverCredit(data.coverCredit || "");
        setIsFeatured(Boolean(data.isFeatured));
        setIsSponsored(Boolean(data.isSponsored));
        setSummaryPoints(data.summaryPoints?.length ? data.summaryPoints : [""]);
        setBodyText(data.bodyText || "");

        if (data.factChecks && data.factChecks.length > 0) {
          const fc = data.factChecks[0];
          setClaims(fc.claims?.claimText || "");
          setPrimarySources(fc.primarySources?.sources || "");
          setSecondarySources(fc.secondarySources?.sources || "");
          setRiskLevel(fc.riskLevel || "LOW");
          setComparability(fc.comparability || "SAFE_TO_COMPARE");
          setFactCheckStatus(fc.status || "NEEDS_VERIFICATION");
        }
      } catch (err: any) {
        setError(err.message || "Gagal memuat artikel.");
      } finally {
        setLoading(false);
      }
    }

    if (articleId) {
      loadArticle();
    }
  }, [articleId]);

  const handleAddSummaryPoint = () => {
    setSummaryPoints([...summaryPoints, ""]);
  };

  const handleSummaryChange = (index: number, val: string) => {
    const updated = [...summaryPoints];
    updated[index] = val;
    setSummaryPoints(updated);
  };

  const handleRemoveSummaryPoint = (index: number) => {
    if (summaryPoints.length === 1) {
      setSummaryPoints([""]);
      return;
    }
    setSummaryPoints(summaryPoints.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        title,
        subtitle,
        pilar,
        geoScope,
        status,
        readingMinutes,
        coverImage,
        coverAlt,
        coverCredit,
        isFeatured,
        isSponsored,
        summaryPoints: summaryPoints.filter((p) => p.trim().length > 0),
        bodyText,
        claims,
        primarySources,
        secondarySources,
        riskLevel,
        comparability,
        factCheckStatus,
        correctionNote,
      };

      const res = await fetch(`/api/admin/articles/${articleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Gagal memperbarui artikel.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-ink-muted">
        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
        Memuat data artikel untuk penyuntingan...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ─── Breadcrumb & Top Bar ──────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
        </Link>
        <span className="text-xs text-ink-muted">
          ID Dokumen: <code className="bg-surface-alt px-1.5 py-0.5 rounded font-mono text-[11px]">{articleId}</code>
        </span>
      </div>

      <div className="mb-8 border-b border-line pb-6">
        <h1 className="font-serif text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Sunting Artikel & Status Redaksi
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-ink-muted">
          Perbarui substansi liputan, tambahkan catatan koreksi terbuka, dan validasi standar cek fakta redaksi.
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger/10 p-4 text-xs text-danger">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
          <CheckCircle2 className="h-4 w-4" />
          <span>Artikel berhasil diperbarui! Mengalihkan ke dashboard...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Informasi Pokok Liputan */}
        <div className="rounded-xl border border-line bg-surface p-6 shadow-xs">
          <h2 className="font-serif text-base font-bold text-ink mb-4 border-b border-line pb-2 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            1. Informasi Pokok Liputan
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-ink mb-1">
                Judul Artikel <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-line bg-surface-alt p-3 text-ink text-sm focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-ink mb-1">
                Subjudul / Lead Paragraf
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full rounded-lg border border-line bg-surface-alt p-3 text-ink text-xs focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-ink mb-1">Pilar Taksonomi</label>
                <select
                  value={pilar}
                  onChange={(e) => setPilar(e.target.value as Pilar)}
                  className="w-full rounded-lg border border-line bg-surface-alt p-2.5 text-ink focus:border-primary focus:outline-none"
                >
                  {Object.entries(PILAR_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-ink mb-1">Cakupan Geografis</label>
                <select
                  value={geoScope}
                  onChange={(e) => setGeoScope(e.target.value as GeoScope)}
                  className="w-full rounded-lg border border-line bg-surface-alt p-2.5 text-ink focus:border-primary focus:outline-none"
                >
                  <option value="LOCAL">LOCAL (Tasikmalaya)</option>
                  <option value="REGIONAL">REGIONAL (Jawa Barat)</option>
                  <option value="NATIONAL">NATIONAL (Nasional)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-ink mb-1">Status Publikasi</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ArticleStatus)}
                  className="w-full rounded-lg border border-line bg-surface-alt p-2.5 text-ink focus:border-primary focus:outline-none font-bold"
                >
                  <option value="DRAFT">DRAFT (Pengerjaan)</option>
                  <option value="PRODUCTION">PRODUCTION (Siap Produksi)</option>
                  <option value="FACT_CHECK">FACT_CHECK (Pemeriksaan Fakta)</option>
                  <option value="PUBLISHED">PUBLISHED (Tayang Publik)</option>
                  <option value="ARCHIVED">ARCHIVED (Arsip)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Media & Gambar Sampul */}
        <div className="rounded-xl border border-line bg-surface p-6 shadow-xs text-xs">
          <h2 className="font-serif text-base font-bold text-ink mb-4 border-b border-line pb-2">
            2. Foto Sampul & Atribusi
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-ink mb-1">URL Foto Sampul</label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-line bg-surface-alt p-2.5 text-ink focus:border-primary focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-ink mb-1">Alt Teks (Aksesibilitas)</label>
                <input
                  type="text"
                  value={coverAlt}
                  onChange={(e) => setCoverAlt(e.target.value)}
                  className="w-full rounded-lg border border-line bg-surface-alt p-2.5 text-ink focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-ink mb-1">Kredit Foto & Hak Cipta</label>
                <input
                  type="text"
                  value={coverCredit}
                  onChange={(e) => setCoverCredit(e.target.value)}
                  className="w-full rounded-lg border border-line bg-surface-alt p-2.5 text-ink focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Ringkasan Cepat & Isi Artikel */}
        <div className="rounded-xl border border-line bg-surface p-6 shadow-xs text-xs">
          <h2 className="font-serif text-base font-bold text-ink mb-4 border-b border-line pb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            3. Ringkasan Poin Cepat (Summary Box)
          </h2>

          <div className="space-y-2 mb-4">
            {summaryPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-ink-muted font-mono">{index + 1}.</span>
                <input
                  type="text"
                  value={point}
                  onChange={(e) => handleSummaryChange(index, e.target.value)}
                  className="flex-1 rounded-lg border border-line bg-surface-alt p-2 text-ink focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSummaryPoint(index)}
                  className="p-2 text-ink-muted hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddSummaryPoint}
            className="inline-flex items-center gap-1.5 rounded bg-surface-alt px-3 py-1.5 font-semibold text-ink hover:bg-line transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Tambah Butir Ringkasan
          </button>

          <div className="mt-6 pt-6 border-t border-line">
            <label className="block font-semibold text-ink mb-1">
              Isi Lengkap Artikel (Paragraf dipisahkan enter ganda)
            </label>
            <textarea
              rows={12}
              required
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface-alt p-3 text-ink text-xs sm:text-sm font-sans leading-relaxed focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Section 4: Log Verifikasi Fakta & Cek Komparabilitas */}
        <div className="rounded-xl border border-line bg-surface p-6 shadow-xs text-xs">
          <h2 className="font-serif text-base font-bold text-ink mb-4 border-b border-line pb-2 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            4. Fact-Check Logger & Standar Verifikasi
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-ink mb-1">Klaim Fakta Utama</label>
              <input
                type="text"
                value={claims}
                onChange={(e) => setClaims(e.target.value)}
                className="w-full rounded-lg border border-line bg-surface-alt p-2.5 text-ink focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-ink mb-1">Sumber Primer Resmi</label>
                <input
                  type="text"
                  value={primarySources}
                  onChange={(e) => setPrimarySources(e.target.value)}
                  className="w-full rounded-lg border border-line bg-surface-alt p-2.5 text-ink focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-ink mb-1">Status Cek Fakta</label>
                <select
                  value={factCheckStatus}
                  onChange={(e) => setFactCheckStatus(e.target.value)}
                  className="w-full rounded-lg border border-line bg-surface-alt p-2.5 text-ink focus:border-primary focus:outline-none"
                >
                  <option value="NOT_READY">NOT_READY (Belum Siap)</option>
                  <option value="NEEDS_VERIFICATION">NEEDS_VERIFICATION (Perlu Verifikasi Ulang)</option>
                  <option value="READY_FOR_NEWSROOM">READY_FOR_NEWSROOM (Lulus Cek Fakta)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Catatan Koreksi Terbuka */}
        <div className="rounded-xl border border-line bg-surface p-6 shadow-xs text-xs">
          <h2 className="font-serif text-base font-bold text-ink mb-2 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-accent" />
            5. Tambah Catatan Koreksi Transparan (Correction Note)
          </h2>
          <p className="text-[11px] text-ink-muted mb-4">
            Sesuai Pedoman Koreksi Palihmana: jika terjadi revisi fakta setelah artikel terbit, tuliskan catatan koreksi secara terbuka di sini.
          </p>

          <textarea
            rows={3}
            value={correctionNote}
            onChange={(e) => setCorrectionNote(e.target.value)}
            placeholder="Contoh: 'Terdapat pembaruan data jumlah armada damkar dari sebelumnya tertulis 12 menjadi 14 unit per konfirmasi Kasatpol PP.'"
            className="w-full rounded-lg border border-line bg-surface-alt p-3 text-ink focus:border-primary focus:outline-none"
          />
        </div>

        {/* Flags */}
        <div className="flex flex-wrap items-center gap-6 rounded-xl border border-line bg-surface p-4 text-xs font-semibold text-ink">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded text-primary"
            />
            <span>Jadikan Sorotan Utama Beranda (Featured)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isSponsored}
              onChange={(e) => setIsSponsored(e.target.checked)}
              className="h-4 w-4 rounded text-primary"
            />
            <span>Label Konten Sponsor / Kemitraan</span>
          </label>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
          <Link
            href="/admin"
            className="rounded-lg border border-line bg-surface px-4 py-2.5 text-xs font-semibold text-ink hover:bg-surface-alt transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-primary-hover transition-colors shadow-xs disabled:opacity-50"
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" /> Menyimpan Perubahan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" /> Simpan Pembaruan Artikel
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
