/** Matches `store/hrmAuthStore` offline demo token. */
export const HRM_OFFLINE_DEMO_TOKEN = 'offline-demo-token';

/**
 * When `true`, the login screen may use “offline demo” without a Worker (dev-only UX).
 * Production: leave unset or `false` — users must sign in against the real HRM API.
 */
export function isHrmOfflineDemoEnabled(): boolean {
  return process.env.NEXT_PUBLIC_HRM_OFFLINE_DEMO === 'true';
}

export function canCallHrmApi(token: string | null | undefined): token is string {
  return typeof token === 'string' && token.length > 0 && token !== HRM_OFFLINE_DEMO_TOKEN;
}

/** Amber “offline demo” strip — only when opt-in demo is on and token is the demo placeholder. */
export function shouldShowOfflineBanner(token: string | null | undefined): boolean {
  return isHrmOfflineDemoEnabled() && !canCallHrmApi(token);
}
