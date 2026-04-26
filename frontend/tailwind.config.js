/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#0a0a0a',
          2: '#111111',
          3: '#181818',
          4: '#1e1e1e',
          5: '#252525',
        },
        border: {
          DEFAULT: '#1e1e1e',
          2: '#2a2a2a',
        },
        orange: {
          DEFAULT: '#FF6B1A',
          dim: 'rgba(255, 107, 26, 0.12)',
        },
        brand: {
          red: '#E63946',
          gold: '#FFB627',
        },
        text: {
          DEFAULT: '#F2F2F2',
          2: '#A8A8A8',
          3: '#505050',
        },
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        bebas: ['"Bebas Neue"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
