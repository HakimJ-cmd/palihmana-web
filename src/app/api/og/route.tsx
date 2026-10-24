import { NextRequest, NextResponse } from "next/server";
import { sanitizeText } from "@/lib/sanitize";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = sanitizeText(searchParams.get("title") || "Palihmana.ID", 100);
    const pilar = sanitizeText(searchParams.get("pilar") || "Jurnalisme Solutif", 30);

    return NextResponse.json(
      { title, pilar, site: "palihmana.id" },
      { status: 200 }
    );
  } catch (e: any) {
    return new Response("Gagal membuat gambar OpenGraph", { status: 500 });
  }
}
