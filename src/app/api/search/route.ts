import { NextRequest, NextResponse } from "next/server";
import { searchArticles } from "@/modules/articles/queries";
import { searchUtilities } from "@/modules/utilities/queries";
import { searchEvents } from "@/modules/events/queries";
import { sanitizeText } from "@/lib/sanitize";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawQ = searchParams.get("q") || "";
  const q = sanitizeText(rawQ, 100).trim();

  if (!q) {
    return NextResponse.json({
      articles: [],
      utilities: [],
      events: [],
      results: [],
      total: 0,
    });
  }

  const [articles, utilities, events] = await Promise.all([
    searchArticles(q),
    searchUtilities(q),
    searchEvents(q),
  ]);

  const total = articles.length + utilities.length + events.length;

  return NextResponse.json({
    query: q,
    articles,
    utilities,
    events,
    results: articles, // backward compatibility
    total,
  });
}
