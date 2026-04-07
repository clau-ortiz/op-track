/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          900: '#0f172a',
          700: '#1e293b',
          500: '#334155'
        }
      }
    }
  },
  plugins: []
};
