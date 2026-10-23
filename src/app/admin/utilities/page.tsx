import React from "react";
import Link from "next/link";
import { ArrowLeft, Building2, Plus, Phone, MapPin, ExternalLink, ShieldCheck } from "lucide-react";
import { getUtilities } from "@/modules/utilities/queries";
import { UTILITY_LABELS } from "@/lib/constants";
import { formatDateShort } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { getSession } from "@/lib/session";
import { UtilitiesManager } from "@/components/admin/UtilitiesManager";

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

      {/* Utilities Manager Component */}
      <UtilitiesManager initialUtilities={utilities} />
    </div>
  );
}
