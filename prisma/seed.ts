import { PrismaClient, Role, Pilar, ArticleStatus, GeoScope, UtilityCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database Palihmana.id...");

  // ─── Super Admin ───────────────────────────────────────────────
  const adminPassword = await bcrypt.hash(
    process.env.SEED_ADMIN_PASSWORD || "PalihmanaAdmin2026!",
    12
  );

  const admin = await db.user.upsert({
    where: { email: "admin@palihmana.id" },
    update: {},
    create: {
      email: "admin@palihmana.id",
      name: "Super Admin",
      passwordHash: adminPassword,
      role: Role.SUPER_ADMIN,
      emailVerified: new Date(),
    },
  });
  console.log("✅ Super Admin dibuat:", admin.email);

  // ─── Editor ────────────────────────────────────────────────────
  const editorPassword = await bcrypt.hash("EditorPalihmana2026!", 12);
  const editor = await db.user.upsert({
    where: { email: "editor@palihmana.id" },
    update: {},
    create: {
      email: "editor@palihmana.id",
      name: "Editor Redaksi",
      passwordHash: editorPassword,
      role: Role.EDITOR,
      emailVerified: new Date(),
    },
  });
  console.log("✅ Editor dibuat:", editor.email);

  // ─── Tags Dasar ────────────────────────────────────────────────
  const tagData = [
    { name: "Kesehatan", slug: "kesehatan" },
    { name: "Dokumen", slug: "dokumen" },
    { name: "Transportasi", slug: "transportasi" },
    { name: "Ekonomi", slug: "ekonomi" },
    { name: "Hukum", slug: "hukum" },
    { name: "Sejarah", slug: "sejarah" },
    { name: "Pendidikan", slug: "pendidikan" },
    { name: "Kuliner", slug: "kuliner" },
    { name: "Wisata", slug: "wisata" },
    { name: "UMKM", slug: "umkm" },
  ];

  for (const tag of tagData) {
    await db.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }
  console.log("✅ Tags dasar dibuat:", tagData.length);

  // ─── Artikel Contoh ────────────────────────────────────────────
  const sampleBody = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "Ini adalah contoh artikel dari Palihmana.id — media digital lokal Tasikmalaya yang fokus pada utility, kejelasan, dan kepercayaan." }],
      },
      {
        type: "paragraph",
        content: [{ type: "text", text: "Artikel ini dapat diedit melalui panel admin setelah masuk sebagai Editor atau Super Admin." }],
      },
    ],
  };

  const articles = [
    {
      title: "Cara Membuat KTP Elektronik di Tasikmalaya: Panduan Lengkap 2026",
      slug: "cara-membuat-ktp-elektronik-tasikmalaya-2026",
      subtitle: "Syarat, biaya, dan langkah-langkah lengkap untuk membuat e-KTP di Disdukcapil Kota Tasikmalaya",
      pilar: Pilar.UTILITY,
      geoScope: GeoScope.LOCAL,
      status: ArticleStatus.PUBLISHED,
      isFeatured: true,
      summaryPoints: [
        "KTP-el dapat dibuat di Disdukcapil atau kecamatan setempat",
        "Tidak ada biaya resmi (gratis)",
        "Proses selesai 1–14 hari kerja",
        "Perlu membawa KK asli dan surat pengantar RT/RW",
      ],
      readingMinutes: 4,
      publishedAt: new Date(),
      contentUpdatedAt: new Date(),
      lastVerifiedAt: new Date(),
    },
    {
      title: "Memahami Angka Kemiskinan Tasikmalaya: Data, Konteks, dan Apa Artinya",
      slug: "angka-kemiskinan-tasikmalaya-data-konteks",
      subtitle: "Analisis data BPS dan apa yang sebenarnya terjadi di lapangan",
      pilar: Pilar.UNDERSTAND,
      geoScope: GeoScope.LOCAL,
      status: ArticleStatus.PUBLISHED,
      summaryPoints: [
        "Angka kemiskinan Tasikmalaya 2025 sebesar 8,2%, turun dari 9,1% tahun sebelumnya",
        "Data tidak selalu mencerminkan kondisi di lapangan",
        "Perlu dilihat dari sisi metodologi pengukuran BPS",
      ],
      readingMinutes: 7,
      publishedAt: new Date(Date.now() - 86400000),
      contentUpdatedAt: new Date(Date.now() - 86400000),
    },
    {
      title: "Tempat Ngopi Tersembunyi di Tasikmalaya yang Harus Kamu Coba",
      slug: "tempat-ngopi-tersembunyi-tasikmalaya",
      subtitle: "Dari café di gang sempit sampai warung legendaris yang sudah puluhan tahun berdiri",
      pilar: Pilar.DISCOVER,
      geoScope: GeoScope.LOCAL,
      status: ArticleStatus.PUBLISHED,
      summaryPoints: [
        "5 lokasi pilihan editor dengan harga mulai Rp5.000",
        "Setiap tempat punya cerita dan karakter berbeda",
        "Cocok dikunjungi sore hingga malam hari",
      ],
      readingMinutes: 5,
      publishedAt: new Date(Date.now() - 172800000),
      contentUpdatedAt: new Date(Date.now() - 172800000),
    },
    {
      title: "Pak Asep, 30 Tahun Jadi Tukang Odong-odong Keliling Tasikmalaya",
      slug: "pak-asep-tukang-odong-odong-tasikmalaya",
      subtitle: "Ketika mainan anak-anak menjadi cara bertahan hidup sekaligus cara menjaga kenangan",
      pilar: Pilar.PEOPLE,
      geoScope: GeoScope.LOCAL,
      status: ArticleStatus.PUBLISHED,
      summaryPoints: [
        "Pak Asep sudah keliling Tasikmalaya selama 30 tahun",
        "Penghasilan tidak menentu, tapi ia tak mau berhenti",
        "Odong-odong baginya bukan sekadar bisnis",
      ],
      readingMinutes: 6,
      publishedAt: new Date(Date.now() - 259200000),
      contentUpdatedAt: new Date(Date.now() - 259200000),
    },
    {
      title: "Catatan dari Pasar Cikurubuk: Antara Modernisasi dan Warisan",
      slug: "catatan-pasar-cikurubuk-modernisasi-warisan",
      subtitle: "Observasi singkat di pasar tradisional terbesar Tasikmalaya",
      pilar: Pilar.FIELD_NOTES,
      geoScope: GeoScope.LOCAL,
      status: ArticleStatus.PUBLISHED,
      summaryPoints: [
        "Pasar Cikurubuk menjadi pusat ekonomi informal ribuan pedagang",
        "Modernisasi membawa tantangan dan peluang sekaligus",
        "Pedagang lama dan baru berdampingan dengan cara unik",
      ],
      readingMinutes: 4,
      publishedAt: new Date(Date.now() - 345600000),
      contentUpdatedAt: new Date(Date.now() - 345600000),
    },
    {
      title: "Panduan Lengkap Transportasi Umum di Tasikmalaya 2026",
      slug: "panduan-transportasi-umum-tasikmalaya-2026",
      subtitle: "Rute angkot, ojek online, dan cara pergi ke mana saja di Tasikmalaya tanpa ribet",
      pilar: Pilar.UTILITY,
      geoScope: GeoScope.LOCAL,
      status: ArticleStatus.PUBLISHED,
      summaryPoints: [
        "Ada 15 trayek angkot aktif di Kota Tasikmalaya",
        "Tarif angkot Rp4.000–Rp6.000 tergantung jarak",
        "Stasiun Tasikmalaya menjadi hub utama ke luar kota",
      ],
      readingMinutes: 5,
      publishedAt: new Date(Date.now() - 432000000),
      contentUpdatedAt: new Date(Date.now() - 432000000),
      lastVerifiedAt: new Date(Date.now() - 432000000),
    },
  ];

  for (const article of articles) {
    await db.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        ...article,
        bodyJson: sampleBody,
        bodyText: "Ini adalah contoh artikel dari Palihmana.id.",
        authorId: admin.id,
      },
    });
  }
  console.log("✅ Artikel contoh dibuat:", articles.length);

  // ─── Utilities ─────────────────────────────────────────────────
  const utilities = [
    {
      title: "IGD RSUD dr. Soekardjo",
      slug: "igd-rsud-soekardjo",
      category: UtilityCategory.EMERGENCY,
      description: "Instalasi Gawat Darurat RSUD dr. Soekardjo, rumah sakit umum daerah utama Kota Tasikmalaya. Buka 24 jam.",
      contactNumber: "+62265330193",
      address: "Jl. Rumah Sakit No.33, Tasikmalaya",
      openingHours: "24 jam",
      isActive: true,
      sortOrder: 1,
      lastVerifiedAt: new Date(),
    },
    {
      title: "Polres Tasikmalaya Kota",
      slug: "polres-tasikmalaya-kota",
      category: UtilityCategory.EMERGENCY,
      description: "Kantor Polres Tasikmalaya Kota untuk pelaporan tindak pidana dan kedaruratan keamanan.",
      contactNumber: "+62265331110",
      address: "Jl. HZ Mustofa No.18, Tasikmalaya",
      openingHours: "24 jam",
      isActive: true,
      sortOrder: 2,
      lastVerifiedAt: new Date(),
    },
    {
      title: "Dinas Kependudukan dan Pencatatan Sipil (Disdukcapil)",
      slug: "disdukcapil-kota-tasikmalaya",
      category: UtilityCategory.DOCUMENT,
      description: "Pelayanan KTP, KK, akta kelahiran, akta kematian, surat pindah, dan dokumen kependudukan lainnya.",
      contactNumber: "+62265327620",
      address: "Jl. Letjen Ibrahim Adjie No.10, Tasikmalaya",
      openingHours: "Senin–Jumat: 08.00–15.00 WIB",
      isActive: true,
      sortOrder: 1,
      lastVerifiedAt: new Date(),
    },
    {
      title: "Pemadam Kebakaran (Damkar) Kota Tasikmalaya",
      slug: "damkar-kota-tasikmalaya",
      category: UtilityCategory.EMERGENCY,
      description: "Dinas Pemadam Kebakaran dan Penyelamatan Kota Tasikmalaya. Hubungi segera jika terjadi kebakaran.",
      contactNumber: "+62265311113",
      address: "Jl. Tentara Pelajar, Tasikmalaya",
      openingHours: "24 jam",
      isActive: true,
      sortOrder: 3,
      lastVerifiedAt: new Date(),
    },
  ];

  for (const utility of utilities) {
    await db.utility.upsert({
      where: { slug: utility.slug },
      update: {},
      create: {
        ...utility,
        createdById: admin.id,
      },
    });
  }
  console.log("✅ Utilities dibuat:", utilities.length);

  console.log("\n🎉 Seeding selesai!");
  console.log("───────────────────────────────────");
  console.log("Login admin: admin@palihmana.id");
  console.log("Password:    PalihmanaAdmin2026! (ganti setelah login pertama)");
  console.log("───────────────────────────────────");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
