import type { Metadata } from 'next';
import { Fraunces, Outfit } from 'next/font/google';
import { QueryProvider } from '@/providers/QueryProvider';
import './globals.css';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' });

export const metadata: Metadata = {
  title: 'Softivox Tech | IT Training & HRM',
  description:
    'Softivox Tech trains engineers in Snowflake, AI, SAP, cloud, and full-stack development, with placement support from Bengaluru.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`scroll-smooth ${outfit.variable} ${fraunces.variable}`}>
      <body className={`${outfit.className} overflow-x-hidden bg-paper text-ink antialiased mesh-bg`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
