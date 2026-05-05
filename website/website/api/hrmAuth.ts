import { z } from 'zod';
import type { HrmLoginResponse, HrmSessionUser } from '@/types';
import { requireHrmApiBase } from './hrmApiBase';
import { hrmRequest } from './hrmClient';

/** Full URL to start Google OAuth (GET → 302 to Google). Worker must have Google OAuth configured. */
export function hrmGetGoogleOAuthStartUrl(): string {
  return `${requireHrmApiBase()}/api/auth/google`;
}

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

export type HrmLoginInput = z.infer<typeof loginSchema>;

export async function hrmLogin(input: HrmLoginInput): Promise<HrmLoginResponse> {
  const payload = loginSchema.parse(input);
  return hrmRequest<HrmLoginResponse, HrmLoginInput>('/api/auth/login', 'POST', payload);
}

export async function hrmGetMe(token?: string | null): Promise<HrmSessionUser> {
  return hrmRequest<HrmSessionUser>('/api/auth/me', 'GET', undefined, token);
}

export async function hrmLogout(token?: string | null): Promise<{ message: string }> {
  return hrmRequest<{ message: string }>('/api/auth/logout', 'POST', undefined, token);
}

/** Exchange one-time code from Google OAuth redirect for JWT session. */
export async function hrmExchangeOAuthCode(code: string): Promise<HrmLoginResponse> {
  return hrmRequest<HrmLoginResponse, { code: string }>('/api/auth/exchange', 'POST', { code });
}
