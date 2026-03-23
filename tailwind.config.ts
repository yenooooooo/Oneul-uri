import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* shadcn CSS 변수 기반 컬러 시스템 */
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        /* 오늘우리 커스텀 컬러 */
        coral: {
          50: "#FFF0F0",
          100: "#FFD4D4",
          200: "#FFB0B0",
          300: "#FF8A8A",
          400: "#FF6B6B",
          500: "#E85555",
          600: "#CC4444",
        },
        cream: {
          DEFAULT: "#FFF8F0",
          dark: "#FFF0E8",
        },
        "blue-soft": "#7EB8E0",
        "pink-soft": "#F5A0B8",
        "yellow-warm": "#FFD66B",
        "green-soft": "#7EC8A0",
        /* 텍스트 컬러 */
        "txt-primary": "#2D2D2D",
        "txt-secondary": "#6B6B6B",
        "txt-tertiary": "#9B9B9B",
        /* 기능 컬러 */
        success: "#4CAF50",
        warning: "#FF9800",
        error: "#F44336",
      },
      /* 폰트 */
      fontFamily: {
        sans: ["'Pretendard Variable'", "-apple-system", "sans-serif"],
        handwriting: ["'Nanum Pen Script'", "cursive"],
      },
      /* 둥글둥글한 모서리 */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      /* 그림자 */
      boxShadow: {
        soft: "0 1px 3px rgba(0, 0, 0, 0.06)",
        card: "0 4px 12px rgba(0, 0, 0, 0.08)",
        float: "0 8px 24px rgba(0, 0, 0, 0.1)",
      },
      /* 애니메이션 */
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shake: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-3deg)" },
          "75%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease-out",
        shake: "shake 0.5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
