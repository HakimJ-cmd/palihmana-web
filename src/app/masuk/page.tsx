"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, AlertCircle, RefreshCw, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/akun";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        throw new Error(data.error || "Gagal masuk ke akun.");
      }

      // Check role: staff goes to /admin, member goes to /akun or `from`
      const staffRoles = ["SUPER_ADMIN", "EDITOR", "CONTRIBUTOR"];
      if (staffRoles.includes(data.user?.role)) {
        router.push("/admin");
      } else {
        router.push(from.startsWith("/admin") ? "/akun" : from);
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Email atau kata sandi tidak sesuai.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-sm">
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
          <LogIn className="h-6 w-6" />
        </div>
        <h1 className="mt-4 font-serif text-2xl font-bold tracking-tight text-ink">
          Masuk ke Palihmana.ID
        </h1>
        <p className="mt-1.5 text-xs text-ink-muted">
          Akses akun pembaca Baraya atau portal redaksi jurnalisme warga.
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
          <div className="flex items-center justify-between mb-1">
            <label className="block font-semibold text-ink">Kata Sandi</label>
            <Link
              href="/lupa-sandi"
              className="text-[11px] font-semibold text-primary hover:underline"
            >
              Lupa sandi?
            </Link>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••"
            className="w-full rounded-lg border border-line bg-surface-alt p-3 text-ink focus:border-primary focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary py-3 text-xs font-bold text-white hover:bg-primary-hover transition-colors shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
        >
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" /> Memeriksa Kredensial...
            </>
          ) : (
            <>
              Masuk Sekarang <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>

      <div className="border-t border-line pt-4 text-center text-xs text-ink-muted space-y-2">
        <div>
          Belum memiliki akun?{" "}
          <Link href="/daftar" className="font-semibold text-primary hover:underline">
            Daftar sebagai Baraya
          </Link>
        </div>
        <div className="pt-2 border-t border-line/60">
          <Link
            href="/redaksi"
            className="text-[11px] font-medium text-ink-muted hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            Akses Redaksi & Kontributor Warga →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-center text-xs text-ink-muted">Memuat...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
