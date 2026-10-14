import { db } from "@/lib/db";
import { Pilar, ArticleStatus } from "@prisma/client";
import { ArticleItem } from "@/types";

// Resilient fallback sample articles matching the 6 pilars of Palihmana.id
export const FALLBACK_ARTICLES: ArticleItem[] = [
  {
    id: "fb-1",
    title: "Cara Membuat KTP Elektronik di Tasikmalaya: Panduan Lengkap 2026",
    slug: "cara-membuat-ktp-elektronik-tasikmalaya-2026",
    subtitle: "Syarat, biaya, dan langkah-langkah lengkap untuk membuat e-KTP di Disdukcapil Kota Tasikmalaya",
    pilar: "UTILITY" as Pilar,
    isFeatured: true,
    coverImage: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop",
    coverAlt: "Ilustrasi dokumen kependudukan e-KTP",
    readingMinutes: 4,
    summaryPoints: [
      "KTP-el dapat dibuat di Disdukcapil atau kecamatan setempat",
      "Tidak ada biaya resmi (100% gratis)",
      "Proses selesai 1–14 hari kerja tergantung ketersediaan blangko",
      "Bawa fotokopi KK asli dan surat pengantar dari RT/RW",
    ],
    bodyText: "Mengurus KTP Elektronik (KTP-el) di Tasikmalaya kini semakin tertib dan transparan...",
    bodyJson: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Mengurus KTP Elektronik (KTP-el) di Tasikmalaya kini semakin tertib dan transparan. Warga tidak perlu khawatir menghadapi pungutan liar atau alur yang berbelit-belit jika memahami prosedur resminya sejak awal." }],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Syarat Berkas yang Perlu Dibawa" }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "Sebelum datang ke kantor Disdukcapil atau kantor kecamatan, pastikan Anda telah menyiapkan dokumen berikut: (1) Fotokopi Kartu Keluarga terbaru, (2) Surat pengantar dari RT/RW setempat, dan (3) Formulir permohonan F-1.21 yang telah ditandatangani." }],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Tahapan Perekaman Biometrik" }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "Bagi pemula yang baru menginjak usia 17 tahun, Anda diwajibkan melakukan perekaman biometrik yang meliputi foto iris mata, sidik jari sepuluh jari, tanda tangan digital, dan pas foto resmi di lokasi." }],
        },
      ],
    },
    publishedAt: new Date(),
    contentUpdatedAt: new Date(),
    lastVerifiedAt: new Date(),
    author: {
      name: "Editor Redaksi",
      avatar: null,
    },
    tags: [{ tag: { name: "Dokumen", slug: "dokumen" } }],
  },
  {
    id: "fb-2",
    title: "Memahami Angka Kemiskinan Tasikmalaya: Data, Konteks, dan Apa Artinya",
    slug: "angka-kemiskinan-tasikmalaya-data-konteks",
    subtitle: "Analisis data BPS dan apa yang sebenarnya terjadi di lapangan",
    pilar: "UNDERSTAND" as Pilar,
    isFeatured: false,
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop",
    coverAlt: "Pemandangan perkotaan dan aktivitas warga",
    readingMinutes: 6,
    summaryPoints: [
      "Angka kemiskinan Tasikmalaya 2025 sebesar 8,2%, turun dari 9,1% tahun sebelumnya",
      "Data agregat perlu dilihat berdampingan dengan indeks kedalaman kemiskinan",
      "Sektor informal masih mendominasi serapan tenaga kerja lokal",
    ],
    bodyText: "Setiap rilis data kemiskinan oleh BPS kerap memicu perdebatan di ruang publik Tasikmalaya...",
    bodyJson: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Setiap rilis data kemiskinan oleh BPS kerap memicu perdebatan di ruang publik Tasikmalaya. Sebagian pihak menganggap angka tersebut terlalu optimis, sementara pihak lain melihatnya sebagai bukti perbaikan ekonomi daerah." }],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Apa Itu Garis Kemiskinan?" }],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "BPS mendefinisikan kemiskinan berdasarkan ketidakmampuan dari sisi ekonomi untuk memenuhi kebutuhan dasar makanan dan bukan makanan yang diukur dari sisi pengeluaran per kapita per bulan." }],
        },
      ],
    },
    publishedAt: new Date(Date.now() - 86400000),
    contentUpdatedAt: new Date(Date.now() - 86400000),
    lastVerifiedAt: null,
    author: {
      name: "Super Admin",
      avatar: null,
    },
    tags: [{ tag: { name: "Ekonomi", slug: "ekonomi" } }],
  },
  {
    id: "fb-3",
    title: "Tempat Ngopi Tersembunyi di Tasikmalaya yang Wajib Dikunjungi",
    slug: "tempat-ngopi-tersembunyi-tasikmalaya",
    subtitle: "Dari café di gang sempit sampai warung legendaris yang puluhan tahun bertahan",
    pilar: "DISCOVER" as Pilar,
    isFeatured: false,
    coverImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1200&auto=format&fit=crop",
    coverAlt: "Secangkir kopi di kedai kayu klasik",
    readingMinutes: 5,
    summaryPoints: [
      "5 rekomendasi kedai kopi lokal berkarakter",
      "Kisaran harga bersahabat antara Rp 12.000 hingga Rp 25.000",
      "Akses mudah dengan kendaraan roda dua maupun angkot",
    ],
    bodyText: "Tasikmalaya memiliki kultur ngopi yang khas...",
    bodyJson: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Tasikmalaya memiliki kultur ngopi yang khas. Tidak melulu kedai modern berkonsep industrial, kota ini menyimpan ruang-ruang santai di sudut gang yang menawarkan obrolan hangat dan seduhan kopi yang jujur." }],
        },
      ],
    },
    publishedAt: new Date(Date.now() - 172800000),
    contentUpdatedAt: new Date(Date.now() - 172800000),
    lastVerifiedAt: null,
    author: {
      name: "Editor Redaksi",
      avatar: null,
    },
    tags: [{ tag: { name: "Kuliner", slug: "kuliner" } }],
  },
  {
    id: "fb-4",
    title: "Mengenal Maestro Bordir Kawalu: Penjaga Tradisi Benang Emas",
    slug: "maestro-bordir-kawalu-penjaga-tradisi",
    subtitle: "Kisah pengrajin yang setia menjaga pakem bordir manual di tengah gempuran mesin komputer",
    pilar: "PEOPLE" as Pilar,
    isFeatured: false,
    coverImage: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1200&auto=format&fit=crop",
    coverAlt: "Kain tradisional dengan sentuhan sulaman benang",
    readingMinutes: 8,
    summaryPoints: [
      "Perjalanan 45 tahun berkarya di sentra bordir Kawalu",
      "Perbedaan bordir manual mesin jahit hitam dengan bordir digital",
      "Tantangan regenerasi perajin muda di era modern",
    ],
    bodyText: "Suara derak mesin jahit manual ritmis terdengar dari ruang tengah...",
    bodyJson: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Suara derak mesin jahit manual ritmis terdengar dari ruang tengah rumah panggung di bilangan Kawalu. Di sinilah Ibu Siti Aminah duduk dengan kacamata berbingkai perak, jemarinya lincah mengarahkan kain di bawah jarum yang bergerak konstan." }],
        },
      ],
    },
    publishedAt: new Date(Date.now() - 259200000),
    contentUpdatedAt: new Date(Date.now() - 259200000),
    lastVerifiedAt: null,
    author: {
      name: "Super Admin",
      avatar: null,
    },
    tags: [{ tag: { name: "UMKM", slug: "umkm" } }],
  },
  {
    id: "fb-5",
    title: "Mengapa Transportasi Publik Kota Tasik Belum Jadi Pilihan Utama?",
    slug: "mengapa-transportasi-publik-tasik-belum-jadi-pilihan",
    subtitle: "Opini tentang tata kelola trayek angkot, kemacetan, dan kenyamanan pejalan kaki",
    pilar: "OPINION" as Pilar,
    isFeatured: false,
    coverImage: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?q=80&w=1200&auto=format&fit=crop",
    coverAlt: "Jalanan perkotaan saat jam sibuk",
    readingMinutes: 5,
    summaryPoints: [
      "Dominasi kendaraan pribadi roda dua di jalanan Tasikmalaya",
      "Ketidakpastian waktu tempuh dan rute angkutan kota",
      "Langkah solutif yang bisa diambil pemerintah daerah",
    ],
    bodyText: "Bagi warga Tasikmalaya, sepeda motor adalah urat nadi utama bepergian...",
    bodyJson: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Bagi warga Tasikmalaya, sepeda motor adalah urat nadi utama bepergian. Namun di balik kepraktisan itu, jalan-jalan utama kota kerap tersendat di jam berangkat dan pulang kerja." }],
        },
      ],
    },
    publishedAt: new Date(Date.now() - 345600000),
    contentUpdatedAt: new Date(Date.now() - 345600000),
    lastVerifiedAt: null,
    author: {
      name: "Editor Redaksi",
      avatar: null,
    },
    tags: [{ tag: { name: "Transportasi", slug: "transportasi" } }],
  },
  {
    id: "fb-6",
    title: "Catatan Sore dari Alun-Alun: Riuh Tawa, Pedagang Cilok, dan Merpati",
    slug: "catatan-sore-alun-alun-tasikmalaya",
    subtitle: "Refleksi visual dan percakapan ringan di jantung ruang terbuka warga",
    pilar: "FIELD_NOTES" as Pilar,
    isFeatured: false,
    coverImage: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?q=80&w=1200&auto=format&fit=crop",
    coverAlt: "Taman terbuka dengan pepohonan rindang",
    readingMinutes: 4,
    summaryPoints: [
      "Dinamika ruang publik gratis yang ramah keluarga",
      "Kisah pedagang kuliner khas pinggir jalan",
      "Pentingnya menjaga kebersihan bersama",
    ],
    bodyText: "Matahari mulai meredup di balik menara Masjid Agung...",
    bodyJson: {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Matahari mulai meredup di balik menara Masjid Agung. Anak-anak kecil berlarian mengejar gelembung sabun yang ditiup penjual mainan di pelataran barat alun-alun." }],
        },
      ],
    },
    publishedAt: new Date(Date.now() - 432000000),
    contentUpdatedAt: new Date(Date.now() - 432000000),
    lastVerifiedAt: null,
    author: {
      name: "Super Admin",
      avatar: null,
    },
    tags: [{ tag: { name: "Wisata", slug: "wisata" } }],
  },
];

export async function getFeaturedArticle(): Promise<ArticleItem> {
  try {
    const article = await db.article.findFirst({
      where: {
        status: ArticleStatus.PUBLISHED,
        isFeatured: true,
      },
      include: {
        author: { select: { name: true, avatar: true } },
        tags: { include: { tag: true } },
      },
      orderBy: { publishedAt: "desc" },
    });

    if (article) return article as unknown as ArticleItem;
  } catch (error) {
    // Database might not be configured yet; using fallback
  }

  return FALLBACK_ARTICLES[0];
}

export async function getLatestArticles({
  limit = 10,
  pilar,
  excludeSlug,
}: {
  limit?: number;
  pilar?: Pilar;
  excludeSlug?: string;
} = {}): Promise<ArticleItem[]> {
  try {
    const where: any = {
      status: ArticleStatus.PUBLISHED,
    };

    if (pilar) {
      where.pilar = pilar;
    }

    if (excludeSlug) {
      where.slug = { not: excludeSlug };
    }

    const articles = await db.article.findMany({
      where,
      include: {
        author: { select: { name: true, avatar: true } },
        tags: { include: { tag: true } },
      },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });

    if (articles && articles.length > 0) return articles as unknown as ArticleItem[];
  } catch (error) {
    // Database fallback
  }

  let list = FALLBACK_ARTICLES;
  if (pilar) {
    list = list.filter((a) => a.pilar === pilar);
  }
  if (excludeSlug) {
    list = list.filter((a) => a.slug !== excludeSlug);
  }
  return list.slice(0, limit);
}

export async function getArticleBySlug(slug: string): Promise<ArticleItem | null> {
  try {
    const article = await db.article.findUnique({
      where: { slug },
      include: {
        author: { select: { name: true, avatar: true } },
        tags: { include: { tag: true } },
        corrections: { orderBy: { createdAt: "asc" } },
      },
    });

    if (article) return article as unknown as ArticleItem;
  } catch (error) {
    // Database fallback
  }

  return FALLBACK_ARTICLES.find((a) => a.slug === slug) || null;
}

export async function searchArticles(query: string): Promise<ArticleItem[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  try {
    const articles = await db.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { subtitle: { contains: q, mode: "insensitive" } },
          { bodyText: { contains: q, mode: "insensitive" } },
        ],
      },
      include: {
        author: { select: { name: true, avatar: true } },
        tags: { include: { tag: true } },
      },
      orderBy: { publishedAt: "desc" },
      take: 20,
    });

    if (articles && articles.length > 0) return articles as unknown as ArticleItem[];
  } catch (error) {
    // Database fallback
  }

  return FALLBACK_ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      (a.subtitle && a.subtitle.toLowerCase().includes(q)) ||
      (a.bodyText && a.bodyText.toLowerCase().includes(q))
  );
}
