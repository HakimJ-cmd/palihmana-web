"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  KeyRound,
  ArrowRight,
  AlertCircle,
  Loader2,
  Lock,
  ArrowLeft,
  CheckCircle2,
  FileCheck2,
  Database,
  Eye,
  EyeOff,
} from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

export default function RedaksiPortalPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Autentikasi gagal. Periksa email atau kata sandi.");
      }

      const staffRoles = ["SUPER_ADMIN", "EDITOR", "CONTRIBUTOR"];
      if (!staffRoles.includes(data.user?.role)) {
        throw new Error("Akun ini terdaftar sebagai anggota umum, bukan staf redaksi atau kontributor.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Akses ditolak. Periksa kredensial redaksi Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#040E10] text-slate-100 selection:bg-teal-500 selection:text-white">
      {/* ─── Left Panel: Editorial Identity & Security Principles ─── */}
      <div className="relative flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-teal-900/40 bg-gradient-to-br from-[#061B1E] via-[#041215] to-[#020B0D] overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="mb-8">
            <BrandLogo size="lg" theme="dark" showTagline={true} />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-teal-300 mb-6 tracking-wide">
            <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
            PORTAL RESMI REDAKSI & KONTRIBUTOR
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            Menjaga Integritas Data, Panduan Solutif Warga.
          </h1>

          <p className="mt-4 text-sm sm:text-base text-teal-100/70 max-w-xl leading-relaxed">
            Pusat kurasi berita, verifikasi fakta berlapis, serta arsip panduan layanan publik Kota Tasikmalaya dan Priangan Timur.
          </p>

          {/* 3 Core Newsroom Pillars */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-teal-900/60 bg-teal-950/40 p-4 backdrop-blur-xs">
              <FileCheck2 className="h-5 w-5 text-teal-400 mb-2" />
              <h3 className="font-semibold text-xs text-white">Verifikasi Sumber</h3>
              <p className="text-[11px] text-teal-200/60 mt-1">
                Data primer terkonfirmasi instansi & riset lapangan.
              </p>
            </div>

            <div className="rounded-xl border border-teal-900/60 bg-teal-950/40 p-4 backdrop-blur-xs">
              <CheckCircle2 className="h-5 w-5 text-teal-400 mb-2" />
              <h3 className="font-semibold text-xs text-white">Bebas Sensasi</h3>
              <p className="text-[11px] text-teal-200/60 mt-1">
                Taat Kode Etik Jurnalistik tanpa jebakan klik (clickbait).
              </p>
            </div>

            <div className="rounded-xl border border-teal-900/60 bg-teal-950/40 p-4 backdrop-blur-xs">
              <Database className="h-5 w-5 text-teal-400 mb-2" />
              <h3 className="font-semibold text-xs text-white">Jejak Audit 256-Bit</h3>
              <p className="text-[11px] text-teal-200/60 mt-1">
                Transparansi riwayat revisi dan audit sistem redaksi.
              </p>
            </div>
          </div>
        </div>

        {/* Footer info in left panel */}
        <div className="relative z-10 mt-12 pt-6 border-t border-teal-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-teal-200/50">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Sistem Redaksi Aktif & Aman</span>
          </div>
          <span>© {new Date().getFullYear()} Palihmana.ID</span>
        </div>
      </div>

      {/* ─── Right Panel: Authentication Station ─── */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 bg-[#030B0D]">
        <div className="w-full max-w-md">
          {/* Back link */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-teal-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali ke Halaman Publik
            </Link>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border border-teal-900/60 bg-[#07191C]/90 p-8 shadow-2xl backdrop-blur-sm">
            <div className="mb-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 mb-3">
                <KeyRound className="h-5 w-5" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-white tracking-tight">
                Autentikasi Staf Redaksi
              </h2>
              <p className="mt-1 text-xs text-teal-200/60">
                Silakan masukkan email terdaftar dan kata sandi Anda.
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-red-400" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-teal-100 mb-1.5">
                  Alamat Email Resmi
                </label>
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="editor@palihmana.id atau nama@palihmana.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-teal-900/80 bg-[#041215] px-3.5 py-3 text-white placeholder:text-teal-200/30 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 text-xs transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-semibold text-teal-100">
                    Kata Sandi
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-teal-900/80 bg-[#041215] pl-3.5 pr-10 py-3 text-white placeholder:text-teal-200/30 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 text-xs transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-200/50 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 hover:bg-teal-500 py-3 text-xs font-bold text-white shadow-lg shadow-teal-950/50 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Mengautentikasi Kredensial...
                  </>
                ) : (
                  <>
                    Masuk ke Ruang Redaksi <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Role Notice & Security Indicator */}
            <div className="mt-6 pt-5 border-t border-teal-900/50 text-[11px] text-teal-200/50 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-teal-400 shrink-0" />
                <span>Mendukung peran: <strong>Super Admin</strong>, <strong>Editor</strong>, dan <strong>Kontributor</strong>.</span>
              </div>
              <p className="text-[10px] text-teal-200/40">
                Setiap aktivitas masuk tercatat secara kriptografis dalam Audit Log internal demi kepatuhan kode etik jurnalistik.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
