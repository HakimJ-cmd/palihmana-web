import { NextRequest, NextResponse } from "next/server";
import { getEventById, getEventBySlug } from "@/modules/events/queries";

function formatICalDate(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function escapeICalText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let event = await getEventById(id);
  if (!event) {
    event = await getEventBySlug(id);
  }

  if (!event) {
    return new NextResponse("Acara tidak ditemukan", { status: 404 });
  }

  const startDate = new Date(event.eventDate);
  const endDate = event.eventEnd
    ? new Date(event.eventEnd)
    : new Date(startDate.getTime() + 3 * 60 * 60 * 1000); // default 3 hours

  const now = new Date();
  const uid = `${event.id || event.slug}-palihmana-event@palihmana.id`;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Palihmana.id//Event Calendar Pasundan//ID",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatICalDate(now)}`,
    `DTSTART:${formatICalDate(startDate)}`,
    `DTEND:${formatICalDate(endDate)}`,
    `SUMMARY:${escapeICalText(event.title)}`,
    `DESCRIPTION:${escapeICalText(`${event.description}\\nPenyelenggara: ${event.organizer}\\nHarga: ${event.priceNote || "Gratis"}`)}`,
    `LOCATION:${escapeICalText(event.location)}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new NextResponse(icsContent, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.slug || "agenda"}.ics"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
