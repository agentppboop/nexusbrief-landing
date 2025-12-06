/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      colors: {
        // The "Legora" Editorial Palette
        editorial: {
          beige: '#EBE8E3',    // The main background color
          paper: '#F9F9F9',    // Lighter card background
          black: '#111111',    // Main text
          charcoal: '#333333', // Secondary text
          accent: '#000000',   // Buttons (Solid Black)
        }
      },
      backgroundImage: {
        'grain': "url('https://grainy-gradients.vercel.app/noise.svg')",
      }
    },
  },
  plugins: [],
}