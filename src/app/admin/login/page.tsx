"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, Loader2, AlertCircle, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal masuk. Periksa kembali email dan kata sandi.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="flex min-h-[80vh] flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          href="/"
          className="mx-auto block text-center font-serif text-2xl font-bold tracking-tight text-primary hover:text-primary-hover"
        >
          PALIHMANA<span className="text-xs font-semibold uppercase text-ink-muted">.ID</span>
        </Link>
        <h1 className="mt-4 text-center font-serif text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Masuk ke Panel Redaksi
        </h1>
        <p className="mt-2 text-center text-xs text-ink-muted">
          Akses terbatas khusus Editor, Penulis, dan Super Admin Palihmana.id
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="rounded border border-line bg-surface p-6 shadow-xs sm:p-8">
          {errorMessage && (
            <div className="mb-6 flex items-start gap-2.5 rounded border border-danger/30 bg-danger/10 p-3.5 text-xs text-danger">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-ink">
                Alamat Email Redaksi
              </label>
              <div className="relative mt-1">
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="nama@palihmana.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded border border-line bg-surface pl-10 pr-3 text-sm text-ink focus:border-primary focus:outline-none"
                />
                <Mail className="absolute left-3 top-3 h-5 w-5 text-ink-muted pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink">
                Kata Sandi
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded border border-line bg-surface pl-10 pr-10 text-sm text-ink focus:border-primary focus:outline-none"
                />
                <Lock className="absolute left-3 top-3 h-5 w-5 text-ink-muted pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-ink-muted hover:text-ink"
                  aria-label={showPassword ? "Sembunyikan sandi" : "Tampilkan sandi"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-11 w-full items-center justify-center rounded bg-primary text-xs font-semibold text-white hover:bg-primary-hover disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Masuk ke Dashboard"
              )}
            </button>
          </form>

          {/* Demo Helper Box */}
          <div className="mt-6 rounded border border-line bg-surface-alt p-3.5 text-xs text-ink-muted">
            <p className="font-semibold text-ink">Akun Pengujian (Demo Staf):</p>
            <div className="mt-2 space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between">
                <span>admin@palihmana.id</span>
                <button
                  type="button"
                  onClick={() => handleFillDemo("admin@palihmana.id", "PalihmanaAdmin2026!")}
                  className="text-primary hover:underline font-sans font-semibold"
                >
                  Gunakan
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>editor@palihmana.id</span>
                <button
                  type="button"
                  onClick={() => handleFillDemo("editor@palihmana.id", "EditorPalihmana2026!")}
                  className="text-primary hover:underline font-sans font-semibold"
                >
                  Gunakan
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-ink-muted">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-primary">
            <ArrowLeft className="h-3 w-3" /> Kembali ke Halaman Utama
          </Link>
        </p>
      </div>
    </div>
  );
}
