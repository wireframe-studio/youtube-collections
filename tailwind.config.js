/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  important: '#yt-collections-root',
  theme: {
    extend: {
      colors: {
        // Dark mode responsive palette - slightly desaturated
        category: {
          red: '#e57373',
          pink: '#f06292',
          purple: '#ba68c8',
          indigo: '#7986cb',
          blue: '#64b5f6',
          cyan: '#4dd0e1',
          teal: '#4db6ac',
          green: '#81c784',
          lime: '#aed581',
          yellow: '#ffd54f',
          orange: '#ffb74d',
          brown: '#a1887f',
          gray: '#90a4ae',
        }
      }
    },
  },
  plugins: [],
}
