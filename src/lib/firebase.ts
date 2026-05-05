import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { resolveFirebaseConfig } from './resolveFirebaseConfig';

const firebaseConfig = resolveFirebaseConfig();
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

/** Explicit `gs://` bucket avoids default-bucket resolution issues on some hosts. */
const bucket = firebaseConfig.storageBucket?.trim();
export const storage =
  bucket && bucket.length > 0
    ? getStorage(app, bucket.startsWith('gs://') ? bucket : `gs://${bucket}`)
    : getStorage(app);

/**
 * Single web Auth instance. Using getAuth (not initializeAuth) avoids edge cases
 * with persistence + HMR/StrictMode that can surface as auth/argument-error.
 */
export const auth = getAuth(app);

export { signOut };

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'system', 'health'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.error('Firebase connection failed. Check configuration.');
    }
  }
}

testConnection();
