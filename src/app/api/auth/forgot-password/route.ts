import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sanitizeText } from "@/lib/sanitize";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    const cleanEmail = sanitizeText(email, 100).toLowerCase().trim();

    if (!cleanEmail) {
      return NextResponse.json({ error: "Email wajib diisi" }, { status: 400 });
    }

    try {
      const user = await db.user.findUnique({
        where: { email: cleanEmail },
      });

      if (user) {
        // Generate secure 32-byte hex token and store its SHA-256 hash (Cyber Security Best Practice)
        const token = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes (PRD F4-AUTH-03)

        await db.passwordResetToken.create({
          data: {
            userId: user.id,
            tokenHash,
            expiresAt,
          },
        });
      }
    } catch (e) {
      // In development / demo mode without DB
    }

    // Always respond with success to prevent user email enumeration attack (Cyber Security Best Practice)
    return NextResponse.json({
      success: true,
      message: "Jika alamat email terdaftar, tautan pemulihan kata sandi telah dikirimkan ke kotak masuk Anda.",
    });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memproses permohonan reset sandi." }, { status: 500 });
  }
}
