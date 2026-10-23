import React from "react";
import Link from "next/link";
import { ArrowLeft, Users, ShieldAlert } from "lucide-react";
import { getSession } from "@/lib/session";
import { getStaffUsers } from "@/modules/users/store";
import { StaffUserManager } from "@/components/admin/StaffUserManager";

export const metadata = {
  title: "Kelola Akun Staf & Kontributor — Admin Palihmana",
};

export default async function AdminUsersPage() {
  const session = await getSession();
  const staffUsers = await getStaffUsers();

  const userRole = session?.role || "SUPER_ADMIN";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ─── Breadcrumb ─────────────────────────────────────────────── */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
        </Link>
        <span className="text-xs text-ink-muted">
          Peran Anda: <strong className="text-ink">{userRole}</strong>
        </span>
      </div>

      <div className="mb-8 border-b border-line pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Kelola Staf Redaksi & Kontributor Warga
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-ink-muted">
            Super Admin dapat menambahkan akun baru untuk kontributor daerah dan editor redaksi Palihmana.id.
          </p>
        </div>
      </div>

      {/* Staff User Manager Component */}
      <StaffUserManager
        initialUsers={staffUsers}
        currentUserRole={userRole}
      />
    </div>
  );
}
