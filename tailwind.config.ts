import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#3fa24f",
          50: "#eefbf1",
          100: "#d7f4dd",
          200: "#b0e8bd",
          300: "#7fd695",
          400: "#4fbd69",
          500: "#3fa24f", // primary brand green (matches smilingpets.in theme colour)
          600: "#328641",
          700: "#296b35",
          800: "#23552c",
          900: "#1d4625",
          950: "#0d2712",
        },
        accent: {
          DEFAULT: "#ff9a3c", // warm friendly accent for sale badges / CTAs
          50: "#fff4e9",
          100: "#ffe3c7",
          200: "#ffc78a",
          300: "#ffab4d",
          400: "#ff9a3c",
          500: "#f57c1f",
          600: "#d9640f",
        },
        ink: {
          DEFAULT: "#1c2b20",
          light: "#5b6b5f",
        },
        surface: {
          DEFAULT: "#ffffff",
          muted: "#f6faf6",
          border: "#e5ede6",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-poppins)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        card: "0 2px 10px 0 rgb(28 43 32 / 0.06)",
        "card-hover": "0 6px 20px 0 rgb(28 43 32 / 0.12)",
        nav: "0 -2px 12px 0 rgb(28 43 32 / 0.08)",
      },
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-468px 0" },
          "100%": { backgroundPosition: "468px 0" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.25s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        shimmer: "shimmer 1.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
