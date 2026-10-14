'use client';

import React, { useState, useRef } from 'react';
import { gsap, useGSAP } from '@/lib/gsap';
import { z } from 'zod';
import { hrmTapFeedback } from '@/lib/hrmMotion';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import { SiteBrandMark } from '@/components/SiteBrandMark';
import { hrmGetGoogleOAuthStartUrl, hrmLogin } from '@/api/hrmAuth';
import { HrmApiError } from '@/api/hrmClient';
import { isHrmOfflineDemoEnabled } from '@/lib/hrmConstants';
import { useHrmAuthStore } from '@/store/hrmAuthStore';

type Props = {
  onSuccess: () => void;
  oauthError?: string;
};

const loginFormSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

const oauthErrorMessage = (code: string) => {
  const map: Record<string, string> = {
    not_registered: 'No account for this Google email. Ask HR to add you, or enable sign-up on the server.',
    access_denied: 'Google sign-in was cancelled.',
    invalid_state: 'Sign-in session expired. Please try again.',
    server_misconfigured: 'Google sign-in is not configured on the API.',
    provision_failed: 'Could not create your account.',
  };
  return map[code] ?? `Google sign-in failed (${code}).`;
};

const HrmLogin: React.FC<Props> = ({ onSuccess, oauthError }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (cardRef.current) {
        gsap.from(cardRef.current, { opacity: 0, y: 30, duration: 0.55, ease: 'power3.out' });
      }
    },
    { scope: cardRef, dependencies: [] },
  );
  const setAuth = useHrmAuthStore((state) => state.setAuth);
  const setOfflineDemoAuth = useHrmAuthStore((state) => state.setOfflineDemoAuth);
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    const parse = loginFormSchema.safeParse({ email, password });
    if (!parse.success) {
      setError('Enter a valid email and password.');
      return;
    }

    setSubmitting(true);
    const button = event.currentTarget.querySelector('button[type="submit"]');
    if (button) {
      hrmTapFeedback(button);
    }

    try {
      const result = await hrmLogin(parse.data);
      setAuth(result.token, {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      });
      onSuccess();
    } catch (err) {
      if (err instanceof HrmApiError) {
        setError(err.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      ref={cardRef}
      className="mx-auto max-w-lg rounded-[2rem] border border-white/40 bg-white/70 p-8 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.1)]"
    >
      <div className="mb-6">
        <SiteBrandMark className="mb-4 h-12" />
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-100 p-3 text-brand">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Softivox Tech HRM</h2>
            <p className="text-sm font-medium text-slate-500">Sign in to manage people, payroll, and placements.</p>
          </div>
        </div>
      </div>
      <form className="space-y-4" onSubmit={submitLogin}>
        <label className="block space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Email</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@company.com"
            autoComplete="username"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</span>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="password"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm font-medium text-slate-900 transition-all focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-brand px-4 py-3 text-sm font-black text-white transition-all hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Signing in...' : 'Sign in to Dashboard'}
        </button>
        <button
          type="button"
          onClick={() => {
            window.location.href = hrmGetGoogleOAuthStartUrl();
          }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 transition-all hover:bg-slate-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>
        {isHrmOfflineDemoEnabled() ? (
          <button
            type="button"
            onClick={() => {
              setOfflineDemoAuth();
              onSuccess();
            }}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50"
          >
            Try without API (offline demo)
          </button>
        ) : null}
        <p className="text-center text-xs font-medium text-slate-500">
          API calls use <code className="rounded bg-slate-100 px-1">NEXT_PUBLIC_HRM_API_BASE_URL</code> (see <code className="rounded bg-slate-100 px-1">.env.local</code>).
        </p>
      </form>
      {oauthError ? (
        <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-sm font-medium text-amber-900">{oauthErrorMessage(oauthError)}</p>
      ) : null}
      {error ? <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">{error}</p> : null}
    </div>
  );
};

export default HrmLogin;
