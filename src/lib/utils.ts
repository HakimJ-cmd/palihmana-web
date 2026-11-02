export type ClassValue = string | number | boolean | undefined | null | { [key: string]: any } | ClassValue[];

// ─── Class names ────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) classes.push(inner);
    } else if (typeof input === "object") {
      for (const key of Object.keys(input)) {
        if ((input as any)[key]) classes.push(key);
      }
    }
  }
  return classes.join(" ");
}

// ─── Date formatting ────────────────────────────────────────────
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function formatDateShort(date: Date | string | null | undefined): string {
  if (!date) return "";
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function formatRelative(date: Date | string | null | undefined): string {
  if (!date) return "";
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    const diffMs = Date.now() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return "Baru saja";
    if (diffHours < 24) return `${diffHours} jam lalu`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} hari lalu`;
    return formatDateShort(d);
  } catch {
    return formatDate(date);
  }
}

export function formatFreshness(
  contentUpdatedAt: Date | string | null | undefined,
  publishedAt: Date | string | null | undefined,
  lastVerifiedAt?: Date | string | null | undefined
): string {
  if (lastVerifiedAt) {
    return `Dicek ${formatDateShort(lastVerifiedAt)}`;
  }
  if (contentUpdatedAt) {
    return `Diperbarui ${formatDateShort(contentUpdatedAt)}`;
  }
  if (publishedAt) {
    return `Terbit ${formatDateShort(publishedAt)}`;
  }
  return "";
}

// ─── String utils ───────────────────────────────────────────────
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "…";
}

// ─── Phone formatting ────────────────────────────────────────────
export function formatPhone(e164: string): string {
  // +62265330193 → (0265) 330-193
  const local = e164.replace(/^\+62/, "0");
  return local.replace(/(\d{4})(\d{3,4})(\d+)/, "($1) $2-$3");
}

// ─── URL utils ───────────────────────────────────────────────────
export function getArticleUrl(pilarSlug: string, slug: string): string {
  return `/${pilarSlug}/${slug}`;
}
