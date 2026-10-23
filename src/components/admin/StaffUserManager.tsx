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
      setSuccessMessage(result.message || "Akun kontributor berhasil dibuat.");
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kendala saat membuat akun.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Yakin ingin menghapus akun "${name}"?`)) {
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
            <User className="h-3 w-3" /> Kontributor
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

      {/* Role Alert / Notice */}
      {!isSuperAdmin && (
        <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            Hanya pengguna dengan peran <strong>Super Admin</strong> yang memiliki izin membuat atau menghapus akun kontributor.
          </span>
        </div>
      )}

      {/* Header Actions */}
      <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs text-ink-muted">
            Total Akun Staf & Kontributor: <strong className="text-ink">{users.length}</strong>
          </span>
        </div>

        {isSuperAdmin && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-hover transition-colors"
          >
            <UserPlus className="h-4 w-4" /> Buat Akun Kontributor / Staf
          </button>
        )}
      </div>

      {/* Staff Users Table */}
      <div className="rounded-xl border border-line bg-surface overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-line bg-surface-alt font-sans text-ink-muted uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-semibold">Nama Staf</th>
                <th className="px-6 py-3 font-semibold">Email Resmi</th>
                <th className="px-6 py-3 font-semibold">Peran (Role)</th>
                <th className="px-6 py-3 font-semibold">Tanggal Dibuat</th>
                {isSuperAdmin && (
                  <th className="px-6 py-3 text-right font-semibold">Aksi</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60">
              {users.map((u) => {
                const canDelete =
                  isSuperAdmin && u.role !== "SUPER_ADMIN";

                return (
                  <tr key={u.id} className="hover:bg-surface-alt/50 transition-colors">
                    <td className="px-6 py-4 font-serif text-sm font-semibold text-ink">
                      {u.name || "Tanpa Nama"}
                    </td>
                    <td className="px-6 py-4 font-mono text-ink">
                      {u.email}
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
                            title="Hapus Akun"
                            className="inline-flex items-center gap-1 rounded px-2 py-1 text-ink-muted hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
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
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog for Creating Contributor / Editor Account */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-line bg-surface p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-line pb-4 mb-4">
              <div>
                <h3 className="font-serif text-lg font-bold text-ink">
                  Buat Akun Kontributor / Staf
                </h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Daftarkan akun untuk kontributor liputan warga atau editor baru.
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
                  Nama Lengkap Kontributor <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rian Hidayat (Budaya Tasik)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-line bg-surface pl-9 pr-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block font-semibold text-ink mb-1">
                  Alamat Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                  <input
                    type="email"
                    required
                    placeholder="kontributor@palihmana.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-lg border border-line bg-surface pl-9 pr-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block font-semibold text-ink mb-1">
                  Kata Sandi Awal (Min. 8 Karakter) <span className="text-red-500">*</span>
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
                  Peran & Tingkat Otoritas <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="CONTRIBUTOR">
                    CONTRIBUTOR — Menulis draf liputan warga & sosok lokal
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
