import React from "react";
import Link from "next/link";
import { Gamepad2, ArrowLeft, ExternalLink } from "lucide-react";
import { getSession } from "@/lib/session";
import { getPmgItems } from "@/modules/pmg/queries";
import { PmgManager } from "@/components/admin/PmgManager";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const metadata = {
  title: "Kelola PMG (Gaming & Toys) — Admin Palihmana.ID",
  description: "Manajemen konten ulasan game, mainan hobi, turnamen esports, dan komunitas PMG.",
};

export default async function AdminPmgPage() {
  const session = await getSession();
  const items = await getPmgItems();

  return (
    <div className="mx-auto max-w-page px-4 py-8 sm:px-6 lg:px-8">
      {/* Navigation header */}
      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-ink hover:bg-surface-alt transition-colors"
            title="Kembali ke Dashboard Utama"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-amber-500 px-2.5 py-0.5 text-[11px] font-black uppercase text-slate-950 tracking-wider">
                PMG MODULE
              </span>
              <span className="text-xs text-ink-muted">
                Admin: <strong className="text-ink">{session?.name || "Staf Redaksi"}</strong>
              </span>
            </div>
            <h1 className="mt-1 font-serif text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Manajemen PMG (Gaming, Toys & Pop Culture)
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/pmg"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-semibold text-ink hover:bg-surface-alt transition-colors"
          >
            Buka Halaman PMG <ExternalLink className="h-3.5 w-3.5 text-primary" />
          </Link>
          <LogoutButton />
        </div>
      </div>

      <div className="mt-6">
        <PmgManager initialItems={items} />
      </div>
    </div>
  );
}
