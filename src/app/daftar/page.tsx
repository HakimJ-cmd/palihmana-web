"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, UserCheck, AlertCircle, RefreshCw, ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat akun.");
      }

      router.push("/akun");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
            <UserCheck className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-serif text-2xl font-bold tracking-tight text-ink">
            Daftar Akun Baraya
          </h1>
          <p className="mt-1.5 text-xs text-ink-muted">
            Simpan artikel favorit lintas perangkat, akses panduan utilitas, dan ikuti perkembangan Tasikmalaya.
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger/10 p-3.5 text-xs text-danger">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-ink mb-1">Nama Lengkap</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Gunawan"
              className="w-full rounded-lg border border-line bg-surface-alt p-3 text-ink focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-ink mb-1">Alamat Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full rounded-lg border border-line bg-surface-alt p-3 text-ink focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-ink mb-1">
              Kata Sandi <span className="text-ink-muted font-normal">(Min. 10 karakter)</span>
            </label>
            <input
              type="password"
              required
              minLength={10}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              className="w-full rounded-lg border border-line bg-surface-alt p-3 text-ink focus:border-primary focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-ink-muted">
              Gunakan kombinasi huruf, angka, dan simbol untuk keamanan maksimal.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 text-xs font-bold text-white hover:bg-primary-hover transition-colors shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" /> Memproses Pendaftaran...
              </>
            ) : (
              <>
                Buat Akun Sekarang <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="border-t border-line pt-4 text-center text-xs text-ink-muted">
          Sudah punya akun?{" "}
          <Link href="/masuk" className="font-semibold text-primary hover:underline">
            Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
