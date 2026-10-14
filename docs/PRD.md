# PRD — Palihmana.id

> **Product Requirement Document** · Versi 1.0 · Oktober 2026
> Sumber acuan: *Palihmana.id Project Briefing & Operating Handbook v1.0* dan *Roadmap & Feature Flow Diagram (Fase 1–4)*.
> Status: living document. Prinsip inti dijaga; detail teknis dan taktik boleh berkembang.

---

## 1. Ringkasan Eksekutif & Visi Proyek

Palihmana.id adalah media digital lokal Tasikmalaya yang berorientasi **utility, explanatory, community-oriented, dan digital-first**. Tujuannya bukan mengejar jumlah berita, melainkan membuat informasi yang benar-benar membantu warga memahami kota, memakai layanan publik, menemukan peluang, mengenal orang dan tempat, serta membaca perubahan di sekitarnya.

Website adalah **rumah pengetahuan**: tempat versi paling lengkap, terstruktur, dapat dicari, dapat dirujuk, dapat diperbarui, dan bertahan lama.

### 1.1 Visi
Menjadi media digital lokal Tasikmalaya yang paling berguna, dapat dipercaya, mudah dipahami, dan relevan bagi kehidupan warga; sekaligus membangun arsip pengetahuan lokal yang bertahan lebih lama daripada umur sebuah posting sosial media.

### 1.2 Misi
| # | Misi | Implikasi untuk produk web |
|---|------|----------------------------|
| 1 | Membantu warga | Utility Hub, panduan langkah, kontak darurat click-to-call |
| 2 | Menjelaskan konteks | Template artikel Understand: data, timeline, sumber dokumen |
| 3 | Mendokumentasikan Tasikmalaya | Arsip artikel, kategori, tag, related stories |
| 4 | Membuka ruang partisipasi (Baraya) | Koreksi terbuka, akun pembaca, simpanan personal |
| 5 | Membangun media berkelanjutan | Pemisahan editorial vs komersial, label sponsor, audit log |

### 1.3 Prinsip Distribusi vs Pengetahuan

> **Social-first for distribution. Web-first for knowledge.**

- Sosial media (Instagram, TikTok, Facebook) membuat orang **menemukan** Palihmana.
- Website menyimpan **Master Story**: versi informasi paling lengkap. Konten sosial adalah turunan yang disesuaikan per platform.
- Alur ideal: `Riset → Master Story Website → Carousel / TikTok / Reels / Story → internal linking → update bila fakta berubah`.
- Implikasi produk: setiap artikel harus **mudah dibagikan** (Open Graph yang rapi untuk WhatsApp/sosial), **mudah ditemukan** (SEO, search internal), dan **mudah diperbarui** (freshness badge, correction note).

### 1.4 North Star
> *"Palihmana bukan sekadar tempat berita hari ini lewat. Palihmana harus menjadi tempat informasi Tasikmalaya ditemukan, dipahami, digunakan, dan tetap bisa dirujuk besok."*

Setiap fitur diuji dengan pertanyaan: **apakah ini menambah kegunaan, kepercayaan, pemahaman, atau daya tahan pengetahuan?** Jika hanya menambah keramaian, ia bukan prioritas.

### 1.5 Audiens
- **Baraya** (warga Tasikmalaya): pengguna utama, dominan mobile, sering datang dari link TikTok/Instagram/WhatsApp.
- **Pencari informasi layanan**: butuh nomor, syarat, langkah, lokasi dengan cepat.
- **Kontributor & editor**: pengguna internal; non-teknis, perlu alur kerja sederhana.
- **Mitra komersial**: pengguna masa depan (listing/sponsor), wajib dipisah dari editorial.

### 1.6 Pilar Editorial (dipakai sebagai taksonomi produk)

| Pilar | Baseline 30 hari | Fungsi | Label di UI |
|-------|------------------|--------|-------------|
| `UTILITY` | 40% | Panduan warga, layanan, pekerjaan, kesehatan, transportasi, dokumen, darurat, UMKM | Utility |
| `UNDERSTAND` | 20% | Menjelaskan isu, data, sejarah, kebijakan, ekonomi | Understand |
| `OPINION` | 10% | Posisi editorial berbasis fakta | Opini |
| `DISCOVER` | 15% | Tempat, agenda, budaya, penemuan lokal | Discover |
| `PEOPLE` | 10% | Manusia, profesi, tokoh, komunitas | People |
| `FIELD_NOTES` | 5% | Catatan lapangan, observasi | Catatan Lapangan |

Persentase adalah panduan rolling 30 hari, **bukan kuota**. Sistem tidak boleh memaksa pemenuhan angka; dashboard hanya menampilkan komposisi sebagai informasi.

### 1.7 Kebijakan Geografis (metadata artikel)
Artikel diberi `geo_scope`: `LOCAL` (Tasikmalaya, panduan 65–80%), `REGIONAL` (Jawa Barat, 8–18%), `NATIONAL` (10–20%). Dipakai untuk analitik komposisi, bukan untuk membatasi publikasi.

---

## 2. Prinsip Produk & Batasan

1. **Mobile-first, cepat.** Mayoritas pembaca datang dari tautan sosial di ponsel.
2. **Bukan portal berita yang sesak.** Tanpa banner iklan pada fase awal; prioritas produk, trafik, SEO, arsip, dan kebiasaan pembaca.
3. **Transparansi verifikasi.** Tanggal diperbarui, status verifikasi, dan catatan koreksi tampil jelas, bukan disembunyikan.
4. **Editorial ≠ komersial.** Konten sponsor selalu berlabel. Role `COMMERCIAL` tidak bisa menyentuh artikel editorial.
5. **Jangan over-engineering.** Fitur dibangun sesuai fase; fitur yang belum terbukti dibutuhkan ditunda.
6. **Dapat dirawat tim kecil.** Dokumentasi teknis, backup, dan audit log bukan opsional.

### Non-Goals (Fase 1–4)
- Tidak ada sistem komentar publik.
- Tidak ada display advertising / banner.
- Tidak ada aplikasi native.
- Tidak ada rekomendasi berbasis machine learning.
- Tidak ada pembayaran / e-commerce.
- Tidak ada multi-bahasa (konten berbahasa Indonesia).

---

## 3. Breakdown Fitur Berdasarkan Phased Roadmap

Ringkasan roadmap (sesuai flow diagram):

| Fase | Modul | Sub-fitur (dari diagram) |
|------|-------|--------------------------|
| **1** | Beranda Palihmana | Sorotan Utama, Kabar Terbaru, Tab Kategori |
| **1** | Baca Artikel | Halaman Baca Nyaman, Mode Terang & Gelap, Bagikan Artikel |
| **1** | Cari Cepat | Kotak Pencarian Instan, Hasil Terkelompok, Saran Kata Kunci |
| **2** | Kategori Jelajah | Understand, Discover, People |
| **2** | Kalender Acara | Daftar Acara, Tampilan Kalender, Detail Acara |
| **2** | Info Layanan Warga | Daftar Layanan, Panduan & Syarat, Kontak Darurat |
| **3** | Simpan & Favorit | Simpan Artikel, Kategori Favorit, Daftar Simpanan |
| **4** | Masuk & Akun | Daftar Akun, Masuk & Keluar, Lupa Kata Sandi |
| **4** | Editorial & CMS Backoffice | RBAC, Status Workflow, Fact-Check & Verification Logger |

> **Catatan keputusan terbuka (lihat §7, OQ-1):** Handbook menargetkan soft launch November 2026 dengan kontributor non-teknis yang butuh CMS. Backoffice penuh berada di Fase 4 pada roadmap, sehingga Fase 1 memerlukan **editor minimal** (lihat F1-ADM). Ini rekomendasi, bukan perubahan roadmap.

---

### 3.1 FASE 1 — Core Web (MVP Critical)

#### F1-HOME · Beranda Palihmana
**Tujuan:** menampilkan informasi terbaru, penting, dan evergreen tanpa terasa seperti portal berita yang sesak.

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| F1-HOME-01 | **Hero Section / Sorotan Utama**: 1 artikel unggulan besar + 2–3 artikel sorotan sekunder, dipilih manual oleh Editor (flag `is_featured`). | Must |
| F1-HOME-02 | **Fresh News Grid / Kabar Terbaru**: grid kartu artikel berurutan `published_at DESC`, pagination "Muat lebih banyak" (cursor-based). | Must |
| F1-HOME-03 | **Tab Pilar / Tab Kategori**: tab Semua, Utility, Understand, Opini, Discover, People, Catatan Lapangan; filter tanpa reload penuh, URL tetap dapat dibagikan (`/?pilar=utility`). | Must |
| F1-HOME-04 | Akses cepat ke Cari dan (setelah Fase 2) ke Layanan & Acara. | Should |
| F1-HOME-05 | Maksimal 1 bagian per kebutuhan; tidak ada widget dekoratif, tidak ada slot iklan. | Must |

**Acceptance criteria**
- Halaman beranda memuat konten utama (hero + 6 kartu pertama) tanpa JavaScript tambahan untuk render awal (server-rendered).
- Berpindah tab pilar tidak menghilangkan posisi scroll header dan dapat dibuka langsung via URL.
- Skor Lighthouse mobile ≥ 90 (Performance, Accessibility, Best Practices, SEO).

#### F1-READ · Baca Artikel
**Tujuan:** rumah Master Story; nyaman dibaca di ponsel dan transparan soal kesegaran serta koreksi.

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| F1-READ-01 | **Reader-friendly layout**: lebar baca ±65–70 karakter, tipografi serif untuk judul, ukuran teks body ≥ 17px mobile, jarak baris longgar, tanpa tembok teks. | Must |
| F1-READ-02 | **Komponen artikel terstruktur**: subjudul, summary box (poin ringkas), tabel, daftar langkah, FAQ, peta/link Maps, kutipan, gambar dengan kredit & alt text. | Must |
| F1-READ-03 | **Dark/Light Mode**: ikuti `prefers-color-scheme`, dapat diganti manual, pilihan disimpan lokal. Tanpa flash tema saat load. | Must |
| F1-READ-04 | **Social Share**: tombol WhatsApp, Facebook, X, Salin Tautan; Web Share API di mobile. Open Graph/Twitter Card dinamis per artikel. | Must |
| F1-READ-05 | **Freshness Badge**: menampilkan tanggal terbit dan "Diperbarui {tanggal}"; artikel Utility menampilkan tanggal pengecekan terakhir. | Must |
| F1-READ-06 | **Correction Note Box**: jika artikel punya koreksi, tampil kotak catatan koreksi (isi + tanggal) di atas badan artikel, bukan dihapus diam-diam. | Must |
| F1-READ-07 | **Related Stories**: 3 artikel terkait (pilar/tag sama) di akhir artikel. | Should |
| F1-READ-08 | Penanda pilar, geo scope, penulis, dan (opsional) label **Konten Sponsor** bila berlaku. | Must |
| F1-READ-09 | Breadcrumb dan tag yang dapat diklik. | Should |

**Acceptance criteria**
- Artikel tampil benar untuk format brief (150–300 kata) maupun long-form (data, timeline, tabel).
- Correction note muncul hanya bila ada data di tabel `corrections`.
- Bagikan ke WhatsApp menghasilkan preview: judul, deskripsi, gambar 1200×630.
- Tidak ada layout shift saat gambar dan font dimuat (CLS ≤ 0.1).

#### F1-SEARCH · Cari Cepat
**Tujuan:** membantu warga menemukan jawaban lama tanpa menggali timeline sosial.

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| F1-SEARCH-01 | **Instant Search Bar**: ikon cari di header, buka overlay/halaman `/cari`; hasil muncul saat mengetik (debounce 250 ms). | Must |
| F1-SEARCH-02 | **Grouped Results**: hasil dikelompokkan *Artikel* vs *Utility* (Fase 2+: ditambah *Acara*). Pada Fase 1 kelompok Utility berisi artikel pilar Utility. | Must |
| F1-SEARCH-03 | **Keyword Auto-suggest**: saran kata kunci populer/terkait (berbasis judul, tag, dan kueri populer). | Should |
| F1-SEARCH-04 | Toleransi typo ringan (trigram) dan pencarian berbahasa Indonesia sehari-hari ("bikin ktp", "nomor ugd"). | Should |
| F1-SEARCH-05 | Halaman hasil tanpa jawaban menampilkan saran pencarian dan tautan ke kategori. | Must |
| F1-SEARCH-06 | Pencatatan kueri tanpa data pribadi untuk analitik (kueri tanpa hasil = sinyal konten yang perlu dibuat). | Should |

**Acceptance criteria**
- Respons pencarian p95 < 400 ms pada data awal ≤ 5.000 artikel.
- Hanya artikel berstatus `PUBLISHED` yang dapat muncul.

#### F1-ADM · Editor Minimal (Rekomendasi, jembatan menuju Fase 4)
Agar kontributor dapat menerbitkan sejak soft launch, Fase 1 menyertakan **admin minimal** yang dilindungi login staf:
- Buat/ubah artikel (editor rich-text → `body_json`), unggah gambar dengan kredit & alt text.
- Ubah status `DRAFT → PUBLISHED` oleh Editor/Super Admin (alur lengkap difase 4).
- Tambah catatan koreksi.
- Akun staf dibuat manual oleh Super Admin (tanpa pendaftaran publik).

#### F1 Fondasi Non-Fungsional
SEO teknis (metadata, sitemap, canonical, clean permalink `/{pilar}/{slug}`), analytics + Search Console, SSL, backup otomatis, halaman 404 yang membantu, dan halaman statis: Tentang, Kebijakan Editorial, Kebijakan Koreksi, Kebijakan Privasi, Kontak.

---

### 3.2 FASE 2 — Discovery & Knowledge Expansion

#### F2-CAT · Kategori Jelajah
**Tujuan:** menjelajah arsip berdasarkan pilar tanpa harus mencari.

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| F2-CAT-01 | Halaman pilar khusus: **Understand**, **Discover**, **People** (`/understand`, `/discover`, `/people`) dengan deskripsi pilar dan artikel terbaru. | Must |
| F2-CAT-02 | Halaman Utility, Opini, dan Catatan Lapangan menggunakan template serupa. | Should |
| F2-CAT-03 | Filter sub-tag dan pengurutan (Terbaru / Diperbarui). | Should |
| F2-CAT-04 | Halaman tag untuk knowledge graph editorial (`/tag/{slug}`). | Should |
| F2-CAT-05 | Template khusus: People menonjolkan foto/kutipan; Discover menonjolkan lokasi; Understand menonjolkan ringkasan data. | Could |

#### F2-EVT · Kalender Acara (Event Tasik)
**Tujuan:** agenda terverifikasi: tanggal, lokasi, akses, tiket/pendaftaran, penyelenggara, status.

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| F2-EVT-01 | **List View**: acara mendatang dikelompokkan per tanggal; acara lewat tidak tampil kecuali di arsip. | Must |
| F2-EVT-02 | **Calendar View**: tampilan bulanan, penanda hari berisi acara, tap hari → daftar acara. Di mobile default ke List View. | Must |
| F2-EVT-03 | **Filter Gratis/Berbayar** (`price_type`), serta filter rentang tanggal. | Must |
| F2-EVT-04 | **Status Verifikasi**: badge *Terverifikasi* (dengan tanggal verifikasi) atau *Belum diverifikasi*. | Must |
| F2-EVT-05 | **Detail Acara**: judul, deskripsi, tanggal/jam, lokasi + link Google Maps, penyelenggara, harga, link pendaftaran, tombol "Tambah ke kalender" (.ics). | Must |
| F2-EVT-06 | Structured data `Event` (Schema.org) dan halaman detail dapat dibagikan. | Must |
| F2-EVT-07 | Tautan acara ke artikel Discover terkait. | Could |

#### F2-UTL · Info Layanan Warga (Utility Hub)
**Tujuan:** nomor darurat, UGD/IGD, layanan publik, dokumen, pekerjaan, transportasi, UMKM.

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| F2-UTL-01 | **Direktori Layanan** dengan kategori `EMERGENCY`, `TRANSPORT`, `DOCUMENT`, `HEALTH`, `UMKM`; filter dan pencarian di dalam hub. | Must |
| F2-UTL-02 | **Panduan & Syarat Prosedural**: langkah bernomor, persyaratan (checklist), biaya, lama proses, FAQ, tanggal pengecekan terakhir. Terhubung ke artikel Utility terkait. | Must |
| F2-UTL-03 | **Kontak Darurat Click-to-Call**: tombol `tel:` besar, selalu terlihat di bagian atas hub, dapat dipakai tanpa menggulir. | Must |
| F2-UTL-04 | Tombol "Buka di Maps" untuk setiap layanan berlokasi. | Must |
| F2-UTL-05 | Penanda layanan nonaktif (`is_active=false`) disembunyikan dari publik tetapi tetap tersimpan. | Must |
| F2-UTL-06 | Structured data `LocalBusiness`/`GovernmentService` dan `FAQPage` bila relevan. | Should |

**Acceptance criteria F2-UTL-03:** nomor darurat dapat ditekan satu kali dari beranda (setelah Fase 2) dan dari halaman hub; ukuran target sentuh ≥ 48 px.

---

### 3.3 FASE 3 — User Retention

#### F3-SAVE · Simpan & Favorit
| ID | Requirement | Prioritas |
|----|-------------|-----------|
| F3-SAVE-01 | **Simpan Artikel**: tombol bookmark di kartu dan halaman artikel. Pembaca tanpa akun menyimpan ke **penyimpanan lokal (localStorage)**; tidak ada data pribadi dikirim ke server. | Must |
| F3-SAVE-02 | **Kategori Favorit**: pembaca menandai pilar favorit; beranda menampilkan pilar tersebut lebih dulu (tanpa menyembunyikan lainnya). | Should |
| F3-SAVE-03 | **Halaman "Simpanan Saya"** (`/simpanan`): daftar artikel tersimpan, dikelompokkan per pilar, dapat dihapus. | Must |
| F3-SAVE-04 | Indikator jika artikel tersimpan telah diperbarui sejak disimpan. | Could |
| F3-SAVE-05 | **Sinkronisasi ke akun** saat Fase 4 aktif: data lokal digabung ke tabel `bookmarks` setelah login. | Must (Fase 4) |

---

### 3.4 FASE 4 — Member System & Backoffice

#### F4-AUTH · Masuk & Akun
| ID | Requirement | Prioritas |
|----|-------------|-----------|
| F4-AUTH-01 | **Daftar Akun**: email + kata sandi (min. 10 karakter); verifikasi email. | Must |
| F4-AUTH-02 | **Masuk & Keluar**: sesi aman (cookie HttpOnly), batas percobaan masuk (rate limit). | Must |
| F4-AUTH-03 | **Lupa Kata Sandi**: tautan reset satu kali pakai berbatas waktu (±30 menit). | Must |
| F4-AUTH-04 | Profil sederhana: nama, avatar, hapus akun. | Should |
| F4-AUTH-05 | Penggabungan simpanan lokal ke akun (lihat F3-SAVE-05). | Must |
| F4-AUTH-06 | Opsional: masuk dengan Google. | Could |

#### F4-CMS · Editorial & CMS Backoffice

**RBAC (hak akses minimal / least privilege)**

| Kemampuan | SUPER_ADMIN | EDITOR | CONTRIBUTOR | COMMERCIAL | MEMBER |
|-----------|:-----------:|:------:|:-----------:|:----------:|:------:|
| Kelola pengguna & role | ✅ | ❌ | ❌ | ❌ | ❌ |
| Buat/ubah artikel sendiri | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ubah artikel orang lain | ✅ | ✅ | ❌ | ❌ | ❌ |
| Kirim ke FACT_CHECK | ✅ | ✅ | ✅ | ❌ | ❌ |
| Catat hasil fact-check | ✅ | ✅ | ❌ | ❌ | ❌ |
| Publish / jadwalkan / arsipkan | ✅ | ✅ | ❌ | ❌ | ❌ |
| Tambah koreksi | ✅ | ✅ | ❌ | ❌ | ❌ |
| Kelola Utility & Event | ✅ | ✅ | ✅ (usul, perlu approve) | ❌ | ❌ |
| Kelola konten sponsor/listing komersial | ✅ | ❌ | ❌ | ✅ | ❌ |
| Lihat audit log | ✅ | ✅ (baca) | ❌ | ❌ | ❌ |
| Bookmark & favorit tersinkron | ✅ | ✅ | ✅ | ✅ | ✅ |

> `MEMBER` adalah tambahan di luar empat role yang diminta, agar pembaca terdaftar punya role tanpa hak backoffice (lihat DATABASE.md).

**Article Status Workflow**

```
DRAFT ──► PRODUCTION ──► FACT_CHECK ──► (SCHEDULED) ──► PUBLISHED ──► ARCHIVED
  ▲            │              │                              │
  └────────────┴── (ditolak / perlu revisi) ◄────────────────┘ (update substantif → kembali ke PRODUCTION/FACT_CHECK)
```

Pemetaan terhadap handbook: `READY` = `DRAFT` yang siap diproduksi; `MONITORING` diwakili flag `is_monitoring` pada artikel `PUBLISHED`; artikel terbit tidak memenuhi active queue kecuali ada perkembangan baru yang substantif.

| ID | Requirement | Prioritas |
|----|-------------|-----------|
| F4-CMS-01 | Status workflow dengan validasi transisi (Contributor tidak dapat memindahkan ke `PUBLISHED`). | Must |
| F4-CMS-02 | **Fact-Check & Verification Logger**: per artikel catat klaim, sumber primer, sumber sekunder, tanggal verifikasi, butir belum terverifikasi, tingkat risiko (`LOW`/`MEDIUM`/`HIGH`), pemeriksa. Artikel tidak dapat `PUBLISHED` tanpa fact-check berstatus *Ready for Newsroom* (pengecualian: Super Admin dengan alasan tercatat). | Must |
| F4-CMS-03 | **Comparability check** untuk artikel data lintas tahun: `AMAN DIBANDINGKAN` / `PERLU CATATAN` / `JANGAN DIBANDINGKAN LANGSUNG`. | Should |
| F4-CMS-04 | **Koreksi & update**: tambah catatan koreksi, perbarui `updated_at`/freshness tanpa menghapus jejak. | Must |
| F4-CMS-05 | **Audit log** untuk setiap aksi penting (login staf, ubah status, publish, ubah role, hapus). | Must |
| F4-CMS-06 | Penjadwalan publish (`SCHEDULED`) dan pengarsipan. | Should |
| F4-CMS-07 | Media library: kredit, alt text, hak penggunaan, aturan nama file. | Should |
| F4-CMS-08 | Dashboard performa ringkas: komposisi pilar & geo 30 hari, halaman yang perlu diperbarui (freshness), kueri tanpa hasil. | Could |
| F4-CMS-09 | Label **Konten Sponsor** wajib pada konten komersial; tidak dapat dinonaktifkan. | Must |

---

## 4. Kebutuhan Non-Fungsional

| Area | Requirement |
|------|-------------|
| Performa | LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 pada ponsel kelas menengah, jaringan 4G |
| Kompatibilitas | 2 versi mayor terakhir Chrome, Safari, Firefox, Samsung Internet; Android Go didukung |
| Aksesibilitas | WCAG 2.2 AA: kontras, fokus keyboard, label form, `prefers-reduced-motion` |
| Keamanan | HTTPS, hash kata sandi (argon2id/bcrypt), rate limit, proteksi CSRF, sanitasi konten, header keamanan, prinsip least privilege |
| Privasi | Data minimum; bookmark anonim tetap lokal; kebijakan privasi sesuai UU PDP |
| Ketersediaan | Backup otomatis harian, prosedur restore terdokumentasi |
| SEO | Sitemap, canonical, schema markup, permalink bersih, news sitemap |
| Observabilitas | Analytics, Search Console, error tracking, uptime monitor |

---

## 5. Kriteria Sukses & KPI Produk

### 5.1 Kriteria Peluncuran (Gate)
| Gate | Syarat |
|------|--------|
| Fase 1 soft launch | Lighthouse mobile ≥ 90 di beranda, artikel, dan pencarian; ≥ 20 master article terkurasi; sitemap terkirim ke Search Console; backup & SSL aktif |
| Fase 2 | Kalender memuat acara terverifikasi; Utility Hub memuat ≥ 30 entri layanan inti dengan nomor darurat ter-uji |
| Fase 3 | Tombol simpan bekerja tanpa login; tidak ada regresi performa |
| Fase 4 | Pen-test dasar/checklist OWASP lulus; alur fact-check dipakai nyata oleh tim |

### 5.2 KPI Produk (sejalan dengan handbook §16)

| Kategori | Metrik | Target awal (diusulkan, tinjau setelah 90 hari) |
|----------|--------|-----------------------------------------------|
| Teknis | Lighthouse (Perf/A11y/BP/SEO) mobile | ≥ 90 semua |
| Teknis | Core Web Vitals "Good" | ≥ 75% kunjungan |
| SEO | Halaman terindeks dari sitemap | ≥ 90% |
| SEO | Organic search traffic | Tren naik bulan ke bulan |
| SEO | Kueri dengan impresi di Search Console | Dipantau, tanpa target absolut |
| Mobile | Porsi sesi mobile tanpa error layout | ≥ 99% |
| Audiens | Returning users | Tren naik; dipantau mingguan |
| Engagement | Klik internal / penggunaan related stories | ≥ 15% sesi artikel |
| Utility | Aksi utility: klik nomor, peta, pendaftaran, pencarian, kalender | Dipantau per jenis aksi |
| Konversi sosial → web | Kunjungan dari TikTok/IG/WA ke master story | Tren naik |
| Kepercayaan | Waktu median dari laporan koreksi ke koreksi tayang | ≤ 24 jam |
| Freshness | Halaman Utility yang diverifikasi dalam 90 hari terakhir | ≥ 80% |

**Prinsip evaluasi:** jangan menyamakan viral dengan sukses. Nilai kunjungan yang menghasilkan penyimpanan, pencarian brand, dan kembali berkunjung lebih tinggi dari lonjakan sekali lewat.

---

## 6. Timeline Indikatif (selaras Prioritas 90 Hari Handbook)

| Periode | Fokus produk |
|---------|--------------|
| Okt 2026 | Finalisasi arsitektur, domain & hosting, setup repo/CI, desain sistem, mulai Fase 1 |
| Nov 2026 | **Soft launch Fase 1** (Beranda, Baca, Cari + editor minimal); analytics & Search Console aktif; kurasi/migrasi artikel terbaik |
| Des 2026 | Evaluasi SEO & UX; mulai Fase 2 (Kategori, Kalender, Utility Hub) |
| 2027 | Fase 3 → Fase 4 sesuai bukti kebutuhan |

Timeline bersifat indikatif dan mengikuti prinsip handbook: jangan membangun terlalu banyak fitur sebelum kebutuhan terbukti.

---

## 7. Risiko, Asumsi, & Pertanyaan Terbuka

### Risiko
| Risiko | Mitigasi |
|--------|----------|
| Data Utility cepat usang (nomor, jam, syarat) | `last_verified_at` wajib, freshness badge, dashboard halaman perlu diperbarui |
| Kontributor non-teknis kesulitan memakai CMS | Editor sederhana, template per pilar, onboarding singkat |
| Over-engineering untuk tim kecil | Fase ketat, definisi MVP jelas, dokumentasi |
| Ketergantungan pada satu orang | Dokumentasi teknis (domain, DNS, hosting, backup), akses least privilege |
| Misinformasi akibat kesalahan data | Fact-check logger, correction note, tanggal verifikasi |
| Konten komersial mengaburkan editorial | Role `COMMERCIAL` terpisah, label sponsor wajib, audit log |
| Biaya hosting/DB tumbuh | Tier gratis/rendah di awal, ISR/caching agresif |

### Asumsi
- Mayoritas trafik berasal dari ponsel dan tautan sosial.
- Volume konten ≈ maksimal 2 artikel/hari (±60/bulan) → basis data kecil, cukup PostgreSQL tunggal.
- Konten berbahasa Indonesia.

### Pertanyaan Terbuka
| ID | Pertanyaan | Dampak |
|----|------------|--------|
| OQ-1 | Apakah editor minimal Fase 1 (F1-ADM) disetujui, atau kontributor memakai alat lain sementara? | Menentukan lingkup Fase 1 |
| OQ-2 | Hosting final (Vercel / VPS) dan penyedia DB (Supabase / Neon)? | Arsitektur & biaya |
| OQ-3 | Apakah pembaca perlu mendaftar (Fase 4) atau cukup simpanan lokal? | Prioritas Fase 4 |
| OQ-4 | Sumber data kalender: input manual editor, kiriman penyelenggara, atau keduanya? | Alur Event |
| OQ-5 | Migrasi artikel lama dari sosial: manual atau impor massal? | Kerja Fase 1 |
| OQ-6 | Layanan email transaksional (verifikasi, reset kata sandi) yang dipakai? | Fase 4 |

---

## 8. Lampiran: Peta Persyaratan ke Handbook

| Kebutuhan handbook | Fitur |
|--------------------|-------|
| Homepage mobile-first, tidak sesak | F1-HOME |
| Artikel / Master Story | F1-READ |
| Search | F1-SEARCH |
| Kalender Event Tasik | F2-EVT |
| Utility Hub | F2-UTL |
| Kategori & tag, related stories | F2-CAT, F1-READ-07 |
| Correction note & timestamp | F1-READ-05/06, F4-CMS-04 |
| Role/permission & audit perubahan | F4-CMS RBAC, F4-CMS-05 |
| Status kerja & standar verifikasi | F4-CMS-01/02/03 |
| Label sponsor, pemisahan editorial–komersial | F4-CMS-09 |
| SEO teknis, schema, analytics, backup | §4, ARCHITECTURE.md |
