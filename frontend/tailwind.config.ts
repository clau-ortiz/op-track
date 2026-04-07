import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        mine: {
          900: "#0B1723",
          700: "#1E2F40",
          500: "#2A4A63",
          300: "#4B6B82",
          accent: "#D7A84D"
        }
      }
    }
  },
  plugins: []
};

export default config;
