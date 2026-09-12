/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#080c14",
          card: "#0f172a",
          surface: "#131e36",
          border: "#1e293b",
          neonGreen: "#10b981",
          neonGold: "#f59e0b",
          neonRed: "#ef4444",
          neonCyan: "#06b6d4",
          neonPurple: "#8b5cf6",
        },
      },
      boxShadow: {
        neonGlow: "0 0 20px -3px rgba(16, 185, 129, 0.4)",
        goldGlow: "0 0 20px -3px rgba(245, 158, 11, 0.4)",
        cyanGlow: "0 0 20px -3px rgba(6, 182, 212, 0.4)",
        cardHover: "0 10px 25px -5px rgba(0, 0, 0, 0.6), 0 0 15px -2px rgba(16, 185, 129, 0.25)",
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
