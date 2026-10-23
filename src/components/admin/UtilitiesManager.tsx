"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Search,
  X,
  AlertCircle,
  Loader2,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { UtilityItem } from "@/modules/utilities/queries";
import { UTILITY_LABELS } from "@/lib/constants";
import { formatDateShort } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { UtilityCategory } from "@prisma/client";

interface UtilitiesManagerProps {
  initialUtilities: UtilityItem[];
}

export function UtilitiesManager({ initialUtilities }: UtilitiesManagerProps) {
  const [utilities, setUtilities] = useState<UtilityItem[]>(initialUtilities);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingUtility, setEditingUtility] = useState<UtilityItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "DOCUMENT" as UtilityCategory,
    description: "",
    contactNumber: "",
    gmapsLink: "",
    address: "",
    openingHours: "",
  });

  const resetForm = () => {
    setFormData({
      title: "",
      category: "DOCUMENT",
      description: "",
      contactNumber: "",
      gmapsLink: "",
      address: "",
      openingHours: "",
    });
    setEditingUtility(null);
    setErrorMessage(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: UtilityItem) => {
    setEditingUtility(item);
    setFormData({
      title: item.title,
      category: item.category,
      description: item.description || "",
      contactNumber: item.contactNumber || "",
      gmapsLink: item.gmapsLink || "",
      address: item.address || "",
      openingHours: item.openingHours || "",
    });
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const url = "/api/admin/utilities";
      const method = editingUtility ? "PUT" : "POST";
      const payload = editingUtility
        ? { id: editingUtility.id, ...formData }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gagal menyimpan data layanan.");
      }

      if (editingUtility) {
        setUtilities((prev) =>
          prev.map((u) =>
            u.id === editingUtility.id
              ? {
                  ...u,
                  ...formData,
                  lastVerifiedAt: new Date(),
                }
              : u
          )
        );
        setSuccessMessage("Informasi layanan berhasil diperbarui.");
      } else {
        const newUtility: UtilityItem = result.utility || {
          id: `utl-${Date.now()}`,
          slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          ...formData,
          isActive: true,
          sortOrder: 1,
          lastVerifiedAt: new Date(),
        };
        setUtilities((prev) => [newUtility, ...prev]);
        setSuccessMessage("Layanan warga baru berhasil ditambahkan.");
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kendala saat menyimpan layanan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus layanan "${title}"?`)) {
      return;
    }

    setIsDeleting(id);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/admin/utilities?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Gagal menghapus layanan.");
      }

      setUtilities((prev) => prev.filter((u) => u.id !== id));
      setSuccessMessage(`Layanan "${title}" berhasil dihapus.`);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal menghapus layanan.");
    } finally {
      setIsDeleting(null);
    }
  };

  // Filtered utilities
  const filteredUtilities = utilities.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchCategory =
      selectedCategory === "ALL" || u.category === selectedCategory;
    const matchSearch =
      u.title.toLowerCase().includes(q) ||
      u.description.toLowerCase().includes(q) ||
      (u.address && u.address.toLowerCase().includes(q)) ||
      (u.contactNumber && u.contactNumber.includes(q));

    return matchCategory && matchSearch;
  });

  return (
    <div>
      {/* Notifications */}
      {errorMessage && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-ink-muted hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-teal-500/30 bg-teal-500/10 p-3 text-xs text-teal-700 dark:text-teal-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-600" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-ink-muted hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Action Header & Search */}
      <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
            <input
              type="text"
              placeholder="Cari layanan, alamat, kontak..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface py-2 pl-9 pr-3 text-xs text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-line bg-surface px-3 py-2 text-xs text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">Semua Kategori</option>
            <option value="EMERGENCY">Darurat (Emergency)</option>
            <option value="DOCUMENT">Dokumen & Kependudukan</option>
            <option value="TRANSPORT">Transportasi</option>
            <option value="HEALTH">Kesehatan</option>
            <option value="UMKM">Peluang Usaha & Izin (UMKM)</option>
          </select>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-hover transition-colors"
        >
          <Plus className="h-4 w-4" /> Tambah Layanan Warga
        </button>
      </div>

      {/* Utilities Table */}
      <div className="rounded-xl border border-line bg-surface overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-surface-alt font-sans text-ink-muted uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-semibold">Nama Layanan</th>
                <th className="px-6 py-3 font-semibold">Kategori</th>
                <th className="px-6 py-3 font-semibold">Kontak / Telepon</th>
                <th className="px-6 py-3 font-semibold">Jam Buka</th>
                <th className="px-6 py-3 font-semibold">Status Cek</th>
                <th className="px-6 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {filteredUtilities.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-ink-muted">
                    Tidak ada direktori layanan yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredUtilities.map((u) => {
                  const categoryLabel = UTILITY_LABELS[u.category] || u.category;
                  const isEmergency = u.category === "EMERGENCY";

                  return (
                    <tr key={u.id} className="hover:bg-surface-alt/50 transition-colors">
                      <td className="px-6 py-4 font-serif text-sm font-semibold text-ink">
                        <span className="line-clamp-1 max-w-sm">{u.title}</span>
                        <span className="block font-sans text-[11px] font-normal text-ink-muted line-clamp-1 mt-0.5">
                          {u.description}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={isEmergency ? "danger" : "utility"} size="sm">
                          {categoryLabel}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-mono text-ink whitespace-nowrap">
                        {u.contactNumber || "-"}
                      </td>
                      <td className="px-6 py-4 text-ink-muted whitespace-nowrap">
                        {u.openingHours || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          {u.lastVerifiedAt ? formatDateShort(u.lastVerifiedAt) : "Terverifikasi"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/layanan/${u.slug}`}
                            target="_blank"
                            title="Pratinjau Publik"
                            className="p-1 text-ink-muted hover:text-primary transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit(u)}
                            title="Sunting Layanan"
                            className="inline-flex items-center gap-1 rounded bg-surface-alt px-2 py-1 text-xs font-semibold text-ink hover:text-primary hover:bg-surface transition-colors"
                          >
                            <Edit2 className="h-3 w-3" /> Sunting
                          </button>
                          <button
                            onClick={() => handleDelete(u.id, u.title)}
                            disabled={isDeleting === u.id}
                            title="Hapus Layanan"
                            className="p-1 text-ink-muted hover:text-red-500 transition-colors disabled:opacity-50"
                          >
                            {isDeleting === u.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog for Create/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-line bg-surface p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-ink">
                  {editingUtility ? "Sunting Layanan Warga" : "Tambah Layanan Warga Baru"}
                </h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Pastikan informasi kontak, jam operasional, dan lokasi akurat untuk warga.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-ink-muted hover:text-ink hover:bg-surface-alt"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Judul & Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-ink mb-1">
                    Nama Layanan / Instansi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Disdukcapil Kota Tasikmalaya"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-ink mb-1">
                    Kategori Layanan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as UtilityCategory })
                    }
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="EMERGENCY">Darurat (Emergency)</option>
                    <option value="DOCUMENT">Dokumen & Kependudukan</option>
                    <option value="TRANSPORT">Transportasi</option>
                    <option value="HEALTH">Kesehatan</option>
                    <option value="UMKM">Peluang Usaha & Izin (UMKM)</option>
                  </select>
                </div>
              </div>

              {/* Kontak & Jam Operasional */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-ink mb-1">
                    Nomor Telepon / WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: +62265330193 atau 112"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-ink mb-1">
                    Jam Operasional / Pelayanan
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Senin – Jumat, 08.00 – 15.00 WIB"
                    value={formData.openingHours}
                    onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Alamat & Maps */}
              <div className="space-y-4">
                <div>
                  <label className="block font-semibold text-ink mb-1">
                    Alamat Lengkap Kantor / Lokasi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Jl. Ir. H. Juanda No.190, Sukamulya, Bungursari, Kota Tasikmalaya"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-ink mb-1">
                    Link Google Maps (Opsional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://maps.google.com/..."
                    value={formData.gmapsLink}
                    onChange={(e) => setFormData({ ...formData, gmapsLink: e.target.value })}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block font-semibold text-ink mb-1">
                  Deskripsi & Panduan Alur Layanan <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Jelaskan jenis urusan yang dilayani, syarat dasar, atau alur yang perlu disiapkan warga..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-line px-4 py-2 text-xs font-semibold text-ink hover:bg-surface-alt transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-hover transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Menyimpan...
                    </>
                  ) : editingUtility ? (
                    "Simpan Perubahan"
                  ) : (
                    "Tambah Layanan"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
