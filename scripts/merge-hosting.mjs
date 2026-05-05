/**
 * 1) `next build` in website/website → `out/`
 * 2) `vite build` in repo root → `dist/`
 * 3) Copy `dist` → `out/hrm` for merged Firebase hosting (marketing at `/`, HRM at `/hrm/`).
 *
 * Loads root + website `.env`, `.env.production`, `.env.local` so `GEMINI_API_KEY` or
 * `VITE_GEMINI_API_KEY` can populate `NEXT_PUBLIC_GEMINI_API_KEY` for the static Next export (AI chat).
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const siteDir = path.join(root, 'website', 'website');
const out = path.join(siteDir, 'out');
const dist = path.join(root, 'dist');
const hrmOut = path.join(out, 'hrm');

function loadMergedEnvFiles() {
  const files = [
    path.join(root, '.env'),
    path.join(siteDir, '.env'),
    path.join(root, '.env.production'),
    path.join(siteDir, '.env.production'),
    path.join(root, '.env.local'),
    path.join(siteDir, '.env.local'),
  ];
  for (const fp of files) {
    if (fs.existsSync(fp)) dotenv.config({ path: fp, override: true, quiet: true });
  }
}

function geminiKeyForNextPublic() {
  return (
    process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.VITE_GEMINI_API_KEY ||
    ''
  );
}

loadMergedEnvFiles();
const nextBuildEnv = {
  ...process.env,
  NEXT_PUBLIC_GEMINI_API_KEY: geminiKeyForNextPublic(),
};

console.log('→ Building marketing site (Next)…');
if (!nextBuildEnv.NEXT_PUBLIC_GEMINI_API_KEY) {
  console.warn(
    '⚠ No Gemini key for marketing build (set NEXT_PUBLIC_GEMINI_API_KEY, GEMINI_API_KEY, or VITE_GEMINI_API_KEY). AI chat will show "not configured" until you set one.',
  );
}
execSync('npm run build', { cwd: siteDir, stdio: 'inherit', env: nextBuildEnv });

if (!fs.existsSync(out) || !fs.existsSync(path.join(out, 'index.html'))) {
  throw new Error(`Expected ${out} with index.html from next export.`);
}

console.log('→ Building HRM (Vite)…');
execSync('npm run build', { cwd: root, stdio: 'inherit' });

if (!fs.existsSync(dist) || !fs.existsSync(path.join(dist, 'index.html'))) {
  throw new Error(`Expected ${dist} with index.html from Vite.`);
}

fs.rmSync(hrmOut, { recursive: true, force: true });
fs.cpSync(dist, hrmOut, { recursive: true });
console.log('→ Merged HRM dist into', hrmOut);
console.log('   Deploy with: firebase deploy --only hosting');
