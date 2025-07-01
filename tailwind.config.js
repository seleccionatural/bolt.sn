/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        gray: {
          750: '#2D2D2D',
          800: '#191919',
        }
      },
      letterSpacing: {
        'tight': '-0.02em',
      }
    },
  },
  plugins: [],
};