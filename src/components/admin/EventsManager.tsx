"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  X,
  AlertCircle,
  Loader2,
  Ticket,
} from "lucide-react";
import { EventItem } from "@/modules/events/queries";
import { formatDateShort } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface EventsManagerProps {
  initialEvents: EventItem[];
}

export function EventsManager({ initialEvents }: EventsManagerProps) {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    eventDate: "",
    eventEnd: "",
    location: "",
    gmapsLink: "",
    organizer: "",
    priceType: "FREE" as "FREE" | "PAID",
    priceNote: "",
    registrationLink: "",
    description: "",
    isVerified: true,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      eventDate: "",
      eventEnd: "",
      location: "",
      gmapsLink: "",
      organizer: "",
      priceType: "FREE",
      priceNote: "",
      registrationLink: "",
      description: "",
      isVerified: true,
    });
    setEditingEvent(null);
    setErrorMessage(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (event: EventItem) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      eventDate: event.eventDate
        ? new Date(event.eventDate).toISOString().slice(0, 16)
        : "",
      eventEnd: event.eventEnd
        ? new Date(event.eventEnd).toISOString().slice(0, 16)
        : "",
      location: event.location,
      gmapsLink: event.gmapsLink || "",
      organizer: event.organizer,
      priceType: (event.priceType as "FREE" | "PAID") || "FREE",
      priceNote: event.priceNote || "",
      registrationLink: event.registrationLink || "",
      description: event.description || "",
      isVerified: event.isVerified ?? true,
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
      const url = "/api/admin/events";
      const method = editingEvent ? "PUT" : "POST";
      const payload = editingEvent
        ? { id: editingEvent.id, ...formData }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gagal menyimpan agenda acara.");
      }

      if (editingEvent) {
        setEvents((prev) =>
          prev.map((ev) =>
            ev.id === editingEvent.id
              ? {
                  ...ev,
                  ...formData,
                  eventDate: new Date(formData.eventDate),
                  eventEnd: formData.eventEnd ? new Date(formData.eventEnd) : null,
                }
              : ev
          )
        );
        setSuccessMessage("Agenda acara berhasil diperbarui.");
      } else {
        const newEvent: EventItem = result.event || {
          id: `evt-${Date.now()}`,
          slug: formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          ...formData,
          eventDate: new Date(formData.eventDate),
          eventEnd: formData.eventEnd ? new Date(formData.eventEnd) : null,
          status: "SCHEDULED" as any,
        };
        setEvents((prev) => [newEvent, ...prev]);
        setSuccessMessage("Agenda acara baru berhasil ditambahkan.");
      }

      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan saat memproses data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus agenda "${title}"?`)) {
      return;
    }

    setIsDeleting(id);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/admin/events?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Gagal menghapus agenda.");
      }

      setEvents((prev) => prev.filter((ev) => ev.id !== id));
      setSuccessMessage(`Agenda "${title}" berhasil dihapus.`);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal menghapus acara.");
    } finally {
      setIsDeleting(null);
    }
  };

  // Filtered Events
  const filteredEvents = events.filter((e) => {
    const q = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q) ||
      e.organizer.toLowerCase().includes(q)
    );
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
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
          <input
            type="text"
            placeholder="Cari nama agenda, lokasi, atau penyelenggara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-line bg-surface py-2 pl-9 pr-3 text-xs text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-hover transition-colors"
        >
          <Plus className="h-4 w-4" /> Tambah Agenda Acara
        </button>
      </div>

      {/* Events Table */}
      <div className="rounded-xl border border-line bg-surface overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-surface-alt font-sans text-ink-muted uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-semibold">Nama Acara</th>
                <th className="px-6 py-3 font-semibold">Tanggal & Jam</th>
                <th className="px-6 py-3 font-semibold">Lokasi</th>
                <th className="px-6 py-3 font-semibold">Penyelenggara</th>
                <th className="px-6 py-3 font-semibold">Status Tiket</th>
                <th className="px-6 py-3 font-semibold">Verifikasi</th>
                <th className="px-6 py-3 text-right font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-ink-muted">
                    Tidak ada agenda acara yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((e) => {
                  const isFree = e.priceType === "FREE";

                  return (
                    <tr key={e.id} className="hover:bg-surface-alt/50 transition-colors">
                      <td className="px-6 py-4 font-serif text-sm font-semibold text-ink">
                        <span className="line-clamp-1 max-w-sm">{e.title}</span>
                        {e.description && (
                          <span className="block font-sans text-[11px] font-normal text-ink-muted line-clamp-1 mt-0.5">
                            {e.description}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-ink tabular-nums whitespace-nowrap">
                        {formatDateShort(e.eventDate)}
                      </td>
                      <td className="px-6 py-4 text-ink-muted max-w-xs truncate">
                        {e.location}
                      </td>
                      <td className="px-6 py-4 text-ink">
                        {e.organizer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={isFree ? "success" : "default"} size="sm">
                          {isFree ? "Gratis" : "Berbayar"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {e.isVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-teal-600 dark:text-teal-400 font-semibold">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Terverifikasi
                          </span>
                        ) : (
                          <span className="text-[11px] text-amber-600 font-medium">
                            Belum Cek
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/kalender/${e.slug}`}
                            target="_blank"
                            title="Pratinjau Publik"
                            className="p-1 text-ink-muted hover:text-primary transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit(e)}
                            title="Sunting Agenda"
                            className="inline-flex items-center gap-1 rounded bg-surface-alt px-2 py-1 text-xs font-semibold text-ink hover:text-primary hover:bg-surface transition-colors"
                          >
                            <Edit2 className="h-3 w-3" /> Sunting
                          </button>
                          <button
                            onClick={() => handleDelete(e.id, e.title)}
                            disabled={isDeleting === e.id}
                            title="Hapus Agenda"
                            className="p-1 text-ink-muted hover:text-red-500 transition-colors disabled:opacity-50"
                          >
                            {isDeleting === e.id ? (
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
                  {editingEvent ? "Sunting Agenda Acara" : "Tambah Agenda Acara Baru"}
                </h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Isi data kurasi kegiatan warga dengan akurat.
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
              {/* Judul */}
              <div>
                <label className="block font-semibold text-ink mb-1">
                  Nama Agenda Acara <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pameran Kriya & Tenun Taraju 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Tanggal & Jam */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-ink mb-1">
                    Waktu Mulai <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-ink mb-1">
                    Waktu Berakhir (Opsional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.eventEnd}
                    onChange={(e) => setFormData({ ...formData, eventEnd: e.target.value })}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Lokasi & Google Maps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-ink mb-1">
                    Lokasi / Tempat <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Gedung Kesenian Kompleks Dadaha"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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

              {/* Penyelenggara & Tipe Tiket */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-ink mb-1">
                    Penyelenggara / Inisiator <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Dewan Kebudayaan Kota Tasikmalaya"
                    value={formData.organizer}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-ink mb-1">
                    Kategori Tiket
                  </label>
                  <select
                    value={formData.priceType}
                    onChange={(e) => setFormData({ ...formData, priceType: e.target.value as any })}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="FREE">Gratis (Tanpa Biaya)</option>
                    <option value="PAID">Berbayar</option>
                  </select>
                </div>
              </div>

              {/* Catatan Harga & Link Registrasi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-ink mb-1">
                    Keterangan Tiket / Biaya
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Rp 25.000 (Early Bird) atau Terbuka Umum"
                    value={formData.priceNote}
                    onChange={(e) => setFormData({ ...formData, priceNote: e.target.value })}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-ink mb-1">
                    Tautan Pendaftaran / Info Tiket
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.registrationLink}
                    onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
                    className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block font-semibold text-ink mb-1">
                  Deskripsi & Rincian Agenda <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Ceritakan latar belakang, pengisi acara, dan hal menarik dari kegiatan ini..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                />
              </div>

              {/* Verifikasi Status */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isVerifiedCheckbox"
                  checked={formData.isVerified}
                  onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                  className="rounded border-line text-primary focus:ring-primary h-4 w-4"
                />
                <label htmlFor="isVerifiedCheckbox" className="font-medium text-ink cursor-pointer">
                  Tandai sebagai kegiatan yang telah terverifikasi oleh redaksi Palihmana
                </label>
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
                  ) : editingEvent ? (
                    "Simpan Perubahan"
                  ) : (
                    "Terbitkan Agenda"
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
