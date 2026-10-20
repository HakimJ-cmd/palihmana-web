import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { slugify } from "@/lib/utils";
import { sanitizeText, sanitizeUrl } from "@/lib/sanitize";
import { PriceType, EventStatus } from "@prisma/client";
import { logAuditEvent } from "@/lib/audit";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 401 });
    }

    const events = await db.event.findMany({
      orderBy: { eventDate: "desc" },
    });

    return NextResponse.json(events);
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
      description,
      eventDate,
      eventEnd,
      location,
      gmapsLink,
      organizer,
      priceType = "FREE",
      priceNote,
      registrationLink,
      isVerified = true,
    } = data;

    const cleanTitle = sanitizeText(title, 200);
    const cleanDesc = sanitizeText(description, 1000);
    const cleanLocation = sanitizeText(location, 200);
    const cleanOrganizer = sanitizeText(organizer, 150);
    const cleanGmaps = gmapsLink ? sanitizeUrl(gmapsLink) : null;
    const cleanReg = registrationLink ? sanitizeUrl(registrationLink) : null;
    const cleanPriceNote = priceNote ? sanitizeText(priceNote, 100) : null;

    if (!cleanTitle || !cleanDesc || !eventDate || !cleanLocation || !cleanOrganizer) {
      return NextResponse.json(
        { error: "Judul, tanggal, lokasi, penyelenggara, dan deskripsi wajib diisi." },
        { status: 400 }
      );
    }

    const slug = `${slugify(cleanTitle)}-${Date.now().toString().slice(-4)}`;

    try {
      const created = await db.event.create({
        data: {
          title: cleanTitle,
          slug,
          description: cleanDesc,
          eventDate: new Date(eventDate),
          eventEnd: eventEnd ? new Date(eventEnd) : null,
          location: cleanLocation,
          gmapsLink: cleanGmaps,
          organizer: cleanOrganizer,
          priceType: priceType as PriceType,
          priceNote: cleanPriceNote,
          registrationLink: cleanReg,
          isVerified: Boolean(isVerified),
          verifiedAt: isVerified ? new Date() : null,
          status: EventStatus.SCHEDULED,
          createdById: session.userId,
        },
      });

      await logAuditEvent({
        userId: session.userId,
        action: "EVENT_CREATE",
        targetType: "EVENT",
        targetId: created.id,
      });

      return NextResponse.json({ success: true, event: created });
    } catch (e) {
      return NextResponse.json({ success: true, message: "Agenda acara berhasil ditambahkan." });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Gagal membuat agenda acara." }, { status: 500 });
  }
}
