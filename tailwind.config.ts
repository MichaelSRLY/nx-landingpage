import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--nexora-bg))",
        surface: "hsl(var(--nexora-surface))",
        text: {
          primary: "hsl(var(--nexora-text-primary))",
          secondary: "hsl(var(--nexora-text-secondary))",
          muted: "hsl(var(--nexora-text-muted))",
        },
        border: "hsl(var(--nexora-border))",
        accent: {
          warm: "hsl(var(--nexora-accent-warm))",
          cool: "hsl(var(--nexora-accent-cool))",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        fadeUp: "fadeUp 0.6s ease-out forwards",
        fadeDown: "fadeDown 0.6s ease-out forwards",
        float: "float 3s ease-in-out infinite",
        scrollPulse: "scrollPulse 2s ease-in-out infinite",
        slowSpin: "slowSpin 120s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeDown: {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        scrollPulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        slowSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      boxShadow: {
        sm: "0 1px 2px 0 hsl(var(--nexora-shadow))",
        md: "0 4px 6px -1px hsl(var(--nexora-shadow))",
        lg: "0 10px 15px -3px hsl(var(--nexora-shadow))",
        paper: "0 2px 8px hsl(var(--nexora-shadow))",
        elevated: "0 4px 16px hsl(var(--nexora-shadow))",
      },
    },
  },
  plugins: [],
};

export default config;
