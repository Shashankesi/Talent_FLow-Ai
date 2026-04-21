/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6366f1',
          800: '#4c1d95',
          900: '#2d1b4e',
        },
        secondary: '#8b5cf6',
        accent: '#ec4899',
        dark: '#0f172a',
        'dark-secondary': '#1e293b',
        'dark-tertiary': '#334155',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        'sm-custom': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md-custom': '0 4px 6px -1px rgba(99, 102, 241, 0.15), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg-custom': '0 10px 25px -5px rgba(99, 102, 241, 0.15), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'xl-custom': '0 20px 25px -5px rgba(99, 102, 241, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      scale: {
        '98': '0.98',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}

