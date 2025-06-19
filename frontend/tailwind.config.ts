import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // enable class strategy so `.dark` toggles variants
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
