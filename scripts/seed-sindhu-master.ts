/**
 * Create / update the Sindhu master account in Firebase Auth and seed `users/{uid}` in Firestore.
 *
 * Prerequisites:
 * 1. Service account JSON with "Firebase Authentication Admin" + Cloud Datastore/Firestore access
 *    (Firebase Console → Project settings → Service accounts → Generate new private key).
 * 2. Either copy `.env.seed.example` → `.env.seed` (gitignored) and set vars, or set in shell:
 *      $env:FIREBASE_SERVICE_ACCOUNT_KEY="C:\path\to\serviceAccount.json"
 *      $env:SINDHU_MASTER_PASSWORD="YourSecurePassword8+"
 * 3. Run from repo root: `npm run seed:sindhu`
 *
 * If the Auth user already exists, this script updates the password (when SINDHU_MASTER_PASSWORD is set)
 * and merges the Firestore profile so role + employee fields match master seeding.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: resolve(process.cwd(), '.env.seed') });
import { initializeApp, cert, getApps, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import {
  SINDHU_MASTER_EMAIL,
  SINDHU_MASTER_EMPLOYEE_PROFILE,
} from '../src/lib/masterAdmin.ts';

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
  const password = process.env.SINDHU_MASTER_PASSWORD?.trim();
  if (!password || password.length < 8) {
    throw new Error('Set SINDHU_MASTER_PASSWORD (at least 8 characters) for the Auth account.');
  }

  const app = getApp();
  const auth = getAuth(app);
  const db = getFirestore(app);

  const email = SINDHU_MASTER_EMAIL.toLowerCase();
  const now = new Date().toISOString();
  const employeeProfile = { ...SINDHU_MASTER_EMPLOYEE_PROFILE };

  let uid: string;
  try {
    const existing = await auth.getUserByEmail(email);
    uid = existing.uid;
    await auth.updateUser(uid, {
      password,
      emailVerified: true,
      displayName: SINDHU_MASTER_EMPLOYEE_PROFILE.fullName,
    });
    console.log(`Updated existing Auth user: ${email} (uid=${uid})`);
  } catch (e: unknown) {
    const code = e && typeof e === 'object' && e !== null && 'code' in e ? String((e as { code: string }).code) : '';
    if (code === 'auth/user-not-found') {
      const created = await auth.createUser({
        email,
        password,
        emailVerified: true,
        displayName: SINDHU_MASTER_EMPLOYEE_PROFILE.fullName,
      });
      uid = created.uid;
      console.log(`Created Auth user: ${email} (uid=${uid})`);
    } else {
      throw e;
    }
  }

  const userRef = db.collection('users').doc(uid);
  const snap = await userRef.get();
  const payload: Record<string, unknown> = {
    uid,
    email,
    role: 'hr',
    displayName: SINDHU_MASTER_EMPLOYEE_PROFILE.fullName,
    photoURL: null,
    employeeProfile,
    employeeProfileUpdatedAt: now,
  };
  if (!snap.exists) {
    payload.createdAt = now;
  }
  await userRef.set(payload, { merge: true });

  console.log(`Seeded Firestore users/${uid} (hr + employeeProfile).`);
  console.log('Done. Sindhu can sign in at the HRM portal with the email above and SINDHU_MASTER_PASSWORD.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
