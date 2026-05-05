/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Public site URL; optional — defaults to `window.location.origin` in the browser. */
  readonly VITE_APP_URL: string;
  /** Marketing site origin/path (e.g. `http://localhost:3000` for Next in dev). Optional when same host as HRM. */
  readonly VITE_MARKETING_URL: string;
  readonly VITE_FIREBASE_API_KEY: string;
  readonly VITE_FIREBASE_AUTH_DOMAIN: string;
  readonly VITE_FIREBASE_PROJECT_ID: string;
  readonly VITE_FIREBASE_STORAGE_BUCKET: string;
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string;
  readonly VITE_FIREBASE_APP_ID: string;
  readonly VITE_FIREBASE_MEASUREMENT_ID: string;
  /** Firestore database id, e.g. `(default)`. */
  readonly VITE_FIREBASE_FIRESTORE_DATABASE_ID: string;
  readonly VITE_GEMINI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
