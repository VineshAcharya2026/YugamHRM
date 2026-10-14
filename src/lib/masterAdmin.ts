/**
 * Legacy helpers. Staff access now lives in `staffAccounts.ts`.
 * Google sign-in is always a candidate. Staff roles are seeded with the Admin SDK.
 */

export const MASTER_ADMIN_EMAIL = 'vinesh@softivoxtech.com' as const;

/** HR desk login. Not a master account. */
export const SINDHU_MASTER_EMAIL = 'sindhu@softivoxtech.com' as const;

export const MASTER_ADMIN_EMAILS = [MASTER_ADMIN_EMAIL] as const;

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

/** Email alone never grants master access. Session role comes from the seeded profile, and only on password sign-in. */
export function isMasterAdminEmail(_email: string | null | undefined): boolean {
  return false;
}

export function isSindhuMasterEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase().trim() === SINDHU_MASTER_EMAIL;
}

/** Client sign-in no longer writes staff profile fields. The seed script owns them. */
export function shouldSeedSindhuEmployeeProfile(
  _email: string | null | undefined,
  _ep: EmployeeProfile | null | undefined,
): boolean {
  return false;
}

export function resolveRoleForUser(
  _email: string | null,
  defaultRole: 'candidate' | 'alumnus',
): 'candidate' | 'alumnus' {
  return defaultRole;
}
