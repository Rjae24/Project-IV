/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hav: {
          primary: '#367281',
          'primary-dark': '#1e4f5c',
          'primary-light': '#4a8fa0',
          secondary: '#66AB1A',
          'secondary-dark': '#4d8013',
          bg: '#F3F4F6',
          surface: '#FFFFFF',
          'text-main': '#1E293B',
          'text-muted': '#64748B',
          danger: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Epilogue', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse2: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        }
      },
      animation: {
        slideIn: 'slideIn 0.3s ease-out',
        fadeIn: 'fadeIn 0.4s ease-out',
        pulse2: 'pulse2 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
