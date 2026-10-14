import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNow, differenceInDays } from "date-fns";
import { id as localeId } from "date-fns/locale";

// ─── Class names ────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// ─── Date formatting ────────────────────────────────────────────
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "d MMMM yyyy", { locale: localeId });
}

export function formatDateShort(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "d MMM yyyy", { locale: localeId });
}

export function formatRelative(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const days = differenceInDays(new Date(), d);
  if (days < 7) {
    return formatDistanceToNow(d, { addSuffix: true, locale: localeId });
  }
  return formatDate(d);
}

export function formatFreshness(
  contentUpdatedAt: Date | null | undefined,
  publishedAt: Date | null | undefined,
  lastVerifiedAt?: Date | null
): string {
  const checkDate = lastVerifiedAt || contentUpdatedAt || publishedAt;
  if (!checkDate) return "";
  if (lastVerifiedAt) {
    return `Dicek ${formatDateShort(lastVerifiedAt)}`;
  }
  if (contentUpdatedAt) {
    return `Diperbarui ${formatDateShort(contentUpdatedAt)}`;
  }
  return formatDateShort(publishedAt);
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
