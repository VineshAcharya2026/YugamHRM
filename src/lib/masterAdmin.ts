/**
 * Master administrators — full HRM access (candidates, companies, CRUD, approvals).
 * Keep emails in sync with Firestore `isAdmin()` and Storage rules.
 *
 * For Sindhu: create a Firebase Authentication user with `SINDHU_MASTER_EMAIL`
 * (same password flow as other users), then sign in once — profile fields seed automatically.
 */
export const MASTER_ADMIN_EMAIL = 'vineshjm@gmail.com' as const;

/** Second master (HR) — must match Firebase Auth email exactly. */
export const SINDHU_MASTER_EMAIL = 'sindhu@yugamcloud.online' as const;

export const MASTER_ADMIN_EMAILS = [MASTER_ADMIN_EMAIL, SINDHU_MASTER_EMAIL] as const;

/** Default HR record for Sindhu’s master account (dashboard / Settings). */
export const SINDHU_MASTER_EMPLOYEE_PROFILE = {
  fullName: 'Sindhu Vellingiri',
  contactNo: '7708383721',
  designation: 'HR Executive',
  bloodGroup: 'O+ve',
  address: '108 Vaikkal st\nKalingarayanpalayam\nErode 638301',
} as const;

export type EmployeeProfile = {
  fullName?: string | null;
  contactNo?: string | null;
  designation?: string | null;
  bloodGroup?: string | null;
  address?: string | null;
};

export function isMasterAdminEmail(email: string | null | undefined): boolean {
  if (!email) {
    return false;
  }
  const n = email.toLowerCase().trim();
  return (MASTER_ADMIN_EMAILS as readonly string[]).includes(n);
}

/** True only for Sindhu’s master login (used to seed HR fields). */
export function isSindhuMasterEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase().trim() === SINDHU_MASTER_EMAIL;
}

function employeeProfileNeedsSeed(ep: EmployeeProfile | null | undefined): boolean {
  if (!ep) return true;
  return !String(ep.contactNo ?? '').trim();
}

export function shouldSeedSindhuEmployeeProfile(
  email: string | null | undefined,
  ep: EmployeeProfile | null | undefined,
): boolean {
  return isSindhuMasterEmail(email) && employeeProfileNeedsSeed(ep);
}

/**
 * Resolves profile role: master always has admin in the app and in Firestore.
 */
export function resolveRoleForUser(
  email: string | null,
  defaultRole: 'admin' | 'candidate' | 'alumnus',
): 'admin' | 'candidate' | 'alumnus' {
  if (isMasterAdminEmail(email)) {
    return 'admin';
  }
  return defaultRole;
}
