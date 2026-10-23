import type { Config } from "tailwindcss";

export default {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          tint: "var(--color-primary-tint)",
          container: "var(--color-primary-container)",
        },
        // Brand Green-Teal surface tokens
        "inverse-surface": "#0C2326",
        "inverse-on-surface": "#E6F4F1",
        "surface-bright": "#F4F9F8",
        "surface-container": "#E6F2EF",
        "surface-container-low": "#F0F7F5",
        "surface-container-lowest": "#FFFFFF",
        "surface-container-high": "#D8ECE7",
        "surface-container-highest": "#C9E5DE",
        "on-surface": "#071D20",
        "on-surface-variant": "#3F5654",
        "secondary-fixed": "#D1EBE5",
        "secondary-fixed-dim": "#B2DDD4",
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        ink: {
          DEFAULT: "var(--color-text)",
          muted: "var(--color-text-muted)",
        },
        line: "var(--color-border)",
        accent: {
          DEFAULT: "var(--color-accent)",
          tint: "var(--color-accent-tint)",
          ink: "var(--color-accent-ink)",
        },
        // Red is strictly for emergency, warnings, or breaking alerts
        danger: "var(--color-danger)",
        success: "var(--color-success)",
      },
      fontFamily: {
        // Sans-first for clarity, strong headlines, and legible numbers/data
        sans: ["var(--font-worksans)", "var(--font-inter)", "Work Sans", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        headline: ["var(--font-worksans)", "var(--font-inter)", "Work Sans", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        display: ["var(--font-worksans)", "var(--font-inter)", "Work Sans", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        // Serif reserved strictly for Opini / Editorial quotes
        serif: ["var(--font-newsreader)", "Newsreader", "Merriweather", "Georgia", "serif"],
      },
      maxWidth: {
        read: "45rem",   // 720px for optimal longform reading
        page: "80rem",   // 1280px (max-w-7xl)
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        lg: "10px",
      },
      fontSize: {
        "display": ["44px", { lineHeight: "1.15", fontWeight: "700", letterSpacing: "-0.02em" }],
        "h1": ["36px", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "-0.02em" }],
        "h2": ["26px", { lineHeight: "1.25", fontWeight: "600", letterSpacing: "-0.015em" }],
        "h3": ["21px", { lineHeight: "1.3", fontWeight: "600", letterSpacing: "-0.01em" }],
        "body-read": ["18px", { lineHeight: "1.75", fontWeight: "400" }],
        "meta": ["13px", { lineHeight: "1.4", fontWeight: "400" }],
        "badge": ["11px", { lineHeight: "1.2", fontWeight: "700", letterSpacing: "0.04em" }],
      },
      transitionDuration: {
        DEFAULT: "150ms",
        fast: "120ms",
        normal: "200ms",
      },
    },
  },
  plugins: [],
} satisfies Config;
