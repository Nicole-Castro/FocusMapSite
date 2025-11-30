/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Laranja Principal
        primary: {
          50: '#fff7ed',
          100: '#ffe0ad',
          200: '#ffce85',
          300: '#ffbc54',
          400: '#ff9f3e',
          500: '#ff9e3d', // Laranja Principal
          600: '#f86f26', // Laranja Logo
          700: '#b36f2b', // Sombra
          800: '#6f451b', // Sombra Escura
          900: '#55504c', // Monocromático Escuro
        },
        // Cores Complementares
        complementary: {
          blue: '#09acde',
          orange: '#de7309',
        },
        // Dividir Complementar
        split: {
          yellow: '#e8bb25',
          blue: '#257de8',
        },
        // Tríade
        triad: {
          purple: '#773dff',
          green: '#3dff55',
        },
        // Composto
        compound: {
          red: '#ff663d',
          blue: '#3d6bff',
          cyan: '#3dd1ff',
        },
        // Quadrado
        square: {
          purple: '#e13dff',
          cyan: '#3dd1ff',
          lime: '#a7ff3d',
        },
        // Análogo
        analogous: {
          red: '#de6550',
          orange: '#de7e50',
        },
        // Monocromático
        mono: {
          light: '#aa8661',
          dark: '#55504c',
        },
      },
    },
  },
  plugins: [],
}