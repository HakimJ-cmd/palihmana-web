"use client";

import React, { useState } from "react";
import Link from "next/link";
import { KeyRound, ArrowLeft, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gagal memproses permohonan.");
      }

      setSuccessMessage(data.message);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-line bg-surface p-6 sm:p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-serif text-2xl font-bold tracking-tight text-ink">
            Pemulihan Kata Sandi
          </h1>
          <p className="mt-1.5 text-xs text-ink-muted">
            Masukkan email terdaftar Anda untuk menerima tautan atur ulang kata sandi satu kali pakai (berlaku 30 menit).
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger/10 p-3.5 text-xs text-danger">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage ? (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/40 p-4 text-xs text-emerald-700 dark:text-emerald-300">
            <div className="flex items-center gap-2 font-bold mb-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>Instruksi Terkirim</span>
            </div>
            <p className="leading-relaxed">{successMessage}</p>
            <div className="mt-4 pt-3 border-t border-emerald-500/20">
              <Link
                href="/masuk"
                className="font-bold text-primary hover:underline inline-flex items-center gap-1"
              >
                Kembali ke Halaman Masuk &rarr;
              </Link>
            </div>
          </div>
        ) : (
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

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-3 text-xs font-bold text-white hover:bg-primary-hover transition-colors shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" /> Mengirim Tautan...
                </>
              ) : (
                "Kirim Tautan Pemulihan"
              )}
            </button>
          </form>
        )}

        <div className="border-t border-line pt-4 text-center text-xs">
          <Link
            href="/masuk"
            className="inline-flex items-center gap-1.5 font-semibold text-ink-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Halaman Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}
