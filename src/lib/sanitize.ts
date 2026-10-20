/**
 * ─────────────────────────────────────────────────────────────
 * Palihmana.ID — Cyber Security & Input Sanitization Utilities
 * ─────────────────────────────────────────────────────────────
 * Melindungi dari HTML Injection, Cross-Site Scripting (XSS),
 * Malicious URL schemes (javascript:, data:), dan parameter tampering.
 */

// Protokol URL yang diizinkan untuk navigasi publik dan pranala
const ALLOWED_PROTOCOLS = new Set(["http:", "https:", "mailto:", "tel:"]);

/**
 * Memastikan URL hanya menggunakan protokol aman.
 * Mencegah eksploitasi berbasis `javascript:`, `data:`, `vbscript:`, atau `file:`.
 */
export function sanitizeUrl(url?: string | null): string {
  if (!url || typeof url !== "string") return "#";

  const trimmed = url.trim();

  // Izinkan path internal (relatif) seperti '/layanan' atau '/utility'
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    return trimmed;
  }

  // Izinkan hash anchor internal seperti '#section'
  if (trimmed.startsWith("#")) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (ALLOWED_PROTOCOLS.has(parsed.protocol.toLowerCase())) {
      return trimmed;
    }
  } catch {
    // Jika bukan URL absolut yang valid dan tidak berawalan safe relative path, blokir
    return "#";
  }

  return "#";
}

/**
 * Validasi apakah URL aman untuk dibuka.
 */
export function isSafeUrl(url?: string | null): boolean {
  if (!url) return false;
  return sanitizeUrl(url) !== "#";
}

/**
 * Mengubah karakter khusus HTML menjadi HTML entity
 * Mencegah eksekusi tag saat teks biasa dirender.
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Membersihkan string teks dari tag HTML berbahaya atau percobaan injeksi kode.
 * Menghilangkan tag <script>, <style>, <iframe>, <object>, <embed>, dan event handler seperti onload, onerror.
 */
export function sanitizeText(str?: string | null, maxLength = 10000): string {
  if (!str || typeof str !== "string") return "";

  let cleaned = str.slice(0, maxLength);

  // Hapus tag script, style, iframe, link, dll
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
  cleaned = cleaned.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
  cleaned = cleaned.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "");
  cleaned = cleaned.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "");

  // Hapus inline event handlers (on*="...")
  cleaned = cleaned.replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, "");
  cleaned = cleaned.replace(/\bon\w+\s*=\s*[^\s>]+/gi, "");

  // Hapus protokol berbahaya dalam atribut
  cleaned = cleaned.replace(/href\s*=\s*["']?\s*javascript:[^"'>]*/gi, 'href="#"');
  cleaned = cleaned.replace(/src\s*=\s*["']?\s*javascript:[^"'>]*/gi, 'src=""');

  return cleaned.trim();
}

/**
 * Sanitasi mendalam untuk struktur TipTap JSON.
 * Memastikan semua atribut href aman, alt text terbersih, dan teks tidak mengandung exploit.
 */
export function sanitizeTipTapDoc(doc: any): any {
  if (!doc || typeof doc !== "object") return null;

  function cleanNode(node: any): any {
    if (!node || typeof node !== "object") return node;

    const newNode: any = { type: String(node.type || "") };

    if (node.text && typeof node.text === "string") {
      newNode.text = node.text; // React JSX escapes text safely by default
    }

    if (node.attrs && typeof node.attrs === "object") {
      newNode.attrs = { ...node.attrs };

      // Validasi href pada link mark atau node
      if (newNode.attrs.href) {
        newNode.attrs.href = sanitizeUrl(newNode.attrs.href);
      }
      // Validasi src pada image node
      if (newNode.attrs.src) {
        newNode.attrs.src = sanitizeUrl(newNode.attrs.src);
      }
      // Bersihkan teks alt dan title
      if (newNode.attrs.alt) {
        newNode.attrs.alt = sanitizeText(newNode.attrs.alt, 255);
      }
      if (newNode.attrs.title) {
        newNode.attrs.title = sanitizeText(newNode.attrs.title, 255);
      }
    }

    // Bersihkan marks (misalnya link mark)
    if (Array.isArray(node.marks)) {
      newNode.marks = node.marks.map((mark: any) => {
        const cleanMark = { ...mark };
        if (cleanMark.attrs?.href) {
          cleanMark.attrs = {
            ...cleanMark.attrs,
            href: sanitizeUrl(cleanMark.attrs.href),
          };
        }
        return cleanMark;
      });
    }

    // Rekursif untuk konten bersarang
    if (Array.isArray(node.content)) {
      newNode.content = node.content.map(cleanNode);
    }

    return newNode;
  }

  return cleanNode(doc);
}
