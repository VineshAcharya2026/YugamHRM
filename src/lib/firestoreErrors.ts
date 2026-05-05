/** User-facing message for Firestore / network failures. */
export function firestoreErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'code' in err) {
    const code = String((err as { code: string }).code);
    if (code === 'permission-denied') {
      return 'You do not have permission to load this data. Try signing in with the right account.';
    }
    if (code === 'unavailable' || code === 'deadline-exceeded') {
      return 'Service is temporarily unavailable. Check your connection and try again.';
    }
  }
  return err instanceof Error ? err.message : 'Something went wrong loading data.';
}
