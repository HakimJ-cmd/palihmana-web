"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Gamepad2,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  AlertCircle,
  Tag,
  Sparkles,
  Layers,
  Flame,
} from "lucide-react";
import { PmgItem } from "@/modules/pmg/queries";
import { PmgCategory, PMG_CATEGORY_LABELS } from "@/lib/constants";
import { formatDateShort } from "@/lib/utils";

interface PmgManagerProps {
  initialItems: PmgItem[];
}

export function PmgManager({ initialItems }: PmgManagerProps) {
  const [items, setItems] = useState<PmgItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PmgItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "GAME_REVIEW" as PmgCategory,
    summary: "",
    content: "",
    coverImage: "",
    rating: "9.0",
    platform: "",
    tags: "",
    featured: false,
    externalUrl: "https://www.instagram.com/pmg.id/",
  });

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      category: "GAME_REVIEW",
      summary: "",
      content: "",
      coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
      rating: "9.0",
      platform: "PC / PS5 / Mobile",
      tags: "Gaming, Reviews, Tasikmalaya",
      featured: false,
      externalUrl: "https://www.instagram.com/pmg.id/",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: PmgItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      summary: item.summary,
      content: item.content,
      coverImage: item.coverImage,
      rating: item.rating ? String(item.rating) : "9.0",
      platform: item.platform || "",
      tags: item.tags.join(", "),
      featured: item.featured,
      externalUrl: item.externalUrl || "https://www.instagram.com/pmg.id/",
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const payload = {
      title: formData.title,
      category: formData.category,
      summary: formData.summary,
      content: formData.content,
      coverImage: formData.coverImage,
      rating: parseFloat(formData.rating) || 9.0,
      platform: formData.platform,
      tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      featured: formData.featured,
      externalUrl: formData.externalUrl,
    };

    try {
      if (editingItem) {
        // Edit existing
        const res = await fetch("/api/admin/pmg", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingItem.id, ...payload }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal mengubah konten PMG");

        setItems((prev) => prev.map((item) => (item.id === editingItem.id ? data : item)));
        setFeedback({ type: "success", message: `Konten "${data.title}" berhasil diperbarui!` });
      } else {
        // Create new
        const res = await fetch("/api/admin/pmg", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Gagal membuat konten PMG");

        setItems((prev) => [data, ...prev]);
        setFeedback({ type: "success", message: `Konten "${data.title}" berhasil dipublikasikan ke PMG!` });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Terjadi kesalahan sistem." });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Hapus konten PMG "${title}"?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/pmg?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus konten");

      setItems((prev) => prev.filter((i) => i.id !== id));
      setFeedback({ type: "success", message: `Item "${title}" berhasil dihapus.` });
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "Gagal menghapus item" });
    } finally {
      setLoading(false);
    }
  };

  // Filtered Items
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = categoryFilter === "ALL" || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-teal-500/10 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-1">
              <Gamepad2 className="h-3.5 w-3.5" /> PMG DASHBOARD
            </span>
            <span className="text-xs text-ink-muted">Gaming, Toys & Pop Culture Hub</span>
          </div>
          <h2 className="text-xl font-bold font-serif text-ink mt-1">
            Manajemen Konten Page PMG
          </h2>
          <p className="text-xs text-ink-muted mt-0.5">
            Kelola ulasan game, koleksi mainan (gunpla, diecast, action figure), jadwal esports lokal, dan komunitas mabar.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Link
            href="/pmg"
            target="_blank"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg border border-line bg-surface hover:bg-surface-alt text-xs font-semibold text-ink transition-colors"
          >
            Lihat Page PMG <ExternalLink className="h-3.5 w-3.5 text-primary" />
          </Link>

          <button
            onClick={openCreateModal}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="h-4 w-4" /> Tambah Konten PMG
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`flex items-center justify-between p-3.5 rounded-lg text-xs font-medium ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
              : "bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="opacity-70 hover:opacity-100">
            ✕
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-ink-muted" />
          <input
            type="text"
            placeholder="Cari judul game, jenis mainan, atau tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-line bg-surface text-xs text-ink focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 rounded-lg border border-line bg-surface text-xs text-ink focus:outline-none focus:border-amber-500"
        >
          <option value="ALL">Semua Kategori PMG ({items.length})</option>
          <option value="GAME_REVIEW">Game Review & Tips</option>
          <option value="TOYS_HOBBY">Mainan & Koleksi (Toys)</option>
          <option value="ESPORTS_EVENT">Esports & Turnamen</option>
          <option value="GEAR_TECH">Gaming Gear & Setup</option>
          <option value="COMMUNITY">Komunitas & Mabar</option>
        </select>
      </div>

      {/* Content Table / Cards */}
      <div className="rounded-xl border border-line bg-surface overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-alt border-b border-line text-ink-muted font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Konten & Platform</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Rating</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tanggal Terbit</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-ink-muted">
                    Tidak ada konten PMG yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-alt/50 transition-colors">
                    <td className="px-4 py-3.5 max-w-md">
                      <div className="flex items-start gap-3">
                        {item.coverImage && (
                          <img
                            src={item.coverImage}
                            alt={item.title}
                            className="w-12 h-12 rounded object-cover shrink-0 border border-line"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-ink hover:text-amber-600 line-clamp-1">{item.title}</p>
                          <p className="text-[11px] text-ink-muted line-clamp-1 mt-0.5">{item.summary}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
                              {item.platform || "Multi-Platform"}
                            </span>
                            {item.featured && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                                <Flame className="h-2.5 w-2.5" /> FEATURED
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-alt border border-line text-ink">
                        {PMG_CATEGORY_LABELS[item.category] || item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <span>{item.rating ? item.rating.toFixed(1) : "-"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                        PUBLISHED
                      </span>
                    </td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-ink-muted">
                      {formatDateShort(item.publishedAt)}
                    </td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 rounded hover:bg-surface-alt text-ink-muted hover:text-amber-600 transition-colors"
                          title="Edit Konten"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 rounded hover:bg-rose-500/10 text-ink-muted hover:text-rose-600 transition-colors"
                          title="Hapus Konten"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-2xl bg-surface rounded-2xl border border-line shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-line bg-surface-alt flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-600">
                  <Gamepad2 className="h-5 w-5" />
                </span>
                <h3 className="font-serif font-bold text-base text-ink">
                  {editingItem ? "Ubah Konten PMG" : "Tambah Konten PMG Baru"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-ink-muted hover:text-ink text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-4 text-xs">
              <div>
                <label className="block font-semibold text-ink mb-1">Judul Konten PMG *</label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Review Game, Panduan Koleksi Gunpla, atau Turnamen MLBB"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-ink mb-1">Kategori PMG *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as PmgCategory })}
                    className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:border-amber-500 text-xs"
                  >
                    <option value="GAME_REVIEW">Game Review & Tips</option>
                    <option value="TOYS_HOBBY">Mainan & Koleksi (Toys)</option>
                    <option value="ESPORTS_EVENT">Esports & Turnamen</option>
                    <option value="GEAR_TECH">Gaming Gear & Setup</option>
                    <option value="COMMUNITY">Komunitas & Mabar</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-ink mb-1">Platform / Seri Mainan</label>
                  <input
                    type="text"
                    placeholder="Contoh: PC / PS5, Bandai Gunpla 1/144, Diecast"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-ink mb-1">Rating Skor (0 - 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="10"
                    placeholder="Contoh: 9.4"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-ink mb-1">URL Gambar Cover</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-ink mb-1">Ringkasan Singkat (Lead / Excerpt) *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Ringkasan 1-2 kalimat pengantar yang memikat..."
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-ink mb-1">Konten Ulasan Lengkap</label>
                <textarea
                  rows={4}
                  placeholder="Detail review, spesifikasi, tips setting, atau informasi turnamen..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:border-amber-500 text-xs font-sans leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-ink mb-1">Tags (pisahkan koma)</label>
                  <input
                    type="text"
                    placeholder="Gaming, Gunpla, Dadaha, PS5"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-ink mb-1">Link Eksternal / Sosmed PMG</label>
                  <input
                    type="url"
                    placeholder="https://www.instagram.com/pmg.id/"
                    value={formData.externalUrl}
                    onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-line bg-surface text-ink focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-surface-alt border border-line">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 text-amber-500 rounded border-line focus:ring-amber-400"
                />
                <label htmlFor="featured-checkbox" className="font-semibold text-ink cursor-pointer select-none">
                  Jadikan Sorotan Utama (Featured Banner di PMG Page)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-line shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-line bg-surface hover:bg-surface-alt text-ink font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold transition-all shadow-xs disabled:opacity-50"
                >
                  {loading ? "Menyimpan..." : editingItem ? "Simpan Perubahan" : "Terbitkan ke PMG"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
