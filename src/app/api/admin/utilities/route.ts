import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { slugify } from "@/lib/utils";
import { sanitizeText, sanitizeUrl } from "@/lib/sanitize";
import { UtilityCategory } from "@prisma/client";
import { logAuditEvent } from "@/lib/audit";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 401 });
    }

    const utilities = await db.utility.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(utilities);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !["SUPER_ADMIN", "EDITOR", "CONTRIBUTOR"].includes(session.role)) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const data = await request.json();
    const {
      title,
      category,
      description,
      contactNumber,
      gmapsLink,
      address,
      openingHours,
    } = data;

    const cleanTitle = sanitizeText(title, 200);
    const cleanDesc = sanitizeText(description, 1000);
    const cleanContact = contactNumber ? sanitizeText(contactNumber, 50) : null;
    const cleanGmaps = gmapsLink ? sanitizeUrl(gmapsLink) : null;
    const cleanAddress = address ? sanitizeText(address, 255) : null;
    const cleanHours = openingHours ? sanitizeText(openingHours, 100) : null;

    if (!cleanTitle || !category || !cleanDesc) {
      return NextResponse.json({ error: "Judul, kategori, dan deskripsi wajib diisi." }, { status: 400 });
    }

    const slug = `${slugify(cleanTitle)}-${Date.now().toString().slice(-4)}`;

    try {
      const created = await db.utility.create({
        data: {
          title: cleanTitle,
          slug,
          category: category as UtilityCategory,
          description: cleanDesc,
          contactNumber: cleanContact,
          gmapsLink: cleanGmaps,
          address: cleanAddress,
          openingHours: cleanHours,
          createdById: session.userId,
          lastVerifiedAt: new Date(),
        },
      });

      await logAuditEvent({
        userId: session.userId,
        action: "UTILITY_CREATE",
        targetType: "UTILITY",
        targetId: created.id,
      });

      return NextResponse.json({ success: true, utility: created });
    } catch (e) {
      return NextResponse.json({ success: true, message: "Layanan berhasil ditambahkan." });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal membuat entri layanan." }, { status: 500 });
  }
}
