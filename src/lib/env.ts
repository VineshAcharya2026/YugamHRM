/**
 * Deployment URL (trailing slash stripped). Set `VITE_APP_URL` in production if
 * you need a stable canonical host; otherwise uses `location.origin` in the browser.
 */
export function getAppUrl(): string {
  const fromEnv = (import.meta.env.VITE_APP_URL as string | undefined)?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return '';
}

/**
 * Marketing / training homepage. Use when the HRM app is hosted under a subpath (e.g. `/hrm/`)
 * and the Next marketing site is at `/`. Override with `VITE_MARKETING_URL` in dev (e.g. `http://localhost:3000`).
 */
export function getMarketingHomeHref(): string {
  const fromEnv = (import.meta.env.VITE_MARKETING_URL as string | undefined)?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '') + '/';
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/`;
  }
  return '/';
}

/**
 * Gemini API key. Supports `VITE_GEMINI_API_KEY` in `.env` and `process.env.GEMINI_API_KEY`
 * from `vite.config.ts` (used by some hosts / AI Studio that inject the latter at build time).
 */
export const geminiApiKey: string =
  (import.meta.env.VITE_GEMINI_API_KEY as string | undefined) ||
  (typeof process !== 'undefined' ? process.env.GEMINI_API_KEY : undefined) ||
  '';
