/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        surface: '#F2F0E3',
        'surface-night': '#141310',
        'surface-elevated': '#E9E6D5',
        'surface-elevated-night': '#221F17',
        ink: '#1C1B16',
        'ink-night': '#F2EFE6',
        muted: '#8D8975',
        'muted-night': '#A7A18E',
        border: '#DCD8C3',
        'border-night': '#332F24',
        primary: '#4B5723',
        'primary-night': '#8FA352',
        'primary-dark': '#3A4319',
        'primary-dark-night': '#6B7A3B',
        highlight: '#C1512F',
        'highlight-night': '#E38356',
        danger: '#B23B3B',
        'danger-night': '#E0605E',
        poop: {
          DEFAULT: '#A9744F',
          night: '#C99872',
          bg: '#EFE6DB',
          'bg-night': '#2B2119',
        },
        piss: {
          DEFAULT: '#B08A1E',
          night: '#D4B354',
          bg: '#F3EDD8',
          'bg-night': '#2C2717',
        },
        feed: {
          DEFAULT: '#5C6B2E',
          night: '#8FA352',
          bg: '#E6E9D8',
          'bg-night': '#232819',
        },
        sleep: {
          DEFAULT: '#6E6B8F',
          night: '#9C99C2',
          bg: '#E6E5EE',
          'bg-night': '#211F2B',
        },
      },
      borderRadius: {
        card: '20px',
      },
    },
  },
  plugins: [],
};
