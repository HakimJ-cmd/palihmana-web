import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { sanitizeText } from "@/lib/sanitize";
import { Role } from "@prisma/client";
import { logAuditEvent } from "@/lib/audit";
import {
  getStaffUsers,
  createStaffUser,
  deleteStaffUser,
  findStaffByEmail,
} from "@/modules/users/store";

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

    const users = await getStaffUsers();
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Gagal memuat daftar staf." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // Hanya SUPER_ADMIN yang berhak membuat akun staf / kontributor baru
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        {
          error:
            "Akses ditolak. Hanya peran Super Admin yang memiliki hak membuat akun staf/kontributor.",
        },
        { status: 403 }
      );
    }

    const data = await request.json();
    const { name, email, password, role = "CONTRIBUTOR" } = data;

    const cleanName = sanitizeText(name, 100);
    const cleanEmail = email ? email.trim().toLowerCase() : "";

    if (!cleanName || !cleanEmail || !password) {
      return NextResponse.json(
        { error: "Nama lengkap, alamat email, dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Format alamat email tidak valid." },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "Kata sandi minimal 8 karakter demi keamanan redaksi." },
        { status: 400 }
      );
    }

    const validRoles: Role[] = [Role.CONTRIBUTOR, Role.EDITOR];
    if (!validRoles.includes(role as Role)) {
      return NextResponse.json(
        { error: "Peran harus berupa CONTRIBUTOR atau EDITOR." },
        { status: 400 }
      );
    }

    // Check existing email
    const existing = await findStaffByEmail(cleanEmail);
    if (existing) {
      return NextResponse.json(
        { error: `Email ${cleanEmail} sudah terdaftar dalam sistem.` },
        { status: 409 }
      );
    }

    const created = await createStaffUser({
      name: cleanName,
      email: cleanEmail,
      password,
      role: role as Role,
    });

    await logAuditEvent({
      userId: session.userId,
      action: "STAFF_ACCOUNT_CREATED",
      targetType: "USER",
      targetId: created.id,
      metadata: {
        createdUserEmail: created.email,
        assignedRole: created.role,
        createdBy: session.email,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Akun ${created.role} untuk ${created.name} berhasil dibuat.`,
      user: created,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Gagal membuat akun staf." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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

    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "Hanya Super Admin yang diizinkan menghapus akun staf." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID staf wajib disertakan." },
        { status: 400 }
      );
    }

    if (id === session.userId || id === "admin-seed-id") {
      return NextResponse.json(
        { error: "Tidak dapat menghapus akun Super Admin utama sendiri." },
        { status: 400 }
      );
    }

    const ok = await deleteStaffUser(id);
    if (!ok) {
      return NextResponse.json(
        { error: "Staf tidak ditemukan atau gagal dihapus." },
        { status: 404 }
      );
    }

    await logAuditEvent({
      userId: session.userId,
      action: "STAFF_ACCOUNT_DELETED",
      targetType: "USER",
      targetId: id,
    });

    return NextResponse.json({
      success: true,
      message: "Akun staf berhasil dihapus.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Gagal menghapus akun staf." },
      { status: 500 }
    );
  }
}
