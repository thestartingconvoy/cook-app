import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm, layered neutrals + one confident clay accent.
        cream: "#FAF6EF",
        ivory: "#FFFCF7",
        sand: "#F1E7D7",
        warm: "#ECE0CE",
        ink: "#28231D",
        accent: "#C75D44",
        accentDark: "#A8472F",
        gold: "#C2A04C",
        leaf: "#6E8C6A",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.03em",
      },
      boxShadow: {
        soft: "0 2px 10px rgba(40,35,29,0.05)",
        card: "0 1px 2px rgba(40,35,29,0.04), 0 14px 30px -16px rgba(40,35,29,0.22)",
        float: "0 18px 50px -16px rgba(199,93,68,0.55)",
        ring: "inset 0 0 0 1px rgba(40,35,29,0.06)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both",
        "scale-in": "scale-in 0.5s cubic-bezier(0.22,1,0.36,1) both",
        breathe: "breathe 3.2s ease-in-out infinite",
        halo: "halo 2.6s ease-out infinite",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.92)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        breathe: {
          "0%,100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.035)" },
        },
        halo: {
          "0%": { boxShadow: "0 0 0 0 rgba(199,93,68,0.40)" },
          "70%,100%": { boxShadow: "0 0 0 26px rgba(199,93,68,0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
