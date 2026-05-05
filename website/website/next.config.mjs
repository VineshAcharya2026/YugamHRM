import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/** Repo root (parent of `website/`). */
const repoRoot = path.resolve(__dirname, '../..');

/** Load env files in order; later paths win. Ensures Gemini keys are visible when this config runs (not only rely on Next’s internal ordering). */
const envFilesInOrder = [
  ...['.env', '.env.production', '.env.local'].map((n) => path.join(repoRoot, n)),
  ...['.env', '.env.production', '.env.local'].map((n) => path.join(__dirname, n)),
];
for (const fp of envFilesInOrder) {
  if (fs.existsSync(fp)) dotenv.config({ path: fp, override: true, quiet: true });
}

const nextPublicGemini =
  process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim() ||
  process.env.GEMINI_API_KEY?.trim() ||
  process.env.VITE_GEMINI_API_KEY?.trim() ||
  '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  /** Inlines into the client bundle (same as NEXT_PUBLIC_* from .env). Supports GEMINI_API_KEY / VITE_GEMINI_API_KEY fallbacks. */
  env: {
    NEXT_PUBLIC_GEMINI_API_KEY: nextPublicGemini,
  },
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  /** Avoid monorepo ESLint resolving `next` from the wrong workspace during `next build`. */
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    // Never proxy to localhost in production builds.
    if (process.env.NODE_ENV !== 'development') {
      return [];
    }
    return [
      {
        source: '/hrm-api/:path*',
        destination: 'http://127.0.0.1:8787/:path*',
      },
    ];
  },
};

export default nextConfig;
