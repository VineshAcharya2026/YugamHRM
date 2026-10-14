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
        ink: '#161311',
        paper: '#f6f1ea',
        brand: {
          DEFAULT: '#e23d12',
          50: '#fff1eb',
          100: '#ffd9cc',
          200: '#ffb399',
          500: '#e23d12',
          600: '#c4320c',
          700: '#9a2709',
          800: '#6e1b06',
        },
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      boxShadow: {
        lift: '0 22px 50px -16px rgba(226, 61, 18, 0.35)',
        card: '0 10px 30px -16px rgba(22, 19, 17, 0.18)',
      },
    },
  },
  plugins: [],
};

export default config;
