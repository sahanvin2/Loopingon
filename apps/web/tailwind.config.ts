import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "src/providers/**/*.{js,ts,jsx,tsx}",
    "src/stores/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#FAFAFA",
          100: "#F4F4F5",
          200: "#E4E4E7",
          300: "#D4D4D8",
          400: "#A1A1AA",
          500: "#71717A",
          600: "#52525B",
          700: "#3F3F46",
          800: "#27272A",
          900: "#18181B", // Primary Black
          950: "#09090B",
        },
        accent: {
          50: "#FFFFFF",
          100: "#FAFAFA",
          200: "#F5F5F5",
          300: "#E5E5E5",
          400: "#D4D4D4",
          500: "#A3A3A3", // Silver
          600: "#737373",
          700: "#525252",
          800: "#404040",
          900: "#262626",
        },
        navy: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827", // Dark Slate
        },
        luxury: {
          bg: "#0A0A0A",
          gold: "#A3A3A3", // Replaced gold with silver
          light: "#FAFAFA",
        },
        main: "#FFFFFF",
        surface: {
          50: "#FFFFFF", // Background main
          100: "#FAFAFA", // Surface / bg-soft
          200: "#F4F4F5",
          300: "#E4E4E7", // Border
          400: "#D4D4D8",
          500: "#A1A1AA",
          600: "#71717A",
          700: "#52525B", // Body Text
          800: "#3F3F46",
          900: "#18181B", // Heading Text
        },
        text: {
          50: "#FFFFFF",
          100: "#FAFAFA",
          200: "#E4E4E7",
          300: "#D4D4D8",
          400: "#A1A1AA",
          500: "#71717A", // Muted Text
          600: "#52525B",
          700: "#3F3F46",
          800: "#27272A",
          900: "#18181B", // Black
        },
        muted: {
          100: "#FAFAFA",
          200: "#F4F4F5",
          300: "#E4E4E7",
          400: "#D4D4D8",
          500: "#A1A1AA",
          600: "#71717A",
          700: "#52525B",
          800: "#3F3F46",
          900: "#18181B",
        },
      },
      fontFamily: {
        serif: ["var(--font-lora)", "Lora", "Georgia", "serif"],
        sans: ["var(--font-outfit)", "Outfit", "system-ui", "sans-serif"],
        sinhala: ["Noto Sans Sinhala", "system-ui", "sans-serif"],
        tamil: ["Noto Sans Tamil", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xs: "0.25rem",
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
        full: "9999px",
      },
      boxShadow: {
        "soft-sm": "0 1px 3px rgba(0, 0, 0, 0.06)",
        soft: "0 4px 12px rgba(0, 0, 0, 0.08)",
        "soft-md": "0 6px 20px rgba(0, 0, 0, 0.10)",
        "soft-lg": "0 10px 32px rgba(0, 0, 0, 0.12)",
        "soft-xl": "0 20px 40px rgba(0, 0, 0, 0.15)",
        "inner-soft": "inset 0 2px 4px rgba(0, 0, 0, 0.06)",
        primary: "0 4px 14px rgba(0, 0, 0, 0.25)",
        accent: "0 4px 14px rgba(255, 255, 255, 0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-up": "fadeUp 0.5s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "slide-in-left": "slideInLeft 0.3s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "spin-slow": "spin 2s linear infinite",
        "pulse-soft": "pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #27272A, #09090B)",
        "gradient-accent": "linear-gradient(135deg, #FFFFFF, #E5E5E5)",
        "gradient-brand": "linear-gradient(135deg, #52525B 0%, #18181B 100%)",
        "gradient-hero": "linear-gradient(135deg, #FAFAFA 0%, #F4F4F5 50%, #E4E4E7 100%)",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
        34: "8.5rem",
        38: "9.5rem",
        42: "10.5rem",
        46: "11.5rem",
        50: "12.5rem",
        54: "13.5rem",
        58: "14.5rem",
        62: "15.5rem",
        66: "16.5rem",
        70: "17.5rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
        "10xl": "112rem",
      },
      screens: {
        xs: "475px",
        "3xl": "1792px",
        "4xl": "2048px",
      },
    },
  },
  plugins: [],
};

export default config;
console.log('TAILWIND CONFIG LOADED');
