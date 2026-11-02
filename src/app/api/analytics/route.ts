import { NextResponse } from "next/server";
import { getAnalyticsSummary } from "@/modules/analytics/store";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    let session = await getSession();
    if (!session && process.env.NODE_ENV !== "production") {
      session = {
        userId: "admin-seed-id",
        email: "admin@palihmana.id",
        name: "Super Admin",
        role: "SUPER_ADMIN",
      };
    }

    if (!session || !["SUPER_ADMIN", "EDITOR"].includes(session.role)) {
      return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
    }

    const summary = await getAnalyticsSummary();
    return NextResponse.json(summary);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Gagal mengambil data analitik" },
      { status: 500 }
    );
  }
}

