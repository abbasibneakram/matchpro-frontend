module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1B2321',
        paper: '#F7F4EE',
        teal: { DEFAULT: '#0E5C50', soft: '#E4EFEC', dark: '#0A423A' },
        marigold: { DEFAULT: '#C68A1B', soft: '#F5E8CC' },
        rose: { DEFAULT: '#9B3B4A', soft: '#F1E1E3' },
        line: '#DED7C7',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
