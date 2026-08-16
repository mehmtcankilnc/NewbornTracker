/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        surface: '#F2F0E3',
        'surface-elevated': '#E9E6D5',
        ink: '#1C1B16',
        muted: '#8D8975',
        border: '#DCD8C3',
        primary: '#4B5723',
        'primary-dark': '#3A4319',
        highlight: '#C1512F',
        danger: '#B23B3B',
        poop: {
          DEFAULT: '#A9744F',
          bg: '#EFE6DB',
        },
        piss: {
          DEFAULT: '#B08A1E',
          bg: '#F3EDD8',
        },
        feed: {
          DEFAULT: '#5C6B2E',
          bg: '#E6E9D8',
        },
        sleep: {
          DEFAULT: '#6E6B8F',
          bg: '#E6E5EE',
        },
      },
      borderRadius: {
        card: '20px',
      },
    },
  },
  plugins: [],
};
