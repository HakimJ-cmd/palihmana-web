"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, ExternalLink, RefreshCw } from "lucide-react";

interface ArticleRowActionsProps {
  id: string;
  slug: string;
  pilar: string;
}

export function ArticleRowActions({ id, slug, pilar }: ArticleRowActionsProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const pilarSlug = pilar.toLowerCase().replace("_", "-");

  const handleDelete = async () => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini dari sistem?")) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Gagal menghapus artikel");
      } else {
        router.refresh();
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2 text-xs">
      <Link
        href={`/${pilarSlug}/${slug}`}
        target="_blank"
        className="inline-flex items-center gap-1 rounded px-2 py-1 text-ink-muted hover:text-ink hover:bg-surface-alt transition-colors"
        title="Lihat Pratinjau Publik"
      >
        <ExternalLink className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Pratinjau</span>
      </Link>

      <Link
        href={`/admin/articles/${id}/edit`}
        className="inline-flex items-center gap-1 rounded bg-primary/10 text-primary hover:bg-primary hover:text-white px-2.5 py-1 font-semibold transition-colors"
        title="Sunting Artikel & Status Redaksi"
      >
        <Edit2 className="h-3.5 w-3.5" />
        <span>Sunting</span>
      </Link>

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="inline-flex items-center gap-1 rounded px-2 py-1 text-danger hover:bg-danger/10 transition-colors disabled:opacity-50"
        title="Hapus Artikel"
      >
        {deleting ? (
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
