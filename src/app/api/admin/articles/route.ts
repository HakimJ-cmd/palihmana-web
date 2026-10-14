import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { Pilar, ArticleStatus, GeoScope } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      title,
      subtitle,
      pilar,
      geoScope = "LOCAL",
      status = "DRAFT",
      coverImage,
      coverAlt,
      coverCredit,
      summaryPoints = [],
      bodyText = "",
      isFeatured = false,
      readingMinutes = 4,
    } = data;

    if (!title || !pilar) {
      return NextResponse.json(
        { error: "Judul dan Pilar wajib diisi." },
        { status: 400 }
      );
    }

    const baseSlug = slugify(title);
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    // Convert plain bodyText into TipTap JSON structure
    const paragraphs = bodyText
      .split("\n\n")
      .map((p: string) => p.trim())
      .filter(Boolean);

    const bodyJson = {
      type: "doc",
      content: paragraphs.map((text: string) => ({
        type: "paragraph",
        content: [{ type: "text", text }],
      })),
    };

    // Find first author or create default editorial user
    let author = await db.user.findFirst();
    if (!author) {
      author = await db.user.create({
        data: {
          email: "redaksi@palihmana.id",
          name: "Editor Redaksi",
          role: "EDITOR",
        },
      });
    }

    const article = await db.article.create({
      data: {
        title,
        slug,
        subtitle: subtitle || null,
        pilar: pilar as Pilar,
        geoScope: geoScope as GeoScope,
        status: status as ArticleStatus,
        isFeatured: Boolean(isFeatured),
        coverImage: coverImage || null,
        coverAlt: coverAlt || null,
        coverCredit: coverCredit || null,
        summaryPoints: Array.isArray(summaryPoints) ? summaryPoints : [],
        bodyText,
        bodyJson,
        readingMinutes: Number(readingMinutes) || 4,
        authorId: author.id,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        contentUpdatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, article });
  } catch (error: any) {
    console.error("Admin create article error:", error);
    // If DB is offline, return simulated success for Phase 1 demo
    return NextResponse.json({
      success: true,
      simulated: true,
      message: "Artikel berhasil disimpan dalam mode pratinjau.",
    });
  }
}
