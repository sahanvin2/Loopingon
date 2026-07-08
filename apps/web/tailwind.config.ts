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
          50: "#FFF1F2",
          100: "#FFDDE0",
          200: "#FFB8BE",
          300: "#FF8C94",
          400: "#FA6873", // Accent
          500: "#F7444E", // Primary Coral
          600: "#E63946", // Primary Hover
          700: "#D92F3A",
          800: "#BC2530",
          900: "#A71E29",
        },
        accent: {
          50: "#F2FBFC",
          100: "#D8F0F3",
          200: "#BEE5E9",
          300: "#A6D6DC",
          400: "#8FC9D0",
          500: "#78BCC4", // Teal
          600: "#62A7B0",
          700: "#4F97A0",
          800: "#3E7D86",
          900: "#2E6670",
        },
        navy: {
          50: "#E8F0F4",
          100: "#D0E1E8",
          200: "#AEC8D6",
          300: "#8AAEC2",
          400: "#6894AB",
          500: "#002C3E", // Navy
          600: "#002534",
          700: "#001E2A",
          800: "#001822",
          900: "#00131B",
        },
        luxury: {
          bg: "#002C3E",
          gold: "#D4AF37",
          light: "#F9E7A1",
        },
        main: "#FAFAF8",
        surface: {
          50: "#FAFAF8", // Background main (from spec)
          100: "#F7F8F3", // Surface / bg-soft
          200: "#E4E8D8",
          300: "#D6DDC2", // Border
          400: "#C6D1AB",
          500: "#9ca3af",
          600: "#4b5563",
          700: "#374151", // Body Text
          800: "#1f2937",
          900: "#002C3E", // Heading Text
        },
        text: {
          50: "#F7F8F3",
          100: "#F1F3EB",
          200: "#E4E8D8",
          300: "#D6DDC2",
          400: "#9ca3af",
          500: "#6b7280", // Muted Text
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#002C3E", // Navy
        },
        muted: {
          100: "#F1F3EB",
          200: "#E4E8D8",
          300: "#D6DDC2",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#002C3E", // Navy
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
        "soft-sm": "0 1px 3px rgba(247, 68, 78, 0.06)",
        soft: "0 4px 12px rgba(247, 68, 78, 0.08)",
        "soft-md": "0 6px 20px rgba(247, 68, 78, 0.10)",
        "soft-lg": "0 10px 32px rgba(247, 68, 78, 0.12)",
        "soft-xl": "0 20px 40px rgba(247, 68, 78, 0.15)",
        "inner-soft": "inset 0 2px 4px rgba(247, 68, 78, 0.06)",
        primary: "0 4px 14px rgba(247, 68, 78, 0.25)",
        accent: "0 4px 14px rgba(120, 188, 196, 0.15)",
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
        "gradient-primary": "linear-gradient(135deg, #F7444E, #E63946)",
        "gradient-accent": "linear-gradient(135deg, #A6D6DC, #78BCC4)",
        "gradient-brand": "linear-gradient(135deg, #FA6873 0%, #F7444E 100%)",
        "gradient-hero": "linear-gradient(135deg, #FFF1F2 0%, #F7F8F3 50%, #FFDDE0 100%)",
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
