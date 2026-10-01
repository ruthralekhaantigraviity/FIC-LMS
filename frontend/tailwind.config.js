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
        aubergine: '#321E38',
        peach: '#F3A68C',
        champagne: '#E8D8A8',
        warmwhite: '#FAF8F3',
        coolgray: '#667078',
        plum: '#654568',
        primary: {
          50: '#FAF8F3',
          100: '#E8D8A8',
          200: '#F3A68C',
          300: '#9b719e',
          400: '#654568',
          500: '#4d3053',
          600: '#321E38',
          700: '#25152a',
          800: '#1b0e1e',
          900: '#120814',
          950: '#09030a',
        },
        accent: {
          peach: '#F3A68C',
          champagne: '#E8D8A8',
          plum: '#654568',
          purple: '#8b5cf6',
          pink: '#ec4899',
          cyan: '#22d3ee',
        },
        dark: {
          bg: '#321E38',
          card: '#25152a',
          border: '#4d3053',
          text: '#FAF8F3',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(135deg, rgba(250, 248, 243, 0.15), rgba(250, 248, 243, 0.05))',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(50, 30, 56, 0.25)',
      }
    },
  },
  plugins: [],
}
// Rebuild trigger
