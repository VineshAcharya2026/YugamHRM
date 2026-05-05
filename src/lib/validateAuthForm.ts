const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LEN = 254;
const MAX_PASSWORD_LEN = 4096;

export type NormalizedCredentials = { email: string; password: string };

/**
 * Coerces React state / autofill values to plain strings Firebase always accepts.
 */
export function normalizeCredentials(
  rawEmail: unknown,
  rawPassword: unknown,
): NormalizedCredentials {
  const email = String(rawEmail ?? '').trim();
  const password = String(rawPassword ?? '');
  return { email, password };
}

/**
 * Returns an error message or null if input is valid for Firebase email/password.
 */
export function validateEmailAndPassword(
  email: string,
  password: string,
  isSignUp: boolean,
): string | null {
  if (!email) {
    return 'Enter your email address.';
  }
  if (email.length > MAX_EMAIL_LEN) {
    return 'Email is too long.';
  }
  if (!EMAIL_RE.test(email)) {
    return 'Enter a valid email address.';
  }
  if (password.length > MAX_PASSWORD_LEN) {
    return 'Password is too long.';
  }
  if (password.length === 0 || !/\S/.test(password)) {
    return 'Enter a password (cannot be only spaces).';
  }
  if (isSignUp && password.length < 6) {
    return 'Password must be at least 6 characters.';
  }
  return null;
}
