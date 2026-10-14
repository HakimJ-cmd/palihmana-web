import { NextRequest, NextResponse } from "next/server";
import { searchArticles } from "@/modules/articles/queries";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return NextResponse.json({ results: [] });
  }

  const results = await searchArticles(q);
  return NextResponse.json({ results });
}
