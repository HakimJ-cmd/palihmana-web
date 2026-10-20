import React from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Plus, Phone, MapPin, ExternalLink, ShieldCheck } from "lucide-react";
import { getUtilities } from "@/modules/utilities/queries";
import { UTILITY_LABELS } from "@/lib/constants";
import { formatDateShort } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { getSession } from "@/lib/session";

export const metadata = {
  title: "Kelola Layanan Warga & Nomor Darurat — Admin Palihmana",
};

export default async function AdminUtilitiesPage() {
  const session = await getSession();
  const utilities = await getUtilities();

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
          Total Layanan: <strong className="text-ink">{utilities.length}</strong>
        </span>
      </div>

      <div className="mb-8 border-b border-line pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            Kelola Direktori Layanan & Nomor Darurat
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-ink-muted">
            Pusat data kontak instansi publik, jam pelayanan, dan alur prosedur untuk warga Kota Tasikmalaya.
          </p>
        </div>

        <Link
          href="/layanan"
          target="_blank"
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink hover:bg-surface-alt transition-colors self-start sm:self-auto"
        >
          Lihat Halaman Publik <ExternalLink className="h-3.5 w-3.5" />
        </Link>
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
              {utilities.map((u) => {
                const categoryLabel = UTILITY_LABELS[u.category] || u.category;
                const isEmergency = u.category === "EMERGENCY";

                return (
                  <tr key={u.id} className="hover:bg-surface-alt/50 transition-colors">
                    <td className="px-6 py-4 font-serif text-sm font-semibold text-ink">
                      <span className="line-clamp-1 max-w-sm">{u.title}</span>
                      <span className="block font-sans text-[11px] font-normal text-ink-muted line-clamp-1">
                        {u.description}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={isEmergency ? "danger" : "utility"} size="sm">
                        {categoryLabel}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-mono text-ink">
                      {u.contactNumber || "-"}
                    </td>
                    <td className="px-6 py-4 text-ink-muted">
                      {u.openingHours || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {u.lastVerifiedAt ? formatDateShort(u.lastVerifiedAt) : "Terverifikasi"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/layanan/${u.slug}`}
                        target="_blank"
                        className="font-bold text-primary hover:text-primary-hover hover:underline"
                      >
                        Lihat Panduan
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
