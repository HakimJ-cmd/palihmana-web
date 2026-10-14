import React from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface text-ink transition-colors">
      <div className="mx-auto max-w-page px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-12">
          {/* Brand Info & Motto */}
          <div className="md:col-span-6">
            <Link
              href="/"
              className="inline-block font-serif text-2xl font-bold tracking-tight text-primary hover:text-primary-hover"
            >
              PALIHMANA<span className="text-sm font-semibold uppercase tracking-wider text-ink-muted">.ID</span>
            </Link>
            <p className="mt-2 max-w-md text-sm text-ink-muted">
              {SITE_CONFIG.description}
            </p>
            <blockquote className="mt-4 border-l-2 border-primary pl-3 text-xs italic text-ink-muted">
              &ldquo;Social membuat orang menemukan kami. Web membuat pengetahuan bertahan.&rdquo;
            </blockquote>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-6 md:grid-cols-3">
            <div>
              <h4 className="font-serif text-sm font-semibold text-ink">Pilar Konten</h4>
              <ul className="mt-3 space-y-2 text-xs">
                <li>
                  <Link href="/utility" className="text-ink-muted hover:text-primary">
                    Utility & Panduan
                  </Link>
                </li>
                <li>
                  <Link href="/understand" className="text-ink-muted hover:text-primary">
                    Understand & Konteks
                  </Link>
                </li>
                <li>
                  <Link href="/opini" className="text-ink-muted hover:text-primary">
                    Opini Warga
                  </Link>
                </li>
                <li>
                  <Link href="/discover" className="text-ink-muted hover:text-primary">
                    Discover Tasik
                  </Link>
                </li>
                <li>
                  <Link href="/people" className="text-ink-muted hover:text-primary">
                    People & Tokoh
                  </Link>
                </li>
                <li>
                  <Link href="/catatan-lapangan" className="text-ink-muted hover:text-primary">
                    Catatan Lapangan
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-sm font-semibold text-ink">Standar & Redaksi</h4>
              <ul className="mt-3 space-y-2 text-xs">
                <li>
                  <Link href="/tentang" className="text-ink-muted hover:text-primary">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="/pedoman-editorial" className="text-ink-muted hover:text-primary">
                    Pedoman Editorial
                  </Link>
                </li>
                <li>
                  <Link href="/kebijakan-koreksi" className="text-ink-muted hover:text-primary">
                    Kebijakan Koreksi
                  </Link>
                </li>
                <li>
                  <Link href="/privasi" className="text-ink-muted hover:text-primary">
                    Kebijakan Privasi
                  </Link>
                </li>
                <li>
                  <Link href="/kontak" className="text-ink-muted hover:text-primary">
                    Hubungi Redaksi
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-serif text-sm font-semibold text-ink">Kanal Sosial</h4>
              <ul className="mt-3 space-y-2 text-xs">
                <li>
                  <a
                    href={SITE_CONFIG.socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-muted hover:text-primary"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href={SITE_CONFIG.socials.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-muted hover:text-primary"
                  >
                    TikTok
                  </a>
                </li>
                <li>
                  <a
                    href={SITE_CONFIG.socials.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-muted hover:text-primary"
                  >
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-line pt-6 text-xs text-ink-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Palihmana.id. Hak cipta dilindungi undang-undang.</p>
          <p className="mt-2 sm:mt-0">
            Dibuat untuk Tasikmalaya · Bersih, Terpercaya, Berguna.
          </p>
        </div>
      </div>
    </footer>
  );
}
