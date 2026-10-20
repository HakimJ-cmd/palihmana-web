import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { User, Bookmark, Shield, LogOut, ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata = {
  title: `Profil Akun Baraya — ${SITE_CONFIG.name}`,
};

export default async function AkunPage() {
  const session = await getSession();

  if (!session) {
    redirect("/masuk?from=/akun");
  }

  const isStaff = ["SUPER_ADMIN", "EDITOR", "CONTRIBUTOR"].includes(session.role);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {/* ─── Breadcrumb ─────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-ink-muted">
        <Link href="/" className="hover:text-primary transition-colors">
          Beranda
        </Link>
        <span>/</span>
        <span className="font-semibold text-primary">Profil Akun</span>
      </nav>

      {/* Profile Card */}
      <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-line">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white font-serif text-2xl font-bold shadow-xs">
              {(session.name || "B").charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl font-bold text-ink">
                  {session.name || "Warga Palihmana"}
                </h1>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary uppercase">
                  {session.role === "MEMBER" ? "Baraya" : session.role}
                </span>
              </div>
              <p className="text-xs text-ink-muted mt-0.5">{session.email}</p>
            </div>
          </div>

          <LogoutButton />
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 1: Simpanan Saya */}
          <Link
            href="/simpanan"
            className="rounded-xl border border-line bg-surface-alt p-5 hover:border-primary/50 transition-all group"
          >
            <div className="flex items-center justify-between text-primary mb-3">
              <Bookmark className="h-6 w-6 fill-primary/20" />
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
            <h2 className="font-serif text-base font-bold text-ink group-hover:text-primary transition-colors">
              Simpanan Saya
            </h2>
            <p className="text-xs text-ink-muted mt-1 leading-relaxed">
              Buka artikel, panduan layanan, dan investigasi yang Anda tandai untuk dibaca nanti.
            </p>
          </Link>

          {/* Card 2: Staff CMS (if applicable) or Panduan Warga */}
          {isStaff ? (
            <Link
              href="/admin"
              className="rounded-xl border border-primary/30 bg-primary/5 p-5 hover:bg-primary/10 transition-all group"
            >
              <div className="flex items-center justify-between text-primary mb-3">
                <Shield className="h-6 w-6" />
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
              <h2 className="font-serif text-base font-bold text-ink group-hover:text-primary transition-colors">
                Panel Redaksi & CMS
              </h2>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                Anda memiliki akses staf redaksi. Tulis artikel baru, cek fakta, dan kelola arsip.
              </p>
            </Link>
          ) : (
            <Link
              href="/layanan"
              className="rounded-xl border border-line bg-surface-alt p-5 hover:border-primary/50 transition-all group"
            >
              <div className="flex items-center justify-between text-primary mb-3">
                <BookOpen className="h-6 w-6" />
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
              <h2 className="font-serif text-base font-bold text-ink group-hover:text-primary transition-colors">
                Pusat Layanan Warga
              </h2>
              <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                Temukan nomor kontak darurat 24 jam dan alur pembuatan dokumen resmi Kota Tasikmalaya.
              </p>
            </Link>
          )}
        </div>

        {/* Security & Privacy info */}
        <div className="mt-8 pt-6 border-t border-line text-xs text-ink-muted flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span>Keamanan: Sesi terenkripsi HttpOnly cookie (Sesuai UU PDP)</span>
          <Link href="/privasi" className="text-primary hover:underline font-semibold">
            Kebijakan Privasi Data &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
