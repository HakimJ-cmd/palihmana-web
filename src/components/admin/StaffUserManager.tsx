"use client";

import React, { useState } from "react";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Trash2,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
  Lock,
  Mail,
  User,
  Shield,
  KeyRound,
  Search,
  Copy,
  Check,
} from "lucide-react";
import { StaffUserItem } from "@/modules/users/store";
import { formatDateShort } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface StaffUserManagerProps {
  initialUsers: StaffUserItem[];
  currentUserRole: string;
}

export function StaffUserManager({
  initialUsers,
  currentUserRole,
}: StaffUserManagerProps) {
  const [users, setUsers] = useState<StaffUserItem[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "CONTRIBUTOR" | "EDITOR" | "SUPER_ADMIN">("ALL");

  const isSuperAdmin = currentUserRole === "SUPER_ADMIN";

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CONTRIBUTOR" as "CONTRIBUTOR" | "EDITOR",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "CONTRIBUTOR",
    });
    setErrorMessage(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gagal membuat akun.");
      }

      setUsers((prev) => [result.user, ...prev]);
      setSuccessMessage(result.message || `Akun ${formData.role} berhasil dibuat.`);
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kendala saat membuat akun.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus akun "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    setIsDeleting(id);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/admin/users?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gagal menghapus akun.");
      }

      setUsers((prev) => prev.filter((u) => u.id !== id));
      setSuccessMessage(`Akun "${name}" berhasil dihapus.`);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal menghapus akun.");
    } finally {
      setIsDeleting(null);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-teal-500/15 px-2 py-0.5 text-[11px] font-bold text-teal-700 dark:text-teal-300 border border-teal-500/30">
            <ShieldCheck className="h-3 w-3" /> Super Admin
          </span>
        );
      case "EDITOR":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-blue-500/15 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:text-blue-300 border border-blue-500/30">
            <Shield className="h-3 w-3" /> Editor Redaksi
          </span>
        );
      case "CONTRIBUTOR":
        return (
          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
            <User className="h-3 w-3" /> Kontributor Warga
          </span>
        );
      default:
        return (
          <span className="rounded bg-surface-alt px-2 py-0.5 text-[11px] font-medium text-ink-muted">
            {role}
          </span>
        );
    }
  };

  // Filtered users
  const filteredUsers = users.filter((u) => {
    const matchQuery =
      (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchQuery && matchRole;
  });

  const totalContributors = users.filter((u) => u.role === "CONTRIBUTOR").length;
  const totalEditors = users.filter((u) => u.role === "EDITOR").length;
  const totalSuperAdmins = users.filter((u) => u.role === "SUPER_ADMIN").length;

  return (
    <div>
      {/* ─── Top Stats Cards ─────────────────────────────────────────── */}
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Kontributor */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 shadow-xs">
          <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300">
            <span className="text-[11px] font-bold uppercase tracking-wider">Kontributor Warga</span>
            <User className="h-4 w-4" />
          </div>
          <p className="mt-2 font-serif text-2xl font-bold text-ink">
            {totalContributors} <span className="text-xs font-sans font-normal text-ink-muted">Akun</span>
          </p>
          <p className="mt-1 text-[11px] text-ink-muted">Penulis liputan lokal daerah</p>
        </div>

        {/* Total Editor */}
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 shadow-xs">
          <div className="flex items-center justify-between text-blue-700 dark:text-blue-300">
            <span className="text-[11px] font-bold uppercase tracking-wider">Editor Redaksi</span>
            <Shield className="h-4 w-4" />
          </div>
          <p className="mt-2 font-serif text-2xl font-bold text-ink">
            {totalEditors} <span className="text-xs font-sans font-normal text-ink-muted">Akun</span>
          </p>
          <p className="mt-1 text-[11px] text-ink-muted">Penyunting & verifikasi fakta</p>
        </div>

        {/* Total Super Admin */}
        <div className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-4 shadow-xs">
          <div className="flex items-center justify-between text-teal-700 dark:text-teal-300">
            <span className="text-[11px] font-bold uppercase tracking-wider">Super Admin</span>
            <ShieldCheck className="h-4 w-4" />
          </div>
          <p className="mt-2 font-serif text-2xl font-bold text-ink">
            {totalSuperAdmins} <span className="text-xs font-sans font-normal text-ink-muted">Akun</span>
          </p>
          <p className="mt-1 text-[11px] text-ink-muted">Otoritas penuh sistem & akun</p>
        </div>

        {/* Status Akses */}
        <div className="rounded-xl border border-line bg-surface-alt p-4 shadow-xs">
          <div className="flex items-center justify-between text-ink-muted">
            <span className="text-[11px] font-bold uppercase tracking-wider">Status Akses Akun</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <p className="mt-2 font-serif text-2xl font-bold text-ink">
            {users.length} <span className="text-xs font-sans font-normal text-ink-muted">Total Staf</span>
          </p>
          <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            Semua akun aktif dan terproteksi
          </p>
        </div>
      </div>

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

      {/* Role Alert / Notice */}
      {!isSuperAdmin && (
        <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            Hanya pengguna dengan peran <strong>Super Admin</strong> yang memiliki izin membuat atau menghapus akun kontributor.
          </span>
        </div>
      )}

      {/* ─── Search, Filter & Action Bar ─────────────────────────────── */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Role Tabs */}
        <div className="flex items-center gap-1.5 bg-surface-alt p-1 rounded-lg border border-line text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setRoleFilter("ALL")}
            className={`rounded-md px-3 py-1.5 transition-all shrink-0 ${
              roleFilter === "ALL"
                ? "bg-surface text-ink shadow-xs font-bold"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            Semua ({users.length})
          </button>
          <button
            onClick={() => setRoleFilter("CONTRIBUTOR")}
            className={`rounded-md px-3 py-1.5 transition-all shrink-0 ${
              roleFilter === "CONTRIBUTOR"
                ? "bg-surface text-emerald-600 dark:text-emerald-400 shadow-xs font-bold"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            Kontributor ({totalContributors})
          </button>
          <button
            onClick={() => setRoleFilter("EDITOR")}
            className={`rounded-md px-3 py-1.5 transition-all shrink-0 ${
              roleFilter === "EDITOR"
                ? "bg-surface text-blue-600 dark:text-blue-400 shadow-xs font-bold"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            Editor ({totalEditors})
          </button>
          <button
            onClick={() => setRoleFilter("SUPER_ADMIN")}
            className={`rounded-md px-3 py-1.5 transition-all shrink-0 ${
              roleFilter === "SUPER_ADMIN"
                ? "bg-surface text-teal-600 dark:text-teal-400 shadow-xs font-bold"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            Super Admin ({totalSuperAdmins})
          </button>
        </div>

        {/* Search & Create Button */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-line bg-surface pl-9 pr-3 py-2 text-xs text-ink focus:border-primary focus:outline-none"
            />
          </div>

          {isSuperAdmin && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-hover transition-colors shrink-0"
            >
              <UserPlus className="h-4 w-4" /> Buat Akun Baru
            </button>
          )}
        </div>
      </div>

      {/* ─── Staff Users Table ───────────────────────────────────────── */}
      <div className="rounded-xl border border-line bg-surface overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-surface-alt font-sans text-ink-muted uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-semibold">Nama Staf / Kontributor</th>
                <th className="px-6 py-3 font-semibold">Alamat Email</th>
                <th className="px-6 py-3 font-semibold">Peran (Role)</th>
                <th className="px-6 py-3 font-semibold">Tanggal Terdaftar</th>
                {isSuperAdmin && (
                  <th className="px-6 py-3 text-right font-semibold">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-ink-muted">
                    Tidak ditemukan akun staf atau kontributor yang cocok.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const canDelete = isSuperAdmin && u.role !== "SUPER_ADMIN";

                  return (
                    <tr key={u.id} className="hover:bg-surface-alt/50 transition-colors">
                      <td className="px-6 py-4 font-serif text-sm font-semibold text-ink">
                        {u.name || "Tanpa Nama"}
                      </td>
                      <td className="px-6 py-4 font-mono text-ink">
                        <div className="flex items-center gap-1.5">
                          <span>{u.email}</span>
                          <button
                            onClick={() => copyToClipboard(u.email, u.id)}
                            className="text-ink-muted hover:text-ink"
                            title="Salin email"
                          >
                            {copiedId === u.id ? (
                              <Check className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getRoleBadge(u.role)}
                      </td>
                      <td className="px-6 py-4 text-ink-muted tabular-nums">
                        {formatDateShort(u.createdAt)}
                      </td>
                      {isSuperAdmin && (
                        <td className="px-6 py-4 text-right">
                          {canDelete ? (
                            <button
                              onClick={() => handleDelete(u.id, u.name || u.email)}
                              disabled={isDeleting === u.id}
                              title="Hapus Akun Kontributor"
                              className="inline-flex items-center gap-1 rounded px-2.5 py-1 text-red-600 hover:text-red-700 hover:bg-red-500/10 transition-colors disabled:opacity-50 font-semibold"
                            >
                              {isDeleting === u.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <>
                                  <Trash2 className="h-3.5 w-3.5" /> Hapus
                                </>
                              )}
                            </button>
                          ) : (
                            <span className="text-[11px] text-ink-muted italic">
                              Akun Utama
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Modal Dialog for Creating Contributor / Editor Account ──── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-line bg-surface p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-ink">
                  Buat Akun Kontributor / Staf Baru
                </h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Super Admin mendaftarkan akun baru untuk kontributor warga atau editor redaksi.
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
              {/* Nama Lengkap */}
              <div>
                <label className="block font-semibold text-ink mb-1">
                  Nama Lengkap Kontributor / Staf <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rian Hidayat (Kontributor Budaya)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-line bg-surface pl-9 pr-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-semibold text-ink mb-1">
                  Alamat Email Resmi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                  <input
                    type="email"
                    required
                    placeholder="kontributor.nama@palihmana.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-line bg-surface pl-9 pr-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block font-semibold text-ink mb-1">
                  Kata Sandi Awal (Minimal 8 Karakter) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                  <input
                    type="password"
                    required
                    minLength={8}
                    placeholder="Minimal 8 karakter aman"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-lg border border-line bg-surface pl-9 pr-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block font-semibold text-ink mb-1">
                  Tipe Peran (Role) <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-medium"
                >
                  <option value="CONTRIBUTOR">
                    CONTRIBUTOR — Menulis liputan warga, sosok inspiratif & draf berita
                  </option>
                  <option value="EDITOR">
                    EDITOR — Menulis, menyunting, dan verifikasi fakta artikel
                  </option>
                </select>
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
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Mendaftarkan...
                    </>
                  ) : (
                    "Daftarkan Akun"
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
