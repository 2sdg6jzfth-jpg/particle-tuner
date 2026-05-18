import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: { primary: "#0A0E18", surface: "#14181F" },
        text: { DEFAULT: "#F5EBD7" },
        amber: { DEFAULT: "#FFD89A" },
        cyan: { DEFAULT: "#A8E9F4", deep: "#5DD3E8" },
        green: { DEFAULT: "#7BDC9B" },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      borderRadius: {
        pill: "22px",
      },
    },
  },
  plugins: [],
};
export default config;
