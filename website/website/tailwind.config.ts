import type { Config } from 'tailwindcss';

const config: Config = {
  // Include root-level modules that export JSX with class names (not under app/ or components/).
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './constants.tsx',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#0A2E6B',
        paper: '#F4F7FB',
        brand: {
          DEFAULT: '#1B6FD4',
          50: '#EAF3FC',
          100: '#D4E7F8',
          200: '#A6CDF3',
          500: '#1B6FD4',
          600: '#155CAD',
          700: '#104A8C',
          800: '#0A2E6B',
        },
        leaf: {
          DEFAULT: '#187A3A',
          50: '#E8F6ED',
          200: '#8ED9A6',
          500: '#2E9B4F',
          600: '#187A3A',
        },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      boxShadow: {
        lift: '0 22px 50px -16px rgba(27, 111, 212, 0.35)',
        card: '0 10px 30px -16px rgba(10, 46, 107, 0.18)',
      },
    },
  },
  plugins: [],
};

export default config;
