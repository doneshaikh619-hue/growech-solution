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
        obsidian: {
          950: '#060607',
          900: '#0A0A0B',
          850: '#0D0E12',
          800: '#121318',
          700: '#1A1B22',
          600: '#262832',
        },
        ivory: {
          50: '#FFFFFF',
          100: '#FAFAFA',
          200: '#F5F5F7',
          300: '#EAECEF',
          400: '#D5D9E0',
        },
        ember: {
          DEFAULT: '#FF5500',
          50: '#FFF5F0',
          100: '#FFE9DF',
          200: '#FFD1BF',
          300: '#FFAA85',
          400: '#FF7D42',
          500: '#FF5500', // Primary Neon Orange
          600: '#FF3D00',
          700: '#D63000',
          800: '#A32500',
          glow: 'rgba(255, 85, 0, 0.4)',
        },
        tangerine: '#FF6A00',
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(255, 85, 0, 0.25)',
        'glow-md': '0 0 30px rgba(255, 85, 0, 0.35)',
        'glow-lg': '0 0 50px rgba(255, 85, 0, 0.45)',
        'glow-xl': '0 0 80px rgba(255, 85, 0, 0.60)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-light': '0 8px 30px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'laser-ray': 'laserRay 6s linear infinite',
        'circuit-flow': 'circuitFlow 2.5s ease-in-out infinite',
        'float-slow': 'floatSlow 4s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
          '50%': { opacity: 0.85, transform: 'scale(1.05)' },
        },
        laserRay: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        circuitFlow: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
