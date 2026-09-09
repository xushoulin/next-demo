import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "oklch(0.99 0.005 240)",
        foreground: "oklch(0.15 0.02 240)",
      },
    },
  },
  plugins: [],
} satisfies Config;
