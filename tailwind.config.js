/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class', // Enable dark mode based on a class
  theme: {
    extend: {
      colors: {
        dark: {
          100: '#1e1e1e', // Darker shades for UI elements
          200: '#121212',
          300: '#0d0d0d',
        },
        light: {
          100: '#ffffff',
          200: '#e0e0e0',
        },
      },
    },
  },
  plugins: [],
};
