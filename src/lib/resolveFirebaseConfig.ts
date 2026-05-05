import type { FirebaseOptions } from 'firebase/app';
import fallback from '../../firebase-applet-config.json';

export type AppletFirebaseConfig = FirebaseOptions & {
  firestoreDatabaseId: string;
};

/**
 * Merges `VITE_FIREBASE_*` (AI Studio / CI / `.env`) over `firebase-applet-config.json`.
 * Any set env var overrides the JSON default for that field.
 */
export function resolveFirebaseConfig(): AppletFirebaseConfig {
  const env = import.meta.env;
  const v = (key: keyof ImportMetaEnv) =>
    (env[key] as string | undefined)?.trim();

  const base = {...fallback} as AppletFirebaseConfig;

  const k = v('VITE_FIREBASE_API_KEY');
  if (k) { base.apiKey = k; }
  const ad = v('VITE_FIREBASE_AUTH_DOMAIN');
  if (ad) { base.authDomain = ad; }
  const pid = v('VITE_FIREBASE_PROJECT_ID');
  if (pid) { base.projectId = pid; }
  const sb = v('VITE_FIREBASE_STORAGE_BUCKET');
  if (sb) { base.storageBucket = sb; }
  const mid = v('VITE_FIREBASE_MESSAGING_SENDER_ID');
  if (mid) { base.messagingSenderId = mid; }
  const appId = v('VITE_FIREBASE_APP_ID');
  if (appId) { base.appId = appId; }
  const measure = v('VITE_FIREBASE_MEASUREMENT_ID');
  if (measure) { base.measurementId = measure; }
  const dbId = v('VITE_FIREBASE_FIRESTORE_DATABASE_ID');
  if (dbId) { base.firestoreDatabaseId = dbId; }

  return base;
}
