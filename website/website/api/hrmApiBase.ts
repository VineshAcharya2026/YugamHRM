const envRaw = (process.env.NEXT_PUBLIC_HRM_API_BASE_URL ?? '').trim().replace(/\/$/, '');

/**
 * In development, default to same-origin `/hrm-api` (see `next.config.mjs` rewrite).
 * In production, set `NEXT_PUBLIC_HRM_API_BASE_URL` to your Worker URL.
 */
export const HRM_API_BASE =
  envRaw || (process.env.NODE_ENV === 'development' ? '/hrm-api' : '');

export function requireHrmApiBase(): string {
  if (!HRM_API_BASE) {
    throw new Error(
      'Missing HRM API base URL. Set NEXT_PUBLIC_HRM_API_BASE_URL for production, or run the Worker on 8787 with the dev rewrite.',
    );
  }
  return HRM_API_BASE;
}
