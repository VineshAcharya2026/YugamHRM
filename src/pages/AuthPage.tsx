import React, { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { formatAuthError, type AuthErrorDisplay } from '../lib/authErrorMessage';
import { normalizeCredentials, validateEmailAndPassword } from '../lib/validateAuthForm';
import { AuthAlert } from '../components/auth/AuthAlert';
import { GoogleGIcon } from '../components/auth/GoogleGIcon';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Shield, Sparkles } from 'lucide-react';
import { getMarketingHomeHref } from '../lib/env';
import { isStaffEmail } from '../lib/staffAccounts';
import { SiteBrandMark } from '../components/brand/SiteBrandMark';
import { cn } from '../lib/utils';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<AuthErrorDisplay | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const busy = loading || googleLoading;
  const homeHref = getMarketingHomeHref();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const { email: em, password: pw } = normalizeCredentials(email, password);
    const validation = validateEmailAndPassword(em, pw, !isLogin);
    if (validation) {
      setAuthError({
        tone: 'form',
        title: 'Check your details',
        detail: validation,
      });
      return;
    }
    if (!isLogin && isStaffEmail(em)) {
      setAuthError({
        tone: 'form',
        title: 'Staff account',
        detail: 'This staff account is already issued. Sign in with the password you were given.',
      });
      return;
    }
    setLoading(true);
    const flow = isLogin ? 'email-login' : 'email-signup';
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, em, pw);
      } else {
        await createUserWithEmailAndPassword(auth, em, pw);
      }
    } catch (err: unknown) {
      setAuthError(formatAuthError(err, flow));
    } finally {
      setLoading(false);
    }
  };

  const buildGoogleProvider = () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    return provider;
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setAuthError(null);
    const provider = buildGoogleProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
      const code =
        err && typeof err === 'object' && err !== null && 'code' in err
          ? String((err as { code: string }).code)
          : '';
      const useRedirect = [
        'auth/argument-error',
        'auth/popup-blocked',
        'auth/popup-closed-by-user',
        'auth/operation-not-supported-in-this-environment',
      ].includes(code);
      if (useRedirect) {
        try {
          await signInWithRedirect(auth, buildGoogleProvider());
        } catch (redirectErr: unknown) {
          setAuthError(formatAuthError(redirectErr, 'google'));
        }
      } else {
        setAuthError(formatAuthError(err, 'google'));
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="hrm-auth-shell flex flex-col items-center justify-center p-4 pb-16 font-sans selection:bg-brand-cyan/25 selection:text-brand-fg sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[440px]"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 inline-flex rounded-2xl border border-windows-border bg-brand-surface px-4 py-3 shadow-lg shadow-black/40 backdrop-blur-sm">
            <SiteBrandMark className="h-11 w-auto max-w-[min(260px,88vw)] sm:h-12 sm:max-w-[280px]" priority />
          </div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-windows-border bg-brand-info-bg px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-brand-cyan" aria-hidden />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-cyan">HRM portal</span>
          </div>
          <p className="text-balance text-sm font-medium text-brand-fg-muted">
            Sign in to manage your profile, documents, and placement journey.
          </p>
          <a
            href={homeHref}
            className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-cyan transition hover:text-brand-hover hover:underline"
          >
            ← Back to YugamCloud.ai
          </a>
        </div>

        <div className="hrm-auth-card p-6 sm:p-9">
          <div className="mb-8 flex rounded-xl border border-windows-border bg-brand-page p-1">
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setIsLogin(true);
                setAuthError(null);
              }}
              className={cn(
                'flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all',
                isLogin
                  ? 'bg-brand-surface text-brand-fg shadow-sm ring-1 ring-windows-border'
                  : 'text-brand-fg-muted hover:text-brand-fg',
              )}
            >
              Sign in
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setIsLogin(false);
                setAuthError(null);
              }}
              className={cn(
                'flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all',
                !isLogin
                  ? 'bg-brand-surface text-brand-fg shadow-sm ring-1 ring-windows-border'
                  : 'text-brand-fg-muted hover:text-brand-fg',
              )}
            >
              New account
            </button>
          </div>

          <h2 className="mb-6 text-center text-lg font-bold tracking-tight text-brand-fg sm:text-xl">
            {isLogin ? 'Welcome back' : 'Create your candidate account'}
          </h2>

          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block px-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-fg-muted">Email</label>
              <div className="group relative">
                <Mail
                  className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-brand-fg-disabled transition-colors group-focus-within:text-brand-cyan"
                  size={18}
                />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  disabled={busy}
                  className="hrm-auth-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block px-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-fg-muted">Password</label>
              <div className="group relative">
                <Lock
                  className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-brand-fg-disabled transition-colors group-focus-within:text-brand-cyan"
                  size={18}
                />
                <input
                  type="password"
                  required
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  disabled={busy}
                  className="hrm-auth-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {authError ? <AuthAlert error={authError} /> : null}

            <button type="submit" disabled={busy} className="hrm-auth-btn-primary mt-2">
              <span>{loading ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}</span>
              {!loading ? <ArrowRight className="h-4 w-4" aria-hidden /> : null}
            </button>
          </form>

          <div className="relative my-9">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-windows-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-brand-surface px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-fg-muted">
                or continue with
              </span>
            </div>
          </div>

          <button onClick={handleGoogleSignIn} type="button" disabled={busy} className="hrm-auth-btn-google">
            <GoogleGIcon className="h-5 w-5 shrink-0" />
            <span>{googleLoading ? 'Connecting…' : 'Google (candidates)'}</span>
          </button>
          <p className="mt-3 text-center text-[11px] leading-relaxed text-brand-fg-muted">
            Google sign-in is for candidates. Staff use the email and password issued for their desk.
          </p>

          <p className="mt-8 text-center text-xs text-brand-fg-muted">
            {isLogin ? 'First time here?' : 'Already registered?'}{' '}
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setIsLogin(!isLogin);
                setAuthError(null);
              }}
              className="font-semibold text-brand-cyan hover:underline disabled:opacity-60"
            >
              {isLogin ? 'Switch to new account' : 'Switch to sign in'}
            </button>
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-brand-fg-muted">
            <Shield className="h-3.5 w-3.5 text-brand-cyan-dim" aria-hidden />
            <span>Secure Firebase authentication</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
