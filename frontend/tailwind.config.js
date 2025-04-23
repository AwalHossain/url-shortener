/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-bg': '#F5F5DC', // Beige background from logo
        'brand-text': '#3A3A3A', // Dark brown/gray text from logo
        'brand-primary': '#4B3F3F', // Slightly darker brown for accents/buttons
        'brand-secondary': '#E0D8C0', // Lighter beige for hover/alternative backgrounds
      }
    },
  },
  plugins: [],
} 