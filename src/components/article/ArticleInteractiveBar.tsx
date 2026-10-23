"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, Play, Pause, Bookmark, Share2, Copy, Check, MessageSquare, ShieldCheck } from "lucide-react";
import { BookmarkButton } from "@/components/article/BookmarkButton";
import { ArticleItem } from "@/types";
import { sanitizeText } from "@/lib/sanitize";

interface ArticleToolbarProps {
  article: ArticleItem;
  url: string;
}

export function ArticleToolbar({ article, url }: ArticleToolbarProps) {
  const [showAudio, setShowAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const changeFontSize = (delta: number) => {
    const el = document.getElementById("article-prose-container");
    if (!el) return;
    const current = parseInt(window.getComputedStyle(el).fontSize, 10) || 18;
    const next = Math.max(14, Math.min(24, current + delta * 2));
    el.style.fontSize = `${next}px`;
    el.style.lineHeight = `${next * 1.65}px`;
  };

  return (
    <div className="flex flex-col gap-3 my-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-line py-3 text-xs text-ink-muted">
        {/* Left: Audio & Font Size */}
        <div className="flex items-center gap-2">
          {/* TTS Player button */}
          <button
            type="button"
            onClick={() => setShowAudio(!showAudio)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#eff4ff] dark:bg-[#1E314B] hover:bg-[#e5eeff] text-ink rounded border border-line transition-all text-xs font-semibold"
          >
            {showAudio ? (
              <>
                <VolumeX className="h-3.5 w-3.5 text-primary" />
                <span>Tutup Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="h-3.5 w-3.5 text-primary" />
                <span>Dengarkan Berita</span>
              </>
            )}
          </button>

          {/* Font resizer */}
          <div className="flex items-center bg-[#eff4ff] dark:bg-[#1E314B] rounded border border-line px-1 text-xs font-bold text-ink">
            <button
              type="button"
              onClick={() => changeFontSize(-1)}
              className="px-2 py-1 hover:text-primary transition-colors"
              title="Perkecil Font"
            >
              A-
            </button>
            <span className="text-line">|</span>
            <button
              type="button"
              onClick={() => changeFontSize(1)}
              className="px-2 py-1 hover:text-primary transition-colors"
              title="Perbesar Font"
            >
              A+
            </button>
          </div>
        </div>

        {/* Right: Sharing & Bookmark */}
        <div className="flex items-center gap-1.5">
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${article.title} - ${url}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-all text-xs font-bold"
            title="Bagikan ke WhatsApp"
          >
            WA
          </a>

          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded bg-surface-alt text-ink hover:bg-[#213145] hover:text-white flex items-center justify-center transition-all font-bold text-xs"
            title="Bagikan ke X / Twitter"
          >
            𝕏
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2] hover:text-white flex items-center justify-center transition-all text-xs font-bold"
            title="Bagikan ke Facebook"
          >
            FB
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="w-8 h-8 rounded bg-surface-alt text-ink hover:bg-line flex items-center justify-center transition-all"
            title="Salin Tautan"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          </button>

          <BookmarkButton article={article} size="sm" />
        </div>
      </div>

      {/* Expandable Audio Narator Bar */}
      {showAudio && (
        <div className="bg-[#213145] text-white p-4 rounded-xl shadow-md flex items-center justify-between gap-4 transition-all">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover transition-colors shadow-xs"
            >
              {isPlaying ? <Pause className="h-4 w-4 fill-white" /> : <Play className="h-4 w-4 fill-white ml-0.5" />}
            </button>
            <div>
              <p className="text-xs font-bold text-white">Narator Suara Redaksi Palihmana (AI HD)</p>
              <p className="text-[11px] text-[#bec6e0]">
                {isPlaying ? "Memutar audio liputan berita..." : "Siap diputar • Bahasa Indonesia"}
              </p>
            </div>
          </div>

          <div className="flex-1 max-w-xs hidden sm:flex items-center gap-3 text-xs text-[#bec6e0]">
            <span>01:14</span>
            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-1/3 rounded-full"></div>
            </div>
            <span>04:30</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function ReaderReactions() {
  const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

  const reactions = [
    { emoji: "😊", label: "Senang", pct: "54%" },
    { emoji: "💡", label: "Inspiratif", pct: "28%" },
    { emoji: "😲", label: "Kaget", pct: "10%" },
    { emoji: "🤔", label: "Khawatir", pct: "6%" },
    { emoji: "😢", label: "Sedih", pct: "2%" },
  ];

  return (
    <div className="bg-[#F0F7F5] dark:bg-[#071518] p-5 sm:p-6 rounded-xl border border-line/80 my-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-ink">
          Bagaimana Reaksi Anda Terhadap Liputan Ini?
        </h3>
        <span className="text-[11px] text-ink-muted">1.428 Suara Masuk</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
        {reactions.map((r) => {
          const isSelected = selectedReaction === r.label;
          return (
            <button
              key={r.label}
              type="button"
              onClick={() => setSelectedReaction(r.label)}
              className={`flex flex-col items-center gap-1 p-3 bg-white dark:bg-[#0b1c30] border rounded-xl transition-all group ${
                isSelected 
                  ? "border-primary ring-2 ring-primary/20 shadow-xs" 
                  : "border-line hover:border-primary/50"
              }`}
            >
              <span className="text-2xl group-hover:scale-115 transition-transform">{r.emoji}</span>
              <span className="text-xs font-bold text-ink">{r.label}</span>
              <span className="text-[11px] text-primary font-bold">{r.pct}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ReaderCommentsSection() {
  const [commentText, setCommentText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanComment = sanitizeText(commentText, 500);
    if (cleanComment.trim()) {
      setSubmitted(true);
      setCommentText("");
    }
  };

  return (
    <section className="mt-8 flex flex-col gap-4 border-t border-line pt-6">
      <div className="flex items-center justify-between border-b-2 border-primary pb-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="font-serif text-lg font-bold text-ink">
            Diskusi & Komentar Warga (34)
          </h3>
        </div>
        <span className="text-[11px] text-ink-muted">Sesuai Pedoman Komentar Pers</span>
      </div>

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#0E2226] border border-line p-4 rounded-xl flex flex-col gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[11px]">
            W
          </div>
          <span className="font-bold text-ink">Tulis Opini atau Masukan Warga</span>
        </div>

        <textarea
          rows={3}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Sampaikan pandangan Anda dengan santun, faktual, dan beretika..."
          className="w-full bg-[#F0F7F5] dark:bg-[#071518] text-ink p-3 rounded-lg border border-line text-xs sm:text-sm focus:outline-none focus:border-primary resize-none"
        />

        <div className="flex items-center justify-between">
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            Moderasi Redaksi Aktif
          </span>
          <button
            type="submit"
            className="px-4 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-hover transition-colors shadow-xs"
          >
            Kirim Komentar
          </button>
        </div>

        {submitted && (
          <p className="text-xs text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded">
            ✓ Komentar Anda berhasil dikirim dan sedang ditinjau tim moderasi redaksi.
          </p>
        )}
      </form>

      {/* Thread List */}
      <div className="flex flex-col gap-3 mt-2">
        <div className="p-4 bg-white dark:bg-[#0E2226] border border-line rounded-xl flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-ink">Kang Hendra Suganda</span>
              <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">Warga Tasik</span>
            </div>
            <span className="text-ink-muted text-[11px]">3 jam yang lalu</span>
          </div>
          <p className="text-xs sm:text-sm text-ink leading-relaxed">
            Liputan ini sangat mencerahkan. Sebagai warga yang sering melintas jalur selatan, percepatan akses rantai dingin logistik ikan dan perbaikan jalan lingkar benar-benar ditunggu nelayan dan pelaku UMKM lokal.
          </p>
        </div>

        <div className="p-4 bg-white dark:bg-[#0E2226] border border-line rounded-xl flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-ink">Dra. Nining Nurhayati</span>
              <span className="px-1.5 py-0.5 rounded bg-surface-alt text-ink-muted text-[10px] font-medium">Pemerhati Lingkungan</span>
            </div>
            <span className="text-ink-muted text-[11px]">4 jam yang lalu</span>
          </div>
          <p className="text-xs sm:text-sm text-ink leading-relaxed">
            Apresiasi atas sorotan terhadap sabuk hijau mangrove. Pembangunan fisik harus selalu beriringan dengan benteng ekologis alami laut lepas agar investasi tidak sia-sia dihantam abrasi.
          </p>
        </div>
      </div>
    </section>
  );
}
