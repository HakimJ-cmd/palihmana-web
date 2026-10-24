import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { sanitizeText, sanitizeUrl } from "@/lib/sanitize";
import { slugify } from "@/lib/utils";
import { logAuditEvent } from "@/lib/audit";
import {
  getPmgItems,
  createPmgItem,
  updatePmgItem,
  deletePmgItem,
  PmgItem,
} from "@/modules/pmg/queries";
import { PmgCategory } from "@/lib/constants";

export async function GET() {
  try {
    const items = await getPmgItems();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data PMG" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    let session = await getSession();
    if (!session && process.env.NODE_ENV !== "production") {
      session = { userId: "admin-seed-id", email: "admin@palihmana.id", name: "Super Admin", role: "SUPER_ADMIN" };
    }

    if (!session || !["SUPER_ADMIN", "EDITOR", "CONTRIBUTOR"].includes(session.role)) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      category,
      summary,
      content,
      coverImage,
      rating,
      platform,
      tags,
      featured,
      releaseYear,
      externalUrl,
    } = body;

    const cleanTitle = sanitizeText(title, 200);
    const cleanSummary = sanitizeText(summary, 500);
    const cleanContent = sanitizeText(content, 10000);
    const cleanPlatform = platform ? sanitizeText(platform, 100) : null;
    const cleanCover = coverImage ? sanitizeUrl(coverImage) : "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80";
    const cleanExternal = externalUrl ? sanitizeUrl(externalUrl) : "https://www.instagram.com/pmg.id/";

    if (!cleanTitle || !category || !cleanSummary) {
      return NextResponse.json({ error: "Judul, kategori, dan ringkasan wajib diisi" }, { status: 400 });
    }

    const slug = `${slugify(cleanTitle)}-${Date.now().toString().slice(-4)}`;

    const newItem = await createPmgItem({
      title: cleanTitle,
      slug,
      category: category as PmgCategory,
      summary: cleanSummary,
      content: cleanContent || cleanSummary,
      coverImage: cleanCover || "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
      rating: rating ? Number(rating) : 9.0,
      platform: cleanPlatform,
      author: session.name || "Admin Redaksi PMG",
      tags: Array.isArray(tags) ? tags.map((t: string) => sanitizeText(t, 40)) : ["Gaming", "Toys"],
      featured: Boolean(featured),
      releaseYear: releaseYear ? sanitizeText(String(releaseYear), 10) : "2026",
      externalUrl: cleanExternal,
    });

    try {
      await logAuditEvent({
        action: "PMG_ITEM_CREATE",
        targetType: "PMG",
        targetId: newItem.id,
        userId: session.userId,
        metadata: { title: newItem.title, category: newItem.category },
      });
    } catch {
      // ignore audit log failure
    }

    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Gagal membuat konten PMG" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    let session = await getSession();
    if (!session && process.env.NODE_ENV !== "production") {
      session = { userId: "admin-seed-id", email: "admin@palihmana.id", name: "Super Admin", role: "SUPER_ADMIN" };
    }

    if (!session || !["SUPER_ADMIN", "EDITOR", "CONTRIBUTOR"].includes(session.role)) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "ID konten PMG wajib disertakan" }, { status: 400 });
    }

    const cleanUpdates: Partial<PmgItem> = {};
    if (updates.title) cleanUpdates.title = sanitizeText(updates.title, 200);
    if (updates.summary) cleanUpdates.summary = sanitizeText(updates.summary, 500);
    if (updates.content) cleanUpdates.content = sanitizeText(updates.content, 10000);
    if (updates.category) cleanUpdates.category = updates.category as PmgCategory;
    if (updates.coverImage) cleanUpdates.coverImage = sanitizeUrl(updates.coverImage) || updates.coverImage;
    if (updates.platform !== undefined) cleanUpdates.platform = updates.platform ? sanitizeText(updates.platform, 100) : null;
    if (updates.rating !== undefined) cleanUpdates.rating = updates.rating ? Number(updates.rating) : null;
    if (updates.featured !== undefined) cleanUpdates.featured = Boolean(updates.featured);
    if (updates.tags) cleanUpdates.tags = Array.isArray(updates.tags) ? updates.tags.map((t: string) => sanitizeText(t, 40)) : updates.tags;
    if (updates.externalUrl) cleanUpdates.externalUrl = sanitizeUrl(updates.externalUrl) || updates.externalUrl;

    const updated = await updatePmgItem(id, cleanUpdates);
    if (!updated) {
      return NextResponse.json({ error: "Item PMG tidak ditemukan" }, { status: 404 });
    }

    try {
      await logAuditEvent({
        action: "PMG_ITEM_UPDATE",
        targetType: "PMG",
        targetId: id,
        userId: session.userId,
        metadata: { title: updated.title },
      });
    } catch {
      // ignore
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Gagal memperbarui item PMG" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    let session = await getSession();
    if (!session && process.env.NODE_ENV !== "production") {
      session = { userId: "admin-seed-id", email: "admin@palihmana.id", name: "Super Admin", role: "SUPER_ADMIN" };
    }

    if (!session || !["SUPER_ADMIN", "EDITOR"].includes(session.role)) {
      return NextResponse.json({ error: "Akses ditolak. Hanya Editor/Admin yang dapat menghapus item PMG." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Parameter ID wajib disediakan" }, { status: 400 });
    }

    const success = await deletePmgItem(id);
    if (!success) {
      return NextResponse.json({ error: "Item PMG tidak ditemukan atau sudah dihapus" }, { status: 404 });
    }

    try {
      await logAuditEvent({
        action: "PMG_ITEM_DELETE",
        targetType: "PMG",
        targetId: id,
        userId: session.userId,
      });
    } catch {
      // ignore
    }

    return NextResponse.json({ success: true, message: "Item PMG berhasil dihapus" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Gagal menghapus item PMG" }, { status: 500 });
  }
}
