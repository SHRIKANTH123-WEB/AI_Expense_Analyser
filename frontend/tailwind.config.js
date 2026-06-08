/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          bg: 'var(--bg-color)',
          inner: 'var(--inner-color)',
          card: 'var(--card-color)',
          border: 'var(--border-color)',
          text: 'var(--text-color)',
          green: 'var(--green-accent)',   // Emerald/Green theme color
          orange: 'var(--orange-accent)', // Warning/Alert theme color
          muted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-green': '0 0 20px -2px rgba(16, 185, 129, 0.12)',
        'glow-orange': '0 0 20px -2px rgba(255, 85, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
