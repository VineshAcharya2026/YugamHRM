'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { hrmExchangeOAuthCode } from '@/api/hrmAuth';
import { HrmApiError } from '@/api/hrmClient';
import { useHrmAuthStore } from '@/store/hrmAuthStore';

type Props = {
  oauthCode: string | null;
};

const HrmOAuthCallback: React.FC<Props> = ({ oauthCode }) => {
  const setAuth = useHrmAuthStore((s) => s.setAuth);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!oauthCode) {
      setError('Missing authorization code. Return to login and try again.');
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const res = await hrmExchangeOAuthCode(oauthCode);
        if (cancelled) return;
        setAuth(res.token, {
          id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          role: res.user.role,
        });
        router.replace('/hrm/dashboard');
      } catch (err) {
        if (cancelled) return;
        if (err instanceof HrmApiError) {
          setError(err.message);
        } else {
          setError('Google sign-in failed.');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [oauthCode, setAuth, router]);

  return (
    <section className="mx-auto max-w-lg px-4 py-24">
      <div className="rounded-[2rem] border border-white/40 bg-white/70 p-8 backdrop-blur-xl">
        <h2 className="text-xl font-black text-slate-900">Completing Google sign-in…</h2>
        {error ? (
          <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
        ) : (
          <p className="mt-2 text-sm text-slate-600">Securing your session.</p>
        )}
        {error ? (
          <button
            type="button"
            className="mt-4 rounded-xl bg-brand px-4 py-2 text-sm font-bold text-white hover:bg-brand-600"
            onClick={() => router.replace('/hrm/login')}
          >
            Back to login
          </button>
        ) : null}
      </div>
    </section>
  );
};

export default HrmOAuthCallback;
