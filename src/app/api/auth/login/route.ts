import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/session";
import { logAuditEvent } from "@/lib/audit";
import { findStaffByEmail } from "@/modules/users/store";

// Simple in-memory rate-limiter: IP -> { count, expiresAt }
const failedAttempts = new Map<string, { count: number; expiresAt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const now = Date.now();

    // Check rate-limit
    const attemptData = failedAttempts.get(ip);
    if (attemptData) {
      if (attemptData.expiresAt > now) {
        if (attemptData.count >= MAX_ATTEMPTS) {
          const remainingMinutes = Math.ceil((attemptData.expiresAt - now) / 60000);
          return NextResponse.json(
            {
              error: `Terlalu banyak percobaan gagal. Silakan tunggu ${remainingMinutes} menit sebelum mencoba kembali.`,
            },
            { status: 429 }
          );
        }
      } else {
        failedAttempts.delete(ip);
      }
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check DB first
    let user: any = null;
    try {
      user = await db.user.findUnique({
        where: { email: cleanEmail },
      });
    } catch (e) {
      // Database not connected yet
    }

    if (!user) {
      user = await findStaffByEmail(cleanEmail);
    }

    if (user) {
      let isValid = false;
      if (user.passwordHash) {
        try {
          isValid = await bcrypt.compare(password, user.passwordHash);
        } catch {
          // bcrypt compare failed
        }
      }
      if (!isValid && (user as any).plainPassword) {
        isValid = (user as any).plainPassword === password;
      }

      if (isValid) {
        failedAttempts.delete(ip); // reset on success
        await createSession({
          userId: user.id,
          email: user.email,
          name: user.name || "Staf Redaksi",
          role: user.role,
        });

        await logAuditEvent({
          userId: user.id,
          action: "USER_LOGIN_SUCCESS",
          targetType: "AUTH",
          targetId: user.id,
          metadata: { email: user.email, role: user.role },
          ipHash: ip,
        });

        return NextResponse.json({
          success: true,
          user: { id: user.id, email: user.email, name: user.name, role: user.role },
        });
      }
    }

    // Fallback seed credentials for local testing before Supabase setup
    if (
      cleanEmail === "admin@palihmana.id" &&
      password === "PalihmanaAdmin2026!"
    ) {
      failedAttempts.delete(ip);
      await createSession({
        userId: "admin-seed-id",
        email: cleanEmail,
        name: "Super Admin",
        role: "SUPER_ADMIN",
      });

      await logAuditEvent({
        userId: "admin-seed-id",
        action: "USER_LOGIN_SUCCESS",
        targetType: "AUTH",
        targetId: "admin-seed-id",
        metadata: { email: cleanEmail, role: "SUPER_ADMIN", note: "Seed credentials" },
        ipHash: ip,
      });

      return NextResponse.json({
        success: true,
        user: { id: "admin-seed-id", email: cleanEmail, name: "Super Admin", role: "SUPER_ADMIN" },
      });
    }

    if (
      cleanEmail === "editor@palihmana.id" &&
      password === "EditorPalihmana2026!"
    ) {
      failedAttempts.delete(ip);
      await createSession({
        userId: "editor-seed-id",
        email: cleanEmail,
        name: "Editor Redaksi",
        role: "EDITOR",
      });

      await logAuditEvent({
        userId: "editor-seed-id",
        action: "USER_LOGIN_SUCCESS",
        targetType: "AUTH",
        targetId: "editor-seed-id",
        metadata: { email: cleanEmail, role: "EDITOR", note: "Seed credentials" },
        ipHash: ip,
      });

      return NextResponse.json({
        success: true,
        user: { id: "editor-seed-id", email: cleanEmail, name: "Editor Redaksi", role: "EDITOR" },
      });
    }

    if (
      cleanEmail === "kontributor@palihmana.id" &&
      (password === "KontributorPalihmana2026!" ||
        password === "EditorPalihmana2026!" ||
        password === "PalihmanaAdmin2026!")
    ) {
      failedAttempts.delete(ip);
      await createSession({
        userId: "contrib-seed-id",
        email: cleanEmail,
        name: "Kontributor Budaya Dadaha",
        role: "CONTRIBUTOR",
      });

      await logAuditEvent({
        userId: "contrib-seed-id",
        action: "USER_LOGIN_SUCCESS",
        targetType: "AUTH",
        targetId: "contrib-seed-id",
        metadata: { email: cleanEmail, role: "CONTRIBUTOR", note: "Seed credentials" },
        ipHash: ip,
      });

      return NextResponse.json({
        success: true,
        user: { id: "contrib-seed-id", email: cleanEmail, name: "Kontributor Budaya Dadaha", role: "CONTRIBUTOR" },
      });
    }

    if (
      cleanEmail === "komersial@palihmana.id" &&
      (password === "KomersialPalihmana2026!" || password === "PalihmanaAdmin2026!")
    ) {
      failedAttempts.delete(ip);
      await createSession({
        userId: "commercial-seed-id",
        email: cleanEmail,
        name: "Mitra Bisnis & Iklan",
        role: "COMMERCIAL",
      });

      return NextResponse.json({
        success: true,
        user: { id: "commercial-seed-id", email: cleanEmail, name: "Mitra Bisnis & Iklan", role: "COMMERCIAL" },
      });
    }

    if (
      cleanEmail === "member@palihmana.id" &&
      (password === "BarayaMember2026!" || password === "PalihmanaAdmin2026!")
    ) {
      failedAttempts.delete(ip);
      await createSession({
        userId: "member-seed-id",
        email: cleanEmail,
        name: "Baraya Warga Tasik",
        role: "MEMBER",
      });

      return NextResponse.json({
        success: true,
        user: { id: "member-seed-id", email: cleanEmail, name: "Baraya Warga Tasik", role: "MEMBER" },
      });
    }

    // Record failed attempt
    const currentCount = (attemptData?.count || 0) + 1;
    failedAttempts.set(ip, {
      count: currentCount,
      expiresAt: now + LOCKOUT_MS,
    });

    await logAuditEvent({
      action: "USER_LOGIN_FAILED",
      targetType: "AUTH",
      metadata: { attemptedEmail: cleanEmail, count: currentCount },
      ipHash: ip,
    });

    return NextResponse.json(
      { error: "Email atau kata sandi tidak cocok." },
      { status: 401 }
    );
  } catch (error: any) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server." },
      { status: 500 }
    );
  }
}
