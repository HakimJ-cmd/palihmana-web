import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
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

    if (user && user.passwordHash) {
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (isValid) {
        await createSession({
          userId: user.id,
          email: user.email,
          name: user.name || "Staf Redaksi",
          role: user.role,
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
      await createSession({
        userId: "admin-seed-id",
        email: cleanEmail,
        name: "Super Admin",
        role: "SUPER_ADMIN",
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
      await createSession({
        userId: "editor-seed-id",
        email: cleanEmail,
        name: "Editor Redaksi",
        role: "EDITOR",
      });

      return NextResponse.json({
        success: true,
        user: { id: "editor-seed-id", email: cleanEmail, name: "Editor Redaksi", role: "EDITOR" },
      });
    }

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
