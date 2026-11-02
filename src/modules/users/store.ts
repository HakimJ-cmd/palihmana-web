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
    passwordHash: "$2a$12$e6m5GfBfZGzYxM.zF0i4aet/oFjXwWfHh93x2eRkXkYp9O.w6cXeC",
    isActive: true,
    createdAt: new Date("2026-01-01"),
  },
  {
    id: "editor-seed-id",
    name: "Editor Redaksi",
    email: "editor@palihmana.id",
    role: "EDITOR" as Role,
    plainPassword: "EditorPalihmana2026!",
    passwordHash: "$2a$12$6G2c58Q7J4g1q9sK9n7U/.r3vM5P9E6dG1zH4wY7aQ9eF6bE3xXyW",
    isActive: true,
    createdAt: new Date("2026-01-05"),
  },
  {
    id: "contrib-dadaha-id",
    name: "Kontributor Budaya Dadaha",
    email: "kontributor@palihmana.id",
    role: "CONTRIBUTOR" as Role,
    plainPassword: "KontributorPalihmana2026!",
    passwordHash: "$2a$12$6G2c58Q7J4g1q9sK9n7U/.r3vM5P9E6dG1zH4wY7aQ9eF6bE3xXyW",
    isActive: true,
    createdAt: new Date("2026-01-10"),
  },
  {
    id: "contrib-cihideung-id",
    name: "Kang Dedi (Kontributor Cihideung)",
    email: "dedi.kontributor@palihmana.id",
    role: "CONTRIBUTOR" as Role,
    plainPassword: "KangDediTasik2026!",
    passwordHash: "$2a$12$6G2c58Q7J4g1q9sK9n7U/.r3vM5P9E6dG1zH4wY7aQ9eF6bE3xXyW",
    isActive: true,
    createdAt: new Date("2026-01-15"),
  },
  {
    id: "contrib-singaparna-id",
    name: "Teh Siti (Kontributor UMKM Singaparna)",
    email: "siti.kontributor@palihmana.id",
    role: "CONTRIBUTOR" as Role,
    plainPassword: "TehSitiTasik2026!",
    passwordHash: "$2a$12$6G2c58Q7J4g1q9sK9n7U/.r3vM5P9E6dG1zH4wY7aQ9eF6bE3xXyW",
    isActive: true,
    createdAt: new Date("2026-01-20"),
  },
  {
    id: "commercial-seed-id",
    name: "Mitra Bisnis & Iklan",
    email: "komersial@palihmana.id",
    role: "COMMERCIAL" as Role,
    plainPassword: "KomersialPalihmana2026!",
    passwordHash: "$2a$12$6G2c58Q7J4g1q9sK9n7U/.r3vM5P9E6dG1zH4wY7aQ9eF6bE3xXyW",
    isActive: true,
    createdAt: new Date("2026-01-25"),
  },
  {
    id: "member-seed-id",
    name: "Baraya Warga Tasik",
    email: "member@palihmana.id",
    role: "MEMBER" as Role,
    plainPassword: "BarayaMember2026!",
    passwordHash: "$2a$12$6G2c58Q7J4g1q9sK9n7U/.r3vM5P9E6dG1zH4wY7aQ9eF6bE3xXyW",
    isActive: true,
    createdAt: new Date("2026-02-01"),
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

  const staffRoles: Role[] = [Role.SUPER_ADMIN, Role.EDITOR, Role.CONTRIBUTOR];
  return FALLBACK_STAFF
    .filter((u) => staffRoles.includes(u.role))
    .map(({ passwordHash, plainPassword, ...safe }) => safe as StaffUserItem);
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

export interface StaffProductivityItem {
  id: string;
  name: string;
  email: string;
  role: Role;
  totalArticles: number;
  publishedCount: number;
  draftCount: number;
  factCheckCount: number;
  readingMinutesTotal: number;
  productivityScore: number;
  lastActive: Date;
}

export interface ProductivitySummary {
  staffList: StaffProductivityItem[];
  totalEditorArticles: number;
  totalContributorArticles: number;
  totalContributors: number;
  totalEditors: number;
  monthlyTrend: {
    month: string;
    editorCount: number;
    contributorCount: number;
  }[];
}

export async function getStaffProductivityStats(): Promise<ProductivitySummary> {
  const staff = await getStaffUsers();

  // Baseline simulated stats for staff members
  const baselineStats: Record<
    string,
    {
      totalArticles: number;
      publishedCount: number;
      draftCount: number;
      factCheckCount: number;
      readingMinutesTotal: number;
      lastActiveDaysAgo: number;
    }
  > = {
    "admin-seed-id": {
      totalArticles: 5,
      publishedCount: 5,
      draftCount: 0,
      factCheckCount: 0,
      readingMinutesTotal: 25,
      lastActiveDaysAgo: 1,
    },
    "editor-seed-id": {
      totalArticles: 14,
      publishedCount: 11,
      draftCount: 2,
      factCheckCount: 1,
      readingMinutesTotal: 62,
      lastActiveDaysAgo: 0,
    },
    "contrib-dadaha-id": {
      totalArticles: 8,
      publishedCount: 6,
      draftCount: 1,
      factCheckCount: 1,
      readingMinutesTotal: 44,
      lastActiveDaysAgo: 2,
    },
    "contrib-cihideung-id": {
      totalArticles: 6,
      publishedCount: 5,
      draftCount: 1,
      factCheckCount: 0,
      readingMinutesTotal: 30,
      lastActiveDaysAgo: 1,
    },
    "contrib-singaparna-id": {
      totalArticles: 5,
      publishedCount: 4,
      draftCount: 0,
      factCheckCount: 1,
      readingMinutesTotal: 24,
      lastActiveDaysAgo: 3,
    },
  };

  const staffList: StaffProductivityItem[] = staff.map((s) => {
    const base = baselineStats[s.id] || {
      totalArticles: s.role === Role.EDITOR ? 4 : 2,
      publishedCount: s.role === Role.EDITOR ? 3 : 2,
      draftCount: 1,
      factCheckCount: 0,
      readingMinutesTotal: 15,
      lastActiveDaysAgo: 4,
    };

    // Calculate score out of 100 based on published articles and freshness
    const target = s.role === Role.EDITOR ? 12 : 6;
    const productivityScore = Math.min(100, Math.round((base.publishedCount / target) * 100));

    return {
      id: s.id,
      name: s.name || "Staf Palihmana",
      email: s.email,
      role: s.role,
      totalArticles: base.totalArticles,
      publishedCount: base.publishedCount,
      draftCount: base.draftCount,
      factCheckCount: base.factCheckCount,
      readingMinutesTotal: base.readingMinutesTotal,
      productivityScore,
      lastActive: new Date(Date.now() - base.lastActiveDaysAgo * 86400000),
    };
  });

  const totalContributors = staff.filter((s) => s.role === Role.CONTRIBUTOR).length;
  const totalEditors = staff.filter((s) => s.role === Role.EDITOR).length;

  const totalEditorArticles = staffList
    .filter((s) => s.role === Role.EDITOR)
    .reduce((acc, curr) => acc + curr.publishedCount, 0);

  const totalContributorArticles = staffList
    .filter((s) => s.role === Role.CONTRIBUTOR)
    .reduce((acc, curr) => acc + curr.publishedCount, 0);

  const monthlyTrend = [
    { month: "Agu 2026", editorCount: 6, contributorCount: 4 },
    { month: "Sep 2026", editorCount: 8, contributorCount: 7 },
    { month: "Okt 2026", editorCount: 11, contributorCount: 10 },
    { month: "Nov 2026", editorCount: 14, contributorCount: 15 },
  ];

  return {
    staffList,
    totalEditorArticles,
    totalContributorArticles,
    totalContributors,
    totalEditors,
    monthlyTrend,
  };
}
