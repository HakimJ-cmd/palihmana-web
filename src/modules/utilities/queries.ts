import { db } from "@/lib/db";
import { UtilityCategory } from "@prisma/client";

export interface UtilityItem {
  id: string;
  title: string;
  slug: string;
  category: UtilityCategory;
  description: string;
  contactNumber?: string | null;
  gmapsLink?: string | null;
  address?: string | null;
  openingHours?: string | null;
  guideJson?: any;
  isActive: boolean;
  sortOrder: number;
  lastVerifiedAt?: Date | string | null;
}

export const FALLBACK_UTILITIES: UtilityItem[] = [
  // EMERGENCY
  {
    id: "utl-1",
    title: "IGD RSUD dr. Soekardjo Kota Tasikmalaya",
    slug: "igd-rsud-dr-soekardjo",
    category: "EMERGENCY" as UtilityCategory,
    description: "Layanan gawat darurat 24 jam dengan fasilitas ambulans siaga dan rujukan trauma center.",
    contactNumber: "+62265331411",
    gmapsLink: "https://maps.google.com/?q=RSUD+dr.+Soekardjo+Tasikmalaya",
    address: "Jl. Rumah Sakit No.33, Empangsari, Tawang, Kota Tasikmalaya",
    openingHours: "24 Jam Setiap Hari",
    isActive: true,
    sortOrder: 1,
    lastVerifiedAt: new Date(),
  },
  {
    id: "utl-2",
    title: "Pemadam Kebakaran (Damkar) Kota Tasikmalaya",
    slug: "damkar-kota-tasikmalaya",
    category: "EMERGENCY" as UtilityCategory,
    description: "Penanganan kebakaran, evakuasi sarang tawon, penyelamatan hewan liar, dan darurat lingkungan.",
    contactNumber: "+62265313113",
    gmapsLink: "https://maps.google.com/?q=Damkar+Kota+Tasikmalaya",
    address: "Jl. Ir. H. Juanda No.191, Sukamulya, Bungursari, Kota Tasikmalaya",
    openingHours: "24 Jam Setiap Hari",
    isActive: true,
    sortOrder: 2,
    lastVerifiedAt: new Date(),
  },
  {
    id: "utl-3",
    title: "BPBD (Badan Penanggulangan Bencana Daerah)",
    slug: "bpbd-kota-tasikmalaya",
    category: "EMERGENCY" as UtilityCategory,
    description: "Pusat komando tanggap darurat bencana alam, tanah longsor, angin kencang, dan banjir luapan sungai.",
    contactNumber: "+62265321113",
    gmapsLink: "https://maps.google.com/?q=BPBD+Kota+Tasikmalaya",
    address: "Jl. Mayor S.L. Tobing No.105, Sambongpari, Mangkubumi, Kota Tasikmalaya",
    openingHours: "24 Jam Setiap Hari",
    isActive: true,
    sortOrder: 3,
    lastVerifiedAt: new Date(),
  },
  // DOCUMENT
  {
    id: "utl-4",
    title: "Disdukcapil Kota Tasikmalaya (Layanan e-KTP & KK)",
    slug: "disdukcapil-kota-tasikmalaya",
    category: "DOCUMENT" as UtilityCategory,
    description: "Perekaman e-KTP, pencetakan KIA, Kartu Keluarga baru, Akta Kelahiran, dan surat pindah domisili.",
    contactNumber: "+62265330193",
    gmapsLink: "https://maps.google.com/?q=Disdukcapil+Kota+Tasikmalaya",
    address: "Jl. Ir. H. Juanda No.190, Sukamulya, Bungursari, Kota Tasikmalaya",
    openingHours: "Senin – Jumat, 08.00 – 15.00 WIB",
    isActive: true,
    sortOrder: 4,
    lastVerifiedAt: new Date(),
  },
  {
    id: "utl-5",
    title: "Pelayanan SIM Satlantas Polres Tasikmalaya Kota",
    slug: "layanan-sim-polres-tasikmalaya-kota",
    category: "DOCUMENT" as UtilityCategory,
    description: "Perpanjangan dan pembuatan SIM A & SIM C baru. Tersedia layanan SIM Keliling berkala.",
    contactNumber: "+62265331110",
    gmapsLink: "https://maps.google.com/?q=Polres+Tasikmalaya+Kota",
    address: "Jl. Letnan Harun, Sukamulya, Bungursari, Kota Tasikmalaya",
    openingHours: "Senin – Sabtu, 08.00 – 12.00 WIB",
    isActive: true,
    sortOrder: 5,
    lastVerifiedAt: new Date(),
  },
  // TRANSPORT
  {
    id: "utl-6",
    title: "Terminal Tipe A Indihiang Kota Tasikmalaya",
    slug: "terminal-indihiang-tasikmalaya",
    category: "TRANSPORT" as UtilityCategory,
    description: "Pusat armada bus Antar Kota Antar Provinsi (AKAP) dan Antar Kota Dalam Provinsi (AKDP) Priangan Timur.",
    contactNumber: "+62265342111",
    gmapsLink: "https://maps.google.com/?q=Terminal+Indihiang+Tasikmalaya",
    address: "Jl. Brigjen Wasita Kusumah, Indihiang, Kota Tasikmalaya",
    openingHours: "24 Jam Operasional",
    isActive: true,
    sortOrder: 6,
    lastVerifiedAt: new Date(),
  },
  {
    id: "utl-7",
    title: "Stasiun Kereta Api Tasikmalaya (KAI Daop 2)",
    slug: "stasiun-tasikmalaya-kai",
    category: "TRANSPORT" as UtilityCategory,
    description: "Layanan kereta jarak jauh rute Bandung, Jakarta (Gambir/Pasar Senen), Yogyakarta, dan Surabaya.",
    contactNumber: "+6221121",
    gmapsLink: "https://maps.google.com/?q=Stasiun+Tasikmalaya",
    address: "Jl. Stasiun No.1, Cilembang, Cihideung, Kota Tasikmalaya",
    openingHours: "24 Jam Setiap Hari",
    isActive: true,
    sortOrder: 7,
    lastVerifiedAt: new Date(),
  },
  // HEALTH
  {
    id: "utl-8",
    title: "RS Jasa Kartini Tasikmalaya",
    slug: "rs-jasa-kartini-tasikmalaya",
    category: "HEALTH" as UtilityCategory,
    description: "Rumah sakit swasta tipe B dengan poliklinik spesialis lengkap, laboratorium, radiologi, dan ICU.",
    contactNumber: "+62265331808",
    gmapsLink: "https://maps.google.com/?q=RS+Jasa+Kartini+Tasikmalaya",
    address: "Jl. Otto Iskandardinata No.9, Empangsari, Tawang, Kota Tasikmalaya",
    openingHours: "24 Jam IGD & Rawat Inap",
    isActive: true,
    sortOrder: 8,
    lastVerifiedAt: new Date(),
  },
  // UMKM
  {
    id: "utl-9",
    title: "Sentra Kerajinan Bordir Kawalu",
    slug: "sentra-bordir-kawalu",
    category: "UMKM" as UtilityCategory,
    description: "Pusat industri bordir kebaya, mukena, baju koko, dan kain bordir berkualitas ekspor dan lokal.",
    contactNumber: null,
    gmapsLink: "https://maps.google.com/?q=Kawalu+Tasikmalaya",
    address: "Kecamatan Kawalu, Kota Tasikmalaya",
    openingHours: "Setiap Hari, 08.00 – 17.00 WIB",
    isActive: true,
    sortOrder: 9,
    lastVerifiedAt: new Date(),
  },
];

export async function getUtilities(category?: UtilityCategory): Promise<UtilityItem[]> {
  try {
    const where: any = { isActive: true };
    if (category) {
      where.category = category;
    }

    const items = await db.utility.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    if (items && items.length > 0) return items as unknown as UtilityItem[];
  } catch (e) {
    // Database fallback
  }

  if (category) {
    return FALLBACK_UTILITIES.filter((u) => u.category === category);
  }
  return FALLBACK_UTILITIES;
}
