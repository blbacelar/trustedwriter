/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00B5B4',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 