/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['"Syne"', 'sans-serif'],
      },
      colors: {
        ink: '#0D1117',
        surface: '#161B22',
        border: '#21262D',
        muted: '#8B949E',
        accent: '#00C7BE',
        'text-primary': '#E6EDF3',
        'text-secondary': '#8B949E',
      },
    },
  },
  plugins: [],
}