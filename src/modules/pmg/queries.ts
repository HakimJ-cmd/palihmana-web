import { PmgCategory, PMG_CATEGORY_LABELS } from "@/lib/constants";

export interface PmgItem {
  id: string;
  title: string;
  slug: string;
  category: PmgCategory;
  summary: string;
  content: string;
  coverImage: string;
  rating?: number | null;
  platform?: string | null;
  author: string;
  tags: string[];
  featured: boolean;
  publishedAt: string;
  releaseYear?: string | null;
  externalUrl?: string | null;
}

export const INITIAL_PMG_ITEMS: PmgItem[] = [
  {
    id: "pmg-1",
    title: "Black Myth: Wukong — Review Mendalam, Analisis Visual Unreal Engine 5 & Uji Performa di PC Menengah",
    slug: "black-myth-wukong-review-tasikmalaya",
    category: "GAME_REVIEW",
    summary: "Visual memukau berpadu dengan adaptasi mitologi Perjalanan ke Barat yang brutal. Kami menguji performa di resolusi 1440p serta tips mengalahkan boss terberat di Chapter 3.",
    content: "Black Myth: Wukong membuktikan bahwa developer Game Science mampu mengeksekusi visual AAA kelas dunia. Dengan sistem pertarungan berbasis tongkat ruyi dan sihir transformasi, setiap pertempuran menuntut presisi menghindar yang ketat. Komunitas gamer Tasikmalaya yang telah mencoba di arena rental PS5 maupun PC gaming sepakat bahwa game ini merupakan salah satu pencapaian industri action RPG paling berkesan tahun ini.",
    coverImage: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
    rating: 9.4,
    platform: "PC (Steam) / PS5",
    author: "Tim PMG Gaming",
    tags: ["Action RPG", "Soulslike", "Unreal Engine 5", "PC Gaming", "PS5"],
    featured: true,
    publishedAt: "2026-10-22T10:00:00Z",
    releaseYear: "2026",
    externalUrl: "https://www.instagram.com/pmg.id/",
  },
  {
    id: "pmg-2",
    title: "Panduan Merakit Gunpla Pemula: Dari High Grade ke Real Grade, Pemilihan Nipper & Teknik Panel Lining Rapi",
    slug: "panduan-merakit-gunpla-pemula-tasikmalaya",
    category: "TOYS_HOBBY",
    summary: "Hobi merakit model kit Gundam makin menjamur di Tasikmalaya. Simak tips memilih kit pertama, alat potong presisi pemula, hingga teknik membuat detail garis tampak tajam.",
    content: "Membangun model kit Gunpla bukan sekadar memotong plastik dari runner, melainkan seni meditasi mekanikal yang menyenangkan. Untuk pemula di Priangan Timur, lini High Grade (HG 1/144) adalah gerbang terbaik sebelum melangkah ke Real Grade (RG) atau Master Grade (MG). Pastikan menggunakan single-blade nipper dan spidol panel line khusus untuk hasil terbaik tanpa nubmark mengganggu.",
    coverImage: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=800&auto=format&fit=crop&q=80",
    rating: 9.6,
    platform: "Model Kit Bandai (1/144)",
    author: "Rian Gundam Tasik",
    tags: ["Gunpla", "Bandai", "Hobby", "Model Kit", "Otaku Tasik"],
    featured: true,
    publishedAt: "2026-10-20T14:30:00Z",
    releaseYear: "2026",
    externalUrl: "https://www.instagram.com/pmg.id/",
  },
  {
    id: "pmg-3",
    title: "Turnamen Mobile Legends Baraya Cup 2026 Tasikmalaya: Total Hadiah Rp15 Juta & Jadwal Kualifikasi",
    slug: "turnamen-mobile-legends-baraya-cup-tasik-2026",
    category: "ESPORTS_EVENT",
    summary: "Ajang unjuk kebolehan 64 tim esports pelajar dan umum se-Priangan Timur. Registrasi kualifikasi online dibuka mulai pekan ini dengan grand final offline di Dadaha.",
    content: "Kompetisi Mobile Legends Baraya Cup resmi bergulir untuk menjaring talenta atlet esports muda Jawa Barat bagian timur. Menggunakan format draft pick turnamen terbaru patch Oktober 2026, babak 8 besar akan diadakan secara langsung dengan panggung mini dan live commentary di kompleks olahraga Dadaha Kota Tasikmalaya.",
    coverImage: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80",
    rating: 9.2,
    platform: "Mobile (Android & iOS)",
    author: "Esports Corner PMG",
    tags: ["Esports", "Mobile Legends", "Turnamen Lokal", "Priangan Timur"],
    featured: true,
    publishedAt: "2026-10-18T09:15:00Z",
    releaseYear: "2026",
    externalUrl: "https://www.instagram.com/pmg.id/",
  },
  {
    id: "pmg-4",
    title: "5 Rekomendasi Keyboard Mekanikal Murah di Bawah Rp500 Ribu: Nyaman Mengetik & Responsif untuk Game Kompetitif",
    slug: "rekomendasi-keyboard-mekanikal-murah-2026",
    category: "GEAR_TECH",
    summary: "Keyboard mekanikal kini semakin terjangkau dengan switch hotswap, gasket mount, dan keycaps PBT tahan aus. Berikut 5 pilihan terbaik yang bisa dibeli di toko komputer lokal.",
    content: "Kini keyboard mekanikal berkualitas tak lagi harus menguras kantong jutaan rupiah. Mulai dari layout 65% hingga TKL, merek-merek seperti VortexSeries, Fantech, dan Rexus menghadirkan fitur switch pre-lubed yang empuk dan kabel braided yang awet untuk setup gaming kamar Anda.",
    coverImage: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
    rating: 8.8,
    platform: "PC / Laptop Setup",
    author: "Tim PMG Gear",
    tags: ["Keyboard", "Custom Setup", "Gaming Gear", "Hardware Budget"],
    featured: false,
    publishedAt: "2026-10-15T11:00:00Z",
    releaseYear: "2026",
    externalUrl: "https://www.instagram.com/pmg.id/",
  },
  {
    id: "pmg-5",
    title: "Komunitas Hot Wheels Tasikmalaya: Berburu Treasure Hunt Super di Toko Grosir & Arena Drag Race Akhir Pekan",
    slug: "komunitas-hot-wheels-tasikmalaya-treasure-hunt",
    category: "TOYS_HOBBY",
    summary: "Bukan sekadar mainan anak, koleksi diecast skala 1:64 menjadi wadah investasi mini dan silaturahmi antargenerasi di Tasikmalaya. Simak tips 'gantungan' dan komunitasnya.",
    content: "Setiap hari Minggu pagi, para kolektor diecast Tasikmalaya berkumpul untuk bertukar info restock gantungan toko ritel, unboxing lot kemasan baru, serta menggelar balap drag 6 lajur. Antusiasme komunitas ini membuktikan bahwa mainan koleksi memiliki nilai apresiasi visual dan persahabatan yang kuat.",
    coverImage: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&auto=format&fit=crop&q=80",
    rating: 9.3,
    platform: "Diecast 1:64",
    author: "Aldi Kolektor Diecast",
    tags: ["Hot Wheels", "Diecast", "Koleksi Mainan", "Tasik Hobi"],
    featured: false,
    publishedAt: "2026-10-12T16:20:00Z",
    releaseYear: "2026",
    externalUrl: "https://www.instagram.com/pmg.id/",
  },
  {
    id: "pmg-6",
    title: "Direktori Rental PS5 & Spot Game Cafe di Kota Tasikmalaya: Fasilitas Layar 4K, Sofa Empuk & Tarif Per Jam",
    slug: "direktori-rental-ps5-game-cafe-tasikmalaya",
    category: "COMMUNITY",
    summary: "Daftar rekomendasi tempat rental PlayStation 5 dan lounge bermain game bersama kawan di seputaran Tawang, Cihideung, dan Indihiang yang bersih dan nyaman.",
    content: "Mencari tempat mabar EA Sports FC 25 atau Tekken 8 di Tasikmalaya? Kami merangkum 6 rental PS5 terlengkap dengan pendingin ruangan, snack bar, serta opsi sewa ruangan privat untuk turnamen mini santai bersama sahabat.",
    coverImage: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80",
    rating: 9.5,
    platform: "PlayStation 5 / Console Lounge",
    author: "Tim PMG Explore",
    tags: ["Rental PS5", "Game Cafe", "Nongkrong Tasik", "Mabar"],
    featured: false,
    publishedAt: "2026-10-10T08:00:00Z",
    releaseYear: "2026",
    externalUrl: "https://www.instagram.com/pmg.id/",
  },
  {
    id: "pmg-7",
    title: "Sirkuit Tamiya Mini 4WD Dadaha: Settingan Chassis B-MAX & Side Damper Paling Konsisten Melibas Roller Coaster",
    slug: "sirkuit-tamiya-mini-4wd-dadaha-tasik",
    category: "TOYS_HOBBY",
    summary: "Kembalinya nostalgia balap Tamiya 4WD dengan regulasi modern B-MAX. Uji coba rem busa dan derajat roller untuk lintasan teknikal bertingkat.",
    content: "Animo racer Tamiya di Kota Tasikmalaya kian melonjak dengan hadirnya sirkuit permanen 5-lane di area Dadaha. Pemilihan gear ratio 3.5:1 dipadukan dengan motor Hyper-Dash 3 dan pemberat side damper terbukti menjadi setup paling stabil menghadapi jump-landing tanjakan curam.",
    coverImage: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop&q=80",
    rating: 9.0,
    platform: "Tamiya Mini 4WD",
    author: "Racer Tasik Project",
    tags: ["Tamiya", "Mini 4WD", "B-MAX", "Dadaha", "Komunitas Balap"],
    featured: false,
    publishedAt: "2026-10-08T13:45:00Z",
    releaseYear: "2026",
    externalUrl: "https://www.instagram.com/pmg.id/",
  },
  {
    id: "pmg-8",
    title: "EA Sports FC 25: Formasi Taktik 4-3-3 Tiki-Taka Cepat & Rekomendasi PlayStyle Pemain Kunci",
    slug: "ea-sports-fc-25-taktik-formasi-terbaik",
    category: "GAME_REVIEW",
    summary: "Fitur FC IQ terbaru mengubah dinamika peran pemain di lapangan hijau virtual. Panduan taktik menyerang tanpa celah serangan balik kilat lawan.",
    content: "Di game sepak bola terbaru EA Sports FC 25, pengenalan sistem FC IQ membuat setiap taktik manajerial terasa nyata. Kami membedah cara memanfaatkan PlayStyle+ seperti Finesse Shot dan Bruiser untuk mendominasi pertandingan online maupun offline di Tasikmalaya.",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    rating: 8.9,
    platform: "PS5 / PC / Xbox",
    author: "Coach PMG Football",
    tags: ["EA FC 25", "Sepak Bola Virtual", "Tips Taktik", "PlayStation"],
    featured: false,
    publishedAt: "2026-10-05T10:30:00Z",
    releaseYear: "2026",
    externalUrl: "https://www.instagram.com/pmg.id/",
  }
];

// In-memory runtime cache for admin additions/edits
let runtimePmgStore: PmgItem[] = [...INITIAL_PMG_ITEMS];

export async function getPmgItems(): Promise<PmgItem[]> {
  return runtimePmgStore;
}

export async function getPmgItemBySlug(slug: string): Promise<PmgItem | null> {
  return runtimePmgStore.find((item) => item.slug === slug) || null;
}

export async function createPmgItem(item: Omit<PmgItem, "id" | "publishedAt">): Promise<PmgItem> {
  const newItem: PmgItem = {
    ...item,
    id: `pmg-${Date.now()}`,
    publishedAt: new Date().toISOString(),
  };
  runtimePmgStore = [newItem, ...runtimePmgStore];
  return newItem;
}

export async function updatePmgItem(id: string, updates: Partial<PmgItem>): Promise<PmgItem | null> {
  const index = runtimePmgStore.findIndex((i) => i.id === id);
  if (index === -1) return null;
  runtimePmgStore[index] = { ...runtimePmgStore[index], ...updates };
  return runtimePmgStore[index];
}

export async function deletePmgItem(id: string): Promise<boolean> {
  const initialLen = runtimePmgStore.length;
  runtimePmgStore = runtimePmgStore.filter((i) => i.id !== id);
  return runtimePmgStore.length < initialLen;
}
