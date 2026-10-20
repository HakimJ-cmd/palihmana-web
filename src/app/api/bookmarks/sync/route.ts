import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Harap masuk terlebih dahulu" }, { status: 401 });
    }

    const { articleIds } = await request.json();

    if (!Array.isArray(articleIds) || articleIds.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    let syncedCount = 0;
    try {
      for (const id of articleIds) {
        if (typeof id === "string" && id.trim()) {
          // Check if article exists
          const article = await db.article.findUnique({
            where: { id: id.trim() },
            select: { id: true },
          });

          if (article) {
            await db.bookmark.upsert({
              where: {
                userId_articleId: {
                  userId: session.userId,
                  articleId: article.id,
                },
              },
              update: {},
              create: {
                userId: session.userId,
                articleId: article.id,
              },
            });
            syncedCount++;
          }
        }
      }
    } catch (e) {
      // In-memory / development fallback
    }

    return NextResponse.json({
      success: true,
      syncedCount,
      message: `${syncedCount} artikel tersimpan disinkronkan ke akun Anda.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Gagal menyinkronkan simpanan" }, { status: 500 });
  }
}
