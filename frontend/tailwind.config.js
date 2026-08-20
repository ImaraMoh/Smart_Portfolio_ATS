/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#12151C',
        paper: '#FAFAF8',
        accent: {
          DEFAULT: '#3A5CE0',
          light: '#EEF1FD'
        },
        gold: '#D4A24E',
        muted: '#6B7280'
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      borderRadius: {
        xl2: '18px'
      }
    }
  },
  plugins: []
};
