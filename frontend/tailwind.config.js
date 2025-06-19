/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // use `.dark` class strategy for dark mode
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
