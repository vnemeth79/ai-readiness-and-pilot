/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'minerva-red': {
          DEFAULT: '#C41E3A',
          dark: '#9B1B30',
          light: '#E63950',
          50: '#FDF2F4',
          100: '#FCE7EA',
          200: '#F9D0D7',
          300: '#F4A8B5',
          400: '#EC7489',
          500: '#C41E3A',
          600: '#B01A34',
          700: '#9B1B30',
          800: '#7A1627',
          900: '#5C1120',
        },
        'minerva-black': '#0D0D0D',
        'minerva-charcoal': '#1A1A1A',
        'minerva-gray': '#2D2D2D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
