import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FBF6F0",
        "cream-soft": "#F1E4D8",
        cacau: {
          DEFAULT: "#3B2A24",
          soft: "#5A443C",
        },
        framboesa: {
          DEFAULT: "#B23A56",
          light: "#D3607A",
          dark: "#8A2A41",
        },
        dourado: {
          DEFAULT: "#C9A24B",
          light: "#E0C077",
        },
        pistache: {
          DEFAULT: "#7C8A5E",
          light: "#A3B080",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        swirl: "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
