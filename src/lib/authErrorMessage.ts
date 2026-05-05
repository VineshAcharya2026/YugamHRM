import type { AuthError } from 'firebase/auth';
import firebase from '../../firebase-applet-config.json';

const PROJECT_ID = firebase.projectId as string;

export type AuthFlow = 'email-login' | 'email-signup' | 'google';

export type AuthErrorDisplay = {
  tone: 'setup' | 'form';
  title: string;
  detail: string;
  primaryAction?: { href: string; label: string };
  advancedLinks?: { href: string; label: string }[];
};

const authPath = (path: string) =>
  `https://console.firebase.google.com/project/${PROJECT_ID}/authentication${path}`;

const gc = (q: string) =>
  `https://console.cloud.google.com/${q}${q.includes('?') ? '&' : '?'}project=${PROJECT_ID}`;

function getCode(err: unknown): string {
  if (err && typeof err === 'object' && err !== null && 'code' in err) {
    return String((err as AuthError).code);
  }
  return '';
}

export function formatAuthError(err: unknown, flow: AuthFlow = 'email-login'): AuthErrorDisplay {
  const code = getCode(err);
  const rawMessage = err instanceof Error ? err.message : String(err);

  if (code === 'auth/configuration-not-found') {
    return {
      tone: 'setup',
      title: 'Project admin: enable sign-in in Firebase',
      detail:
        'Email and Google sign-in are turned off (or Google Cloud auth APIs are disabled). This is fixed in the Firebase / Google Cloud console, not in app code. Use the button below, then turn on Email/Password and Google under Sign-in method.',
      primaryAction: {
        href: authPath(''),
        label: 'Open Firebase Authentication',
      },
      advancedLinks: [
        { label: 'Sign-in methods (enable Email + Google)', href: authPath('/providers') },
        { label: 'Authorized domains', href: authPath('/settings') },
        { label: 'Enable Identity Toolkit API', href: gc('apis/library/identitytoolkit.googleapis.com') },
        { label: 'Enable Token Service API', href: gc('apis/library/securetoken.googleapis.com') },
      ],
    };
  }

  if (code === 'auth/api-key-not-valid' || code === 'auth/invalid-api-key') {
    return {
      tone: 'setup',
      title: 'API key or domain issue',
      detail: rawMessage,
      primaryAction: { href: gc('apis/credentials'), label: 'Google Cloud — API credentials' },
      advancedLinks: [
        { label: 'Authentication — authorized domains', href: authPath('/settings') },
      ],
    };
  }

  if (code === 'auth/unauthorized-domain') {
    return {
      tone: 'setup',
      title: 'Current domain is not authorized',
      detail:
        'This website domain is not added in Firebase Authentication authorized domains. Add your live domain and try Google sign-in again.',
      primaryAction: { href: authPath('/settings'), label: 'Open authorized domains' },
    };
  }

  if (code === 'auth/operation-not-allowed') {
    return {
      tone: 'setup',
      title: 'Google sign-in is disabled',
      detail: 'Enable Google provider in Firebase Authentication > Sign-in method.',
      primaryAction: { href: authPath('/providers'), label: 'Open sign-in methods' },
    };
  }

  if (code === 'auth/email-already-in-use') {
    return {
      tone: 'form',
      title: 'Account already exists',
      detail: 'This email is already registered. Sign in instead, or use a different email.',
    };
  }

  if (code === 'auth/weak-password') {
    return {
      tone: 'form',
      title: 'Weak password',
      detail: 'Choose a stronger password (at least 6 characters).',
    };
  }

  if (code === 'auth/invalid-email') {
    return {
      tone: 'form',
      title: 'Invalid email',
      detail: 'Check the email format and try again.',
    };
  }

  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
    return {
      tone: 'form',
      title: 'Could not sign in',
      detail: 'Wrong email or password, or no account for this email. Try again or create an account.',
    };
  }

  if (code === 'auth/too-many-requests') {
    return {
      tone: 'form',
      title: 'Too many attempts',
      detail: 'Wait a few minutes, then try again.',
    };
  }

  if (code === 'auth/argument-error') {
    if (flow === 'google') {
      return {
        tone: 'form',
        title: 'Google sign-in could not start',
        detail:
          'Try again in Chrome or Edge (not an in-app browser), allow popups for this site, or we will use a full-page sign-in redirect next.',
      };
    }
    if (flow === 'email-signup') {
      return {
        tone: 'form',
        title: 'Could not create account',
        detail:
          'Use a valid email and a password of 6+ characters (letters, numbers, symbols). Re-type them manually if autofill is acting up.',
      };
    }
    return {
      tone: 'form',
      title: 'Could not sign in',
      detail:
        'Check email and password, re-type if needed, and make sure the browser is not blocking the page.',
    };
  }

  if (code === 'auth/popup-blocked' || code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
    return {
      tone: 'form',
      title: 'Google sign-in interrupted',
      detail:
        'Allow popups for this site, or try again. If you were redirected, complete Google and return to this site.',
    };
  }

  return {
    tone: 'form',
    title: 'Sign-in failed',
    detail: rawMessage,
  };
}
