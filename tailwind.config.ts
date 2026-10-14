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
        serif: ["var(--font-newsreader)", "Merriweather", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      maxWidth: {
        read: "40.625rem", // 650px
        page: "75rem",    // 1200px
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
