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
        brand: {
          DEFAULT: '#00A8C9',
          50: '#e6f4f8',
          100: '#b3e4ef',
          200: '#80d3e6',
          500: '#00A8C9',
          600: '#0092b0',
          700: '#007a94',
          800: '#005c70',
        },
      },
      boxShadow: {
        lift: '0 20px 50px -12px rgba(0, 168, 201, 0.18)',
        card: '0 4px 24px -4px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
