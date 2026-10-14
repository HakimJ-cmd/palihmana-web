# DESIGN — Palihmana.id

> **Design System & UI/UX Guidelines** · Versi 1.0 · Oktober 2026
> Prinsip: *visual tidak boleh mengalahkan informasi.* Identitas hijau/teal menjadi basis.
> Nilai bertanda **(turunan)** adalah usulan yang diturunkan dari token inti; token inti berasal dari spesifikasi proyek.

---

## 1. Aturan Desain Utama (Anti-AI Slop Directive)

Palihmana adalah media berbasis kegunaan dan kepercayaan. Tampilan harus terasa **dirancang oleh manusia untuk keperluan tertentu**, bukan hasil template generik.

### 1.1 Dilarang
| Pola | Alasan |
|------|--------|
| Gradient blob / mesh gradient berlebihan sebagai dekorasi | Tidak membawa informasi, terasa generik |
| Komponen 3D / rounded berlebihan (pill di mana-mana, glassmorphism tebal, bayangan dalam) | Mengalahkan konten |
| Ilustrasi AI generik, ikon dekoratif tanpa fungsi | Merusak kepercayaan editorial |
| Layout portal berita tradisional: sidebar penuh, banner iklan, teaser bertumpuk | Bertentangan dengan positioning |
| Wajah orang nyata atau aset resmi hasil rekayasa AI | Aturan AI handbook |
| Animasi masuk berlebihan, parallax, auto-play carousel | Mengganggu bacaan, memperlambat |
| Badge/warna berbeda untuk setiap kategori (efek pelangi) | Hierarki visual kabur |
| Copy hiperbolis ("Temukan keajaiban…", "Revolusioner") | Tidak sesuai suara editorial |
| Dark pattern: pop-up newsletter di detik pertama, wall login | Menghalangi pembaca |

### 1.2 Pendekatan Editorial Modern
- **Bersih, lega, berbasis grid, kontras tinggi.**
- **Konten adalah desain.** Hierarki dibangun dari tipografi, jarak, dan garis tipis, bukan dekorasi.
- **Foto asli** dan arsip autentik diprioritaskan; tanpa foto lebih baik daripada foto stok yang menyesatkan.
- **Satu aksen, dipakai dengan alasan.** Amber hanya untuk Utility dan status.
- **Fungsional dulu:** setiap elemen harus menjawab "membantu pembaca melakukan apa?"

### 1.3 Uji Cepat Sebelum Merge Desain
- [ ] Bisakah elemen ini dihapus tanpa mengurangi kegunaan? Jika ya, hapus.
- [ ] Apakah ada lebih dari satu fokus visual per layar mobile?
- [ ] Apakah hierarki terbaca tanpa warna (grayscale)?
- [ ] Apakah ada ruang bernapas di antara kelompok informasi?
- [ ] Apakah teks dan target sentuh memenuhi ukuran minimum?

---

## 2. Visual Tokens & Color Palette

### 2.1 Warna Inti

| Token | Nilai | Peran |
|-------|-------|-------|
| `--color-primary` | `#0F4C3A` | Deep Teal / Forest Green: tautan, tombol utama, identitas |
| `--color-bg` | `#F9F9F7` | Warm Off-White: latar utama mode terang (alternatif `#F3F4F6` untuk permukaan sekunder) |
| `--color-surface-alt` | `#F3F4F6` | Permukaan sekunder, blok summary, tab |
| `--color-text` | `#1A1A1A` | Off-Black / Charcoal: teks utama |
| `--color-accent` | `#D97706` | Warm Amber / Gold: tag Utility & status |

### 2.2 Warna Turunan (usulan)

| Token | Nilai (turunan) | Peran |
|-------|-----------------|-------|
| `--color-primary-hover` | `#0B3A2C` | Hover/pressed tombol primer |
| `--color-primary-tint` | `#E6EFEB` | Latar badge/blok informasi lembut |
| `--color-text-muted` | `#5B6360` | Teks sekunder, metadata |
| `--color-border` | `#E3E3DE` | Garis tipis, pemisah |
| `--color-accent-tint` | `#FDF1DC` | Latar kotak catatan/utility |
| `--color-accent-ink` | `#8A4B04` | Teks amber di atas tint |
| `--color-danger` | `#B42318` | Khusus kontak darurat & error (tambahan fungsional) |
| `--color-success` | `#1F7A4D` | Status "Terverifikasi" |

### 2.3 Mode Gelap (turunan)

| Token | Nilai |
|-------|-------|
| `--color-bg` | `#121413` |
| `--color-surface` | `#1B1F1D` |
| `--color-border` | `#2C3330` |
| `--color-text` | `#ECECE8` |
| `--color-text-muted` | `#A3ACA8` |
| `--color-primary` | `#4FB591` (teal terang agar kontras di latar gelap) |
| `--color-primary-tint` | `#18312A` |
| `--color-accent` | `#F59E0B` |

### 2.4 Aturan Penggunaan Warna & Kontras
- **Teks utama:** `#1A1A1A` di atas `#F9F9F7` memberi kontras sangat tinggi (>15:1).
- **Primary di atas bg terang:** `#0F4C3A` di atas `#F9F9F7` ±9:1 (lolos AAA untuk teks biasa).
- **Amber sebagai latar:** teks di atas `#D97706` memakai charcoal `#1A1A1A` (±5,4:1, lolos AA). **Jangan** menaruh teks putih kecil di atas amber (±3,2:1, gagal AA) dan jangan memakai amber sebagai warna teks kecil di atas putih.
- Seluruh nilai kontras wajib diverifikasi dengan alat (mis. Stark, axe) saat implementasi.
- Informasi **tidak boleh hanya dibawa oleh warna** (selalu sertakan label/ikon/teks).
- Pilar selain Utility memakai gaya netral: teks charcoal + garis/outline tipis, atau tint teal. Hanya **Utility** yang amber.

### 2.5 Konfigurasi Tailwind (referensi)

```ts
// tailwind.config.ts (cuplikan)
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "var(--color-primary)", hover: "var(--color-primary-hover)", tint: "var(--color-primary-tint)" },
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        ink: { DEFAULT: "var(--color-text)", muted: "var(--color-text-muted)" },
        line: "var(--color-border)",
        accent: { DEFAULT: "var(--color-accent)", tint: "var(--color-accent-tint)", ink: "var(--color-accent-ink)" },
        danger: "var(--color-danger)",
        success: "var(--color-success)",
      },
      fontFamily: {
        serif: ["var(--font-newsreader)", "Merriweather", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      maxWidth: { read: "40.625rem", page: "75rem" }, // 650px baca, 1200px halaman
      borderRadius: { sm: "4px", DEFAULT: "6px", lg: "10px" },
    },
  },
} satisfies Config;
```

```css
/* globals.css (cuplikan) */
:root {
  --color-primary: #0F4C3A;
  --color-primary-hover: #0B3A2C;
  --color-primary-tint: #E6EFEB;
  --color-bg: #F9F9F7;
  --color-surface: #FFFFFF;
  --color-text: #1A1A1A;
  --color-text-muted: #5B6360;
  --color-border: #E3E3DE;
  --color-accent: #D97706;
  --color-accent-tint: #FDF1DC;
  --color-accent-ink: #8A4B04;
  --color-danger: #B42318;
  --color-success: #1F7A4D;
}
[data-theme="dark"] {
  --color-primary: #4FB591;
  --color-primary-tint: #18312A;
  --color-bg: #121413;
  --color-surface: #1B1F1D;
  --color-text: #ECECE8;
  --color-text-muted: #A3ACA8;
  --color-border: #2C3330;
  --color-accent: #F59E0B;
  --color-accent-tint: #3A2A0B;
  --color-accent-ink: #FBBF24;
}
```

### 2.6 Bentuk, Garis, Elevasi
- **Radius kecil** (4–10 px). Tidak ada pill penuh selain chip filter.
- **Garis tipis 1 px** (`--color-border`) sebagai pemisah utama; bayangan hanya untuk overlay (menu, dialog) dan sangat halus.
- Tidak ada gradient pada latar; gradient hanya diizinkan sebagai overlay gelap tipis di atas foto agar judul terbaca.

---

## 3. Hierarki Tipografi

### 3.1 Keluarga Font
| Peran | Font | Catatan |
|-------|------|---------|
| Heading (serif modern) | **Newsreader** (utama) / Merriweather (cadangan) | Kesan editorial, nyaman untuk judul panjang bahasa Indonesia |
| Body, navigasi, UI | **Inter** (utama) / Plus Jakarta Sans (alternatif) | Bersih, terbaca di layar kecil |

Muat melalui `next/font` (self-host, `display: swap`, subset `latin`). Tentukan fallback sistem agar tidak ada layout shift.

### 3.2 Skala Tipografi

| Token | Mobile | Desktop | Font | Berat | Line-height |
|-------|--------|---------|------|-------|-------------|
| `display` (judul hero) | 30 px | 44 px | Serif | 700 | 1.15 |
| `h1` (judul artikel) | 28 px | 40 px | Serif | 700 | 1.2 |
| `h2` | 22 px | 28 px | Serif | 600 | 1.25 |
| `h3` | 19 px | 22 px | Serif | 600 | 1.3 |
| `body-read` (isi artikel) | 17–18 px | 19 px | Sans | 400 | 1.7 |
| `body` (UI) | 16 px | 16 px | Sans | 400 | 1.5 |
| `label` / nav | 14 px | 14 px | Sans | 500 | 1.4 |
| `meta` (tanggal, penulis) | 13 px | 13 px | Sans | 400 | 1.4 |
| `badge` | 12 px | 12 px | Sans | 600 (uppercase, tracking 0,04em) | 1.2 |

Aturan:
- Teks isi artikel **tidak pernah di bawah 17 px** di ponsel.
- Lebar baris ideal **60–70 karakter** (`max-width: 40.625rem` ≈ 650 px).
- Judul rata kiri, tidak lebih dari 3 baris di mobile; hindari huruf kapital penuh pada judul.
- Gunakan angka tabular (`font-variant-numeric: tabular-nums`) untuk tabel, nomor telepon, harga, dan tanggal.
- Tautan di dalam teks diberi garis bawah, warna `--color-primary`.

---

## 4. Layout Grid & Spacing

### 4.1 Mobile-First Grid

| Breakpoint | Lebar | Kolom | Gutter | Margin halaman |
|------------|-------|-------|--------|----------------|
| Default (mobile) | 0–639 | 4 | 16 px | 16 px |
| `sm` | 640–1023 | 8 | 20 px | 24 px |
| `lg` | 1024–1279 | 12 | 24 px | 32 px |
| `xl` | ≥1280 | 12 (maks. 1200 px) | 24 px | auto |

- Konten dirancang untuk **360 px** terlebih dahulu; uji juga pada 320 px.
- Kolom baca artikel: satu kolom terpusat, `max-width: 650px`. Pada desktop, ruang kosong di samping dibiarkan (tidak diisi iklan/sidebar).
- Beranda desktop: hero 12 kolom (8 + 4), grid kartu 3 kolom.

### 4.2 Skala Spasi (basis 4 px)
`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96`

### 4.3 Pedoman *Breathing Room*
| Konteks | Mobile | Desktop |
|---------|--------|---------|
| Padding halaman (kiri/kanan) | 16 | 32+ |
| Jarak antar section di beranda | 48 | 64–96 |
| Jarak antar kartu | 24 | 24–32 |
| Padding dalam kartu | 16 | 20 |
| Jarak paragraf artikel | 1,25em | 1,4em |
| Jarak heading ke konten | 12 | 16 |
| Jarak heading section ke paragraf sebelumnya | 40 | 56 |

Aturan: **satu kelompok informasi = satu ruang.** Pisahkan kelompok dengan spasi, bukan dengan kotak berlapis. Maksimal dua tingkat kontainer bersarang.

### 4.4 Target Sentuh & Interaksi
- Target sentuh minimal **44×44 px**; tombol kontak darurat **≥ 56 px** tinggi.
- Fokus terlihat: outline 2 px `--color-primary` dengan offset 2 px.
- Gerak: durasi 120–200 ms, easing sederhana; hormati `prefers-reduced-motion`. Tidak ada animasi yang mengubah tata letak.

---

## 5. Anatomi Komponen UI Utama

### 5.1 Card Artikel

```
┌────────────────────────────────┐
│ ┌────────────────────────────┐ │
│ │        THUMBNAIL 16:9      │ │  ← foto asli, alt text wajib, rasio tetap (tanpa CLS)
│ └────────────────────────────┘ │
│ [UTILITY]  · 4 mnt baca        │  ← badge pilar + estimasi baca
│                                │
│ Judul Artikel Maksimal Tiga    │  ← serif h3, maks 3 baris (line-clamp)
│ Baris di Mobile                │
│                                │
│ Diperbarui 12 Okt 2026    [🔖] │  ← freshness date + tombol simpan (≥44px)
└────────────────────────────────┘
```

| Elemen | Aturan |
|--------|--------|
| Thumbnail | Rasio 16:9, `next/image`, `sizes` responsif, `loading="lazy"` kecuali hero |
| Badge Pilar | `UTILITY` = amber (latar `--color-accent`, teks charcoal). Pilar lain = outline netral / tint teal |
| Judul | Serif, `h3`, `line-clamp-3`, seluruh kartu dapat ditekan (satu tautan utama) |
| Freshness Date | "Diperbarui {tanggal}" bila ada update; jika tidak, tanggal terbit. Artikel Utility: ikon jam + "Dicek {tanggal}" |
| Bookmark | Tombol ikon terpisah dari tautan kartu, `aria-pressed`, label "Simpan artikel" / "Hapus dari simpanan" (aktif Fase 3; sebelumnya disembunyikan) |
| Varian | **Hero** (besar, judul di bawah foto), **Standar** (vertikal), **Kompak** (horizontal: teks + thumbnail kecil, untuk daftar/hasil cari) |

### 5.2 Utility Widget & Emergency Button

**Emergency Button (click-to-call)**

```
┌──────────────────────────────────────┐
│ 📞  Ambulans / IGD RSUD dr. Soekardjo │
│     (0265) 000000          [ TELEPON ]│  ← nomor contoh; isi dari DB
└──────────────────────────────────────┘
```

- Elemen `<a href="tel:+62265...">`; tinggi ≥ 56 px, latar `--color-danger`, teks putih (kontras >7:1), ikon telepon + teks "Telepon".
- Nomor ditampilkan sebagai teks (tabular nums) agar bisa dibaca/disalin.
- Satu tampilan "Kontak Darurat" selalu berada di bagian atas Utility Hub.
- Tidak menampilkan nomor yang belum diverifikasi sebagai darurat.

**Utility Card (layanan)**

```
┌──────────────────────────────────────┐
│ [HEALTH]                  Dicek 3 Okt │
│ Nama Layanan                          │
│ Alamat singkat · Jam layanan          │
│ [Telepon]  [Buka di Maps]  [Panduan]  │
└──────────────────────────────────────┘
```
- Badge kategori: `EMERGENCY`, `TRANSPORT`, `DOCUMENT`, `HEALTH`, `UMKM` (gaya amber untuk keseluruhan Utility).
- Aksi utama maksimal tiga tombol; satu primer (Telepon bila ada).

**Panduan & Syarat**
- Daftar langkah bernomor besar; checklist persyaratan; ringkasan biaya & lama proses dalam *summary box* (latar `--color-primary-tint`).
- Tanggal pengecekan selalu tampil di bagian atas.

### 5.3 Komponen Kepercayaan

| Komponen | Spesifikasi |
|----------|-------------|
| **Freshness Badge** | Chip kecil dengan ikon jam: "Diperbarui 3 hari lalu". >90 hari untuk artikel Utility → tampil status netral "Perlu dicek ulang" (tidak menyalahkan) |
| **Correction Note Box** | Di atas badan artikel; garis kiri 3 px `--color-accent`, latar `--color-accent-tint`, judul "Koreksi", isi + tanggal. Tidak dapat ditutup pembaca |
| **Status Verifikasi Acara** | `Terverifikasi · 10 Okt` (ikon centang, hijau) atau `Belum diverifikasi` (outline netral); teks selalu ada selain ikon |
| **Label Konten Sponsor** | Pita teks "KONTEN SPONSOR" di atas judul, kontras tinggi, tidak dapat dinonaktifkan |
| **Summary Box** | Poin ringkas 3–5 butir di awal artikel; latar `--color-primary-tint` |
| **Sumber & Data** | Di akhir artikel Understand/Opini: daftar sumber dengan tanggal akses |

### 5.4 Header & Responsive Navigation

**Mobile (default)**
```
┌──────────────────────────────────────┐
│ ☰   PALIHMANA.ID            🔍   ◐  │  ← menu · logo · cari · tema
├──────────────────────────────────────┤
│ Semua | Utility | Understand | Opini… │  ← tab pilar, scroll horizontal
└──────────────────────────────────────┘
```
- Header tipis (±56 px), **tidak sticky penuh**: sembunyi saat scroll turun, muncul saat scroll naik (kurangi gangguan baca).
- Menu ☰ membuka panel penuh: Beranda, Kategori, Kalender, Layanan Warga, Simpanan, Masuk. Item yang belum tersedia (sesuai fase) **tidak ditampilkan**.
- Ikon cari membuka overlay pencarian dengan fokus otomatis.
- Toggle tema: Terang / Gelap / Ikuti sistem.

**Desktop (≥1024 px)**
```
PALIHMANA.ID   Beranda  Understand  Discover  People  Kalender  Layanan      🔍  ◐  Masuk
```
- Navigasi horizontal, logo kiri, aksi kanan; garis bawah 2 px primary menandai halaman aktif.
- Tidak ada mega-menu.

**Footer:** tautan Tentang, Kebijakan Editorial, Kebijakan Koreksi, Kontak, Privasi; tautan sosial (IG, TikTok, FB); pernyataan singkat "Social membuat orang menemukan kami. Web membuat pengetahuan bertahan." Tidak ada widget berat.

### 5.5 Komponen Lain

| Komponen | Catatan |
|----------|---------|
| **Tab Pilar** | Scroll horizontal di mobile, aktif ditandai garis bawah primer + teks tebal; `role="tablist"` |
| **Kotak Cari** | Input 48 px, tombol hapus, hasil terkelompok: *Artikel*, *Utility* (dan *Acara* setelah Fase 2); saran kata kunci sebagai chip |
| **Tampilan Kalender** | Grid bulan dengan titik penanda hari; mobile default List; filter Gratis/Berbayar sebagai segmented control |
| **Event Card** | Blok tanggal (tgl besar + bulan) kiri, judul, lokasi, chip harga (Gratis/Berbayar), status verifikasi |
| **Tombol** | Primer (isi `--color-primary`, teks putih), Sekunder (outline), Teks. Tinggi 44–48 px, radius 6 px |
| **Form Auth (Fase 4)** | Label di atas input, pesan error spesifik berbahasa Indonesia, tampilkan/sembunyikan kata sandi |
| **Skeleton / Empty / Error** | Skeleton netral tanpa shimmer berlebihan; empty state memberi tindakan ("Belum ada simpanan. Jelajahi Utility"); error ramah, tanpa jargon |
| **Gambar & Media** | Wajib alt text, kredit tampil di keterangan; rasio ditetapkan di awal |

---

## 6. Template Halaman (Wireframe Ringkas)

**Beranda (mobile)**
```
Header + Tab Pilar
─────────────────
[ HERO: foto + badge + judul + meta ]
─────────────────
Kabar Terbaru
[Kartu][Kartu][Kartu]...   [Muat lebih banyak]
─────────────────
(Fase 2) Acara Terdekat · Layanan Cepat
─────────────────
Footer
```

**Artikel**
```
Breadcrumb · Badge pilar
Judul (h1) · Subjudul
Penulis · Terbit · Diperbarui [Freshness]
[Correction Note Box jika ada]
[Summary Box]
Isi artikel (kolom 650px)
Sumber / Data
Bagikan: WhatsApp · Facebook · X · Salin tautan
Related Stories (3)
```

**Utility Hub (Fase 2)**
```
Kontak Darurat (click-to-call, selalu paling atas)
Cari layanan   [chip: Kesehatan | Dokumen | Transportasi | UMKM]
Daftar layanan (Utility Card)
Panduan populer
```

---

## 7. Aksesibilitas

- Target: **WCAG 2.2 AA**.
- Struktur heading berurutan; landmark (`header`, `nav`, `main`, `footer`).
- Semua interaksi dapat dioperasikan keyboard; urutan fokus logis; "Lewati ke konten" di awal halaman.
- Tab, dialog, dan overlay cari memakai pola ARIA yang benar dan fokus terkurung.
- Ukuran teks mengikuti pengaturan pengguna (gunakan `rem`).
- Tidak ada konten yang bergantung pada hover.
- Gambar informatif punya alt deskriptif; dekoratif `alt=""`.

---

## 8. Suara & Microcopy

- Bahasa mudah dipahami, dekat, tidak birokratis; sapaan **Baraya** dipakai secukupnya, tidak dipaksakan.
- Jangan menggurui, jangan membuat sensasi dari tragedi.
- Contoh microcopy:
  - Tombol: "Simpan artikel", "Telepon", "Buka di Maps", "Bagikan"
  - Kosong: "Belum ada simpanan. Tandai artikel yang ingin kamu baca lagi."
  - Cari tanpa hasil: "Belum ada hasil untuk '{kata}'. Coba kata lain atau lihat kategori."
  - Status: "Terverifikasi", "Belum diverifikasi", "Diperbarui {tanggal}", "Dicek {tanggal}"
- Hindari jargon teknis dan huruf kapital berlebihan pada antarmuka.

---

## 9. Performa Visual

- Gambar: format AVIF/WebP, ukuran responsif, hero diprioritaskan (`priority`), lainnya lazy.
- Font: maksimal 2 keluarga, 3–4 berat total, self-host.
- Tanpa pustaka animasi berat; CSS transition secukupnya.
- Budget halaman artikel: HTML+CSS+JS kritis < 150 KB (gz) sebelum gambar.
- Hindari embed pihak ketiga yang berat; gunakan *facade* (klik untuk memuat) untuk video.

---

## 10. Checklist Review Desain (Definition of Done UI)

- [ ] Lolos Anti-AI Slop checklist §1.3
- [ ] Hanya memakai token warna/tipografi/spasi dari dokumen ini
- [ ] Teruji di 320, 360, 768, 1024, 1280 px
- [ ] Mode terang & gelap teruji, kontras diverifikasi alat
- [ ] Target sentuh ≥ 44 px, fokus terlihat
- [ ] Gambar punya alt text dan kredit
- [ ] Tidak ada CLS yang terlihat; Lighthouse mobile ≥ 90
- [ ] Microcopy mengikuti suara Palihmana
