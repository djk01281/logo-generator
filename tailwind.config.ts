import { type Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // <-- Add this line
  ],

  theme: {
    extend: {
      dropShadow: {
        xl: "0 0 5px 5px",
      },
      boxShadow: {
        xl: "5px 5px 0 0  rgba(0, 0, 0, 1)",
      },
      fontFamily: {
        serif: ["var(--font-montserrat)"],
        mono: ["var(--font-geist-mono)"],
        sans: ["var(--font-geist-sans)"],
        modak: ["var(--font-modak)"],
      },
    },
  },
  plugins: [require("tailwindcss-animated")],
} satisfies Config;
