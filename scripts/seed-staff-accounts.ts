/**
 * Create or update the seven Softivox staff logins in Firebase Auth and Firestore.
 *
 * Prerequisites (repo root):
 * 1. Service account JSON with Firebase Auth Admin and Firestore access.
 * 2. `.env.seed` (gitignored), copied from `.env.seed.example`:
 *      FIREBASE_SERVICE_ACCOUNT_KEY=C:\path\to\serviceAccount.json
 *      STAFF_DEFAULT_PASSWORD=choose-a-password-8-chars-or-more
 * 3. `npm run seed:staff`
 *
 * Existing users keep their uid. The password is reset to STAFF_DEFAULT_PASSWORD.
 * Google sign-in is not linked. Those accounts stay email/password staff desks.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: resolve(process.cwd(), '.env.seed') });
import { initializeApp, cert, getApps, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { STAFF_ACCOUNTS } from '../src/lib/staffAccounts.ts';

function loadServiceAccount(): Record<string, unknown> {
  const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (!keyPath || !String(keyPath).trim()) {
    throw new Error(
      'Set FIREBASE_SERVICE_ACCOUNT_KEY (path to service account JSON) or GOOGLE_APPLICATION_CREDENTIALS.',
    );
  }
  const abs = resolve(String(keyPath).trim());
  if (!existsSync(abs)) {
    throw new Error(`Service account file not found: ${abs}`);
  }
  return JSON.parse(readFileSync(abs, 'utf8')) as Record<string, unknown>;
}

function getApp(): App {
  if (getApps().length > 0) {
    return getApps()[0]!;
  }
  const sa = loadServiceAccount();
  return initializeApp({ credential: cert(sa as Parameters<typeof cert>[0]) });
}

async function main(): Promise<void> {
  const password = process.env.STAFF_DEFAULT_PASSWORD?.trim();
  if (!password || password.length < 8) {
    throw new Error('Set STAFF_DEFAULT_PASSWORD (at least 8 characters) in .env.seed.');
  }

  const app = getApp();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const now = new Date().toISOString();

  for (const account of STAFF_ACCOUNTS) {
    const email = account.email.toLowerCase();
    let uid: string;
    try {
      const existing = await auth.getUserByEmail(email);
      uid = existing.uid;
      await auth.updateUser(uid, {
        password,
        emailVerified: true,
        displayName: account.displayName,
      });
      console.log(`Updated ${email} (${account.role}, uid=${uid})`);
    } catch (e: unknown) {
      const code = e && typeof e === 'object' && e !== null && 'code' in e ? String((e as { code: string }).code) : '';
      if (code !== 'auth/user-not-found') throw e;
      const created = await auth.createUser({
        email,
        password,
        emailVerified: true,
        displayName: account.displayName,
      });
      uid = created.uid;
      console.log(`Created ${email} (${account.role}, uid=${uid})`);
    }

    const userRef = db.collection('users').doc(uid);
    const snap = await userRef.get();
    const payload: Record<string, unknown> = {
      uid,
      email,
      role: account.role,
      displayName: account.displayName,
      photoURL: null,
      employeeProfile: account.employeeProfile ?? null,
      employeeProfileUpdatedAt: now,
    };
    if (!snap.exists) payload.createdAt = now;
    await userRef.set(payload, { merge: true });
  }

  console.log('Done. Staff sign in with email and STAFF_DEFAULT_PASSWORD. Google sign-in stays a candidate.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
