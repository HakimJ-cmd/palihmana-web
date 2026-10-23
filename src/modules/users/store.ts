import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

export interface StaffUserItem {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  passwordHash?: string | null;
  plainPassword?: string | null;
  isActive: boolean;
  createdAt: Date;
}

const INITIAL_STAFF: StaffUserItem[] = [
  {
    id: "admin-seed-id",
    name: "Super Admin",
    email: "admin@palihmana.id",
    role: "SUPER_ADMIN" as Role,
    plainPassword: "PalihmanaAdmin2026!",
    passwordHash: "$2a$12$e6m5GfBfZGzYxM.zF0i4aet/oFjXwWfHh93x2eRkXkYp9O.w6cXeC", // PalihmanaAdmin2026!
    isActive: true,
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "editor-seed-id",
    name: "Editor Redaksi",
    email: "editor@palihmana.id",
    role: "EDITOR" as Role,
    plainPassword: "EditorPalihmana2026!",
    passwordHash: "$2a$12$6G2c58Q7J4g1q9sK9n7U/.r3vM5P9E6dG1zH4wY7aQ9eF6bE3xXyW", // EditorPalihmana2026!
    isActive: true,
    createdAt: new Date("2026-01-05"),
  },
  {
    id: "contrib-seed-id",
    name: "Kontributor Budaya Dadaha",
    email: "kontributor@palihmana.id",
    role: "CONTRIBUTOR" as Role,
    plainPassword: "KontributorPalihmana2026!",
    passwordHash: "$2a$12$6G2c58Q7J4g1q9sK9n7U/.r3vM5P9E6dG1zH4wY7aQ9eF6bE3xXyW",
    isActive: true,
    createdAt: new Date("2026-01-10"),
  },
];

const globalForStaff = globalThis as unknown as {
  palihmanaStaff: StaffUserItem[] | undefined;
};

if (!globalForStaff.palihmanaStaff) {
  globalForStaff.palihmanaStaff = INITIAL_STAFF;
}

export const FALLBACK_STAFF = globalForStaff.palihmanaStaff;

export async function getStaffUsers(): Promise<StaffUserItem[]> {
  try {
    const users = await db.user.findMany({
      where: {
        role: { in: [Role.SUPER_ADMIN, Role.EDITOR, Role.CONTRIBUTOR] },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (users && users.length > 0) {
      return users as unknown as StaffUserItem[];
    }
  } catch (e) {
    // Database fallback
  }

  return FALLBACK_STAFF.map(({ passwordHash, plainPassword, ...safe }) => safe as StaffUserItem);
}

export async function findStaffByEmail(email: string): Promise<StaffUserItem | null> {
  const cleanEmail = email.trim().toLowerCase();

  try {
    const user = await db.user.findUnique({
      where: { email: cleanEmail },
    });
    if (user) return user as unknown as StaffUserItem;
  } catch (e) {
    // Database fallback
  }

  return FALLBACK_STAFF.find((u) => u.email.toLowerCase() === cleanEmail) || null;
}

export async function createStaffUser({
  name,
  email,
  password,
  role,
}: {
  name: string;
  email: string;
  password: string;
  role: Role;
}): Promise<StaffUserItem> {
  const cleanEmail = email.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const user = await db.user.create({
      data: {
        name,
        email: cleanEmail,
        passwordHash,
        role,
        isActive: true,
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  } catch (e) {
    // In-memory fallback
    const newStaff: StaffUserItem = {
      id: `usr-contrib-${Date.now()}`,
      name,
      email: cleanEmail,
      role,
      plainPassword: password,
      passwordHash,
      isActive: true,
      createdAt: new Date(),
    };
    FALLBACK_STAFF.unshift(newStaff);

    return {
      id: newStaff.id,
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role,
      isActive: newStaff.isActive,
      createdAt: newStaff.createdAt,
    };
  }
}

export async function deleteStaffUser(id: string): Promise<boolean> {
  try {
    await db.user.delete({
      where: { id },
    });
    return true;
  } catch (e) {
    const idx = FALLBACK_STAFF.findIndex((u) => u.id === id);
    if (idx !== -1) {
      FALLBACK_STAFF.splice(idx, 1);
      return true;
    }
    return false;
  }
}
