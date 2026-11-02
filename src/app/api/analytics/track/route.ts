import { NextRequest, NextResponse } from "next/server";
import { recordHit } from "@/modules/analytics/store";

export async function POST(request: NextRequest) {
  try {
    let body: any = {};
    try {
      const text = await request.text();
      body = text ? JSON.parse(text) : {};
    } catch {
      body = {};
    }

    const { path, slug, title, pilar, readingMinutes, isArticle } = body;

    if (!path && !slug) {
      return NextResponse.json({ error: "Parameter path atau slug diperlukan" }, { status: 400 });
    }

    const cleanSlug = typeof slug === "string" ? slug.slice(0, 150) : undefined;
    const cleanTitle = typeof title === "string" ? title.slice(0, 250) : undefined;
    const cleanPath = typeof path === "string" ? path.slice(0, 250) : "";

    const result = await recordHit({
      path: cleanPath || `/${pilar?.toLowerCase() || "utility"}/${cleanSlug}`,
      slug: cleanSlug,
      title: cleanTitle,
      pilar,
      readingMinutes: typeof readingMinutes === "number" ? Math.min(readingMinutes, 60) : 4,
      isArticle: Boolean(isArticle || cleanSlug),
    });

    return NextResponse.json({ success: true, views: result.views });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Gagal mencatat analitik" }, { status: 500 });
  }
}
