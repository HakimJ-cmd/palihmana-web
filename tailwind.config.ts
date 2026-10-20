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
          container: "#dc2626",
          fixed: "#ffdad6",
          "fixed-dim": "#ffb4ab",
        },
        "inverse-surface": "#213145",
        "inverse-on-surface": "#eaf1ff",
        "surface-bright": "#f8f9ff",
        "surface-container": "#e5eeff",
        "surface-container-low": "#eff4ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",
        "on-surface": "#0b1c30",
        "on-surface-variant": "#5c403c",
        "secondary-fixed": "#dae2fd",
        "secondary-fixed-dim": "#bec6e0",
        "outline-variant": "#e6bdb8",
        tertiary: {
          DEFAULT: "#b50436",
          container: "#d82b4c",
          fixed: "#ffdadb",
          "fixed-dim": "#ffb2b7",
        },
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
        danger: "var(--color-danger)",
        success: "var(--color-success)",
      },
      fontFamily: {
        serif: ["var(--font-newsreader)", "Newsreader", "Merriweather", "Georgia", "serif"],
        sans: ["var(--font-worksans)", "var(--font-inter)", "Work Sans", "Plus Jakarta Sans", "system-ui", "sans-serif"],
        headline: ["var(--font-newsreader)", "Newsreader", "serif"],
        display: ["var(--font-newsreader)", "Newsreader", "serif"],
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
        "display": ["44px", { lineHeight: "1.15", fontWeight: "700" }],
        "h1": ["40px", { lineHeight: "1.2", fontWeight: "700" }],
        "h2": ["28px", { lineHeight: "1.25", fontWeight: "600" }],
        "h3": ["22px", { lineHeight: "1.3", fontWeight: "600" }],
        "body-read": ["19px", { lineHeight: "1.7", fontWeight: "400" }],
        "meta": ["13px", { lineHeight: "1.4", fontWeight: "400" }],
        "badge": ["12px", { lineHeight: "1.2", fontWeight: "600", letterSpacing: "0.04em" }],
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
