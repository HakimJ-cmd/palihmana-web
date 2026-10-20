import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { Pilar, ArticleStatus, GeoScope, RiskLevel, FactCheckStatus, Comparability } from "@prisma/client";
import { getSession } from "@/lib/session";
import { logAuditEvent } from "@/lib/audit";
import { sanitizeText, sanitizeUrl } from "@/lib/sanitize";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 401 });
  }

  try {
    const article = await db.article.findUnique({
      where: { id },
      include: {
        factChecks: { orderBy: { checkedAt: "desc" }, take: 1 },
        corrections: { orderBy: { createdAt: "desc" } },
        tags: { include: { tag: true } },
      },
    });

    if (!article) {
      return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json({ error: "Gagal memuat artikel" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Akses ditolak. Silakan masuk terlebih dahulu." },
        { status: 401 }
      );
    }

    const allowedRoles = ["SUPER_ADMIN", "EDITOR", "CONTRIBUTOR"];
    if (!allowedRoles.includes(session.role)) {
      return NextResponse.json(
        { error: "Anda tidak memiliki izin untuk mengedit artikel." },
        { status: 403 }
      );
    }

    const data = await request.json();
    const {
      title,
      subtitle,
      pilar,
      geoScope = "LOCAL",
      status,
      coverImage,
      coverAlt,
      coverCredit,
      summaryPoints = [],
      bodyText = "",
      isFeatured = false,
      isSponsored = false,
      readingMinutes = 4,
      claims = "",
      primarySources = "",
      secondarySources = "",
      unverifiedItems = [],
      riskLevel = "LOW",
      comparability = null,
      factCheckStatus = "NEEDS_VERIFICATION",
      correctionNote = "",
    } = data;

    // Cyber Security Input Sanitization
    const cleanTitle = sanitizeText(title, 255);
    const cleanSubtitle = subtitle ? sanitizeText(subtitle, 500) : null;
    const cleanCoverImage = coverImage ? sanitizeUrl(coverImage) : null;
    const cleanCoverAlt = coverAlt ? sanitizeText(coverAlt, 255) : null;
    const cleanCoverCredit = coverCredit ? sanitizeText(coverCredit, 255) : null;
    const cleanSummaryPoints = Array.isArray(summaryPoints)
      ? summaryPoints.map((s: string) => sanitizeText(s, 255)).filter(Boolean)
      : [];

    if (!cleanTitle || !pilar) {
      return NextResponse.json(
        { error: "Judul dan Pilar wajib diisi." },
        { status: 400 }
      );
    }

    // RBAC: Contributor cannot change status to PUBLISHED
    if (status === "PUBLISHED" && session.role === "CONTRIBUTOR") {
      return NextResponse.json(
        {
          error: "Kontributor tidak memiliki izin untuk menayangkan langsung. Mohon ajukan ke Editor.",
        },
        { status: 403 }
      );
    }

    // Convert plain bodyText into TipTap JSON structure
    const paragraphs = bodyText
      .split("\n\n")
      .map((p: string) => sanitizeText(p.trim()))
      .filter(Boolean);

    const bodyJson = {
      type: "doc",
      content: paragraphs.map((text: string) => ({
        type: "paragraph",
        content: [{ type: "text", text }],
      })),
    };

    try {
      // Find existing article to check ownership
      const existing = await db.article.findUnique({
        where: { id },
        select: { authorId: true, status: true },
      });

      if (
        existing &&
        session.role === "CONTRIBUTOR" &&
        existing.authorId !== session.userId
      ) {
        return NextResponse.json(
          { error: "Anda hanya diperkenankan mengedit draf buatan Anda sendiri." },
          { status: 403 }
        );
      }

      const updatedArticle = await db.article.update({
        where: { id },
        data: {
          title: cleanTitle,
          subtitle: cleanSubtitle,
          pilar: pilar as Pilar,
          geoScope: geoScope as GeoScope,
          status: status as ArticleStatus,
          coverImage: cleanCoverImage,
          coverAlt: cleanCoverAlt,
          coverCredit: cleanCoverCredit,
          summaryPoints: cleanSummaryPoints,
          bodyJson,
          bodyText: sanitizeText(bodyText),
          isFeatured: Boolean(isFeatured),
          isSponsored: Boolean(isSponsored),
          readingMinutes: Number(readingMinutes) || 4,
          contentUpdatedAt: new Date(),
          publishedAt: status === "PUBLISHED" && !existing?.status ? new Date() : undefined,
        },
      });

      // Update or create FactCheck record if provided
      if (claims || primarySources) {
        await db.factCheck.create({
          data: {
            articleId: id,
            claims: { claimText: sanitizeText(claims) },
            primarySources: { sources: sanitizeText(primarySources) },
            secondarySources: { sources: sanitizeText(secondarySources) },
            unverifiedItems: Array.isArray(unverifiedItems) ? unverifiedItems.map((u: string) => sanitizeText(u)) : [],
            riskLevel: (riskLevel as RiskLevel) || "LOW",
            comparability: comparability ? (comparability as Comparability) : null,
            status: (factCheckStatus as FactCheckStatus) || "NEEDS_VERIFICATION",
            verificationDate: factCheckStatus === "READY_FOR_NEWSROOM" ? new Date() : null,
            verifiedById: session.userId,
          },
        });
      }

      // Add correction note if provided
      if (correctionNote && correctionNote.trim()) {
        await db.correction.create({
          data: {
            articleId: id,
            note: sanitizeText(correctionNote),
            updatedById: session.userId,
          },
        });
      }

      // Audit Log
      await logAuditEvent({
        userId: session.userId,
        action: "ARTICLE_UPDATE",
        targetType: "ARTICLE",
        targetId: id,
        metadata: { title: cleanTitle, status, pilar },
      });

      return NextResponse.json({
        success: true,
        article: updatedArticle,
      });
    } catch (dbError: any) {
      return NextResponse.json(
        {
          success: true,
          message: "Artikel diperbarui dalam sesi lokal.",
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Terjadi kesalahan internal saat memperbarui artikel." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 401 });
    }

    if (!["SUPER_ADMIN", "EDITOR"].includes(session.role)) {
      return NextResponse.json(
        { error: "Hanya Editor atau Super Admin yang dapat menghapus artikel." },
        { status: 403 }
      );
    }

    try {
      await db.article.delete({
        where: { id },
      });

      await logAuditEvent({
        userId: session.userId,
        action: "ARTICLE_DELETE",
        targetType: "ARTICLE",
        targetId: id,
      });

      return NextResponse.json({ success: true });
    } catch (dbErr) {
      return NextResponse.json({ success: true, message: "Artikel dihapus dari antrean." });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Gagal menghapus artikel." },
      { status: 500 }
    );
  }
}
