import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sanitizeText } from "@/lib/sanitize";
import { ArticleStatus } from "@prisma/client";

// Common curated local queries for Tasikmalaya
const POPULAR_SUGGESTIONS = [
  "cara membuat ktp elektronik",
  "nomor ugd rsud dr soekardjo",
  "damkar kota tasikmalaya",
  "pameran bordir kawalu",
  "rute angkot tasik",
  "jadwal pasar induk cikurubuk",
  "angka kemiskinan tasikmalaya",
  "buku dan diskusi warga",
  "kuliner malam alun-alun",
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawQ = searchParams.get("q") || "";
  const q = sanitizeText(rawQ, 100).toLowerCase().trim();

  if (!q || q.length < 2) {
    return NextResponse.json({
      query: q,
      suggestions: POPULAR_SUGGESTIONS.slice(0, 5),
    });
  }

  const suggestions = new Set<string>();

  // Check in popular local queries
  POPULAR_SUGGESTIONS.forEach((item) => {
    if (item.includes(q)) {
      suggestions.add(item);
    }
  });

  try {
    // Check article titles from DB
    const matchingArticles = await db.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
        title: { contains: q, mode: "insensitive" },
      },
      select: { title: true },
      take: 4,
    });

    matchingArticles.forEach((a) => suggestions.add(a.title));

    // Check tags from DB
    const matchingTags = await db.tag.findMany({
      where: {
        name: { contains: q, mode: "insensitive" },
      },
      select: { name: true },
      take: 3,
    });

    matchingTags.forEach((t) => suggestions.add(`Topik: #${t.name}`));
  } catch (error) {
    // Database might not be available, fallback gracefully
  }

  return NextResponse.json({
    query: q,
    suggestions: Array.from(suggestions).slice(0, 6),
  });
}
