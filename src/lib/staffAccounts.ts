import type { DashboardNavId } from '../components/layout/dashboardNav';
import type { EmployeeProfile } from './masterAdmin';

export type AppRole =
  | 'master'
  | 'hr'
  | 'placements'
  | 'operations'
  | 'accounts'
  | 'support'
  | 'candidate'
  | 'alumnus';

export type StaffRole = Exclude<AppRole, 'candidate' | 'alumnus'>;

export interface StaffAccount {
  email: string;
  role: StaffRole;
  displayName: string;
  /** Sidebar destinations. `dashboard` is the role home. */
  nav: readonly DashboardNavId[];
  employeeProfile?: EmployeeProfile;
}

const ALL_NAV: readonly DashboardNavId[] = [
  'dashboard',
  'resume',
  'documents',
  'candidate-profile',
  'tracker',
  'search',
  'payments',
  'reports',
  'settings',
];

export const STAFF_ACCOUNTS: readonly StaffAccount[] = [
  {
    email: 'vinesh@softivoxtech.com',
    role: 'master',
    displayName: 'Vinesh',
    nav: ALL_NAV,
  },
  {
    email: 'sindhu@softivoxtech.com',
    role: 'hr',
    displayName: 'Sindhu Vellingiri',
    nav: ['dashboard', 'tracker', 'search', 'reports'],
    employeeProfile: {
      fullName: 'Sindhu Vellingiri',
      contactNo: '7708383721',
      designation: 'HR Executive',
      bloodGroup: 'O+ve',
      address: '108 Vaikkal st\nKalingarayanpalayam\nErode 638301',
    },
  },
  {
    email: 'hr@softivoxtech.com',
    role: 'hr',
    displayName: 'HR',
    nav: ['dashboard', 'tracker', 'search', 'reports'],
  },
  {
    email: 'vidhya@softivoxtech.com',
    role: 'placements',
    displayName: 'Vidhya',
    nav: ['dashboard', 'tracker', 'search'],
  },
  {
    email: 'videsh@softivoxtech.com',
    role: 'operations',
    displayName: 'Videsh',
    nav: ['dashboard', 'search', 'reports'],
  },
  {
    email: 'accounts@softivoxtech.com',
    role: 'accounts',
    displayName: 'Accounts',
    nav: ['dashboard', 'payments', 'reports'],
  },
  {
    email: 'support@softivoxtech.com',
    role: 'support',
    displayName: 'Support',
    nav: ['dashboard', 'search'],
  },
];

const STAFF_BY_EMAIL = new Map(STAFF_ACCOUNTS.map((account) => [account.email, account]));

export function normalizeEmail(email: string | null | undefined): string {
  return (email ?? '').toLowerCase().trim();
}

export function findStaffAccount(email: string | null | undefined): StaffAccount | undefined {
  return STAFF_BY_EMAIL.get(normalizeEmail(email));
}

export function isStaffEmail(email: string | null | undefined): boolean {
  return findStaffAccount(email) != null;
}

export function isGoogleUser(providerIds: readonly string[]): boolean {
  return providerIds.includes('google.com');
}

const STAFF_ROLES: readonly StaffRole[] = ['master', 'hr', 'placements', 'operations', 'accounts', 'support'];

/** Map a stored Firestore role to the session role. Google sessions are always candidates. */
export function sessionRole(storedRole: string | null | undefined, signedInWithGoogle: boolean): AppRole {
  if (signedInWithGoogle) return 'candidate';
  if (storedRole === 'admin' || storedRole === 'master') return 'master';
  if (storedRole === 'alumnus') return 'alumnus';
  if (storedRole && (STAFF_ROLES as readonly string[]).includes(storedRole)) {
    return storedRole as StaffRole;
  }
  return 'candidate';
}

export function roleLabel(role: string | null | undefined): string {
  switch (role) {
    case 'master':
      return 'Master admin';
    case 'hr':
      return 'HR';
    case 'placements':
      return 'Placements';
    case 'operations':
      return 'Operations';
    case 'accounts':
      return 'Accounts';
    case 'support':
      return 'Support';
    case 'alumnus':
      return 'Alumnus';
    default:
      return 'Candidate';
  }
}

export function canWriteCandidates(role: AppRole): boolean {
  return role === 'master' || role === 'hr' || role === 'placements';
}

export function canReadCandidates(role: AppRole): boolean {
  return canWriteCandidates(role) || role === 'operations' || role === 'accounts' || role === 'support';
}

export function homeNavId(role: AppRole): DashboardNavId {
  switch (role) {
    case 'placements':
      return 'tracker';
    case 'accounts':
      return 'payments';
    case 'support':
      return 'search';
    case 'master':
    case 'hr':
    case 'operations':
      return 'reports';
    default:
      return 'dashboard';
  }
}

export function canOpenNav(role: AppRole, navId: string): boolean {
  if (role === 'master') return true;
  const staff = STAFF_ACCOUNTS.find((account) => account.role === role);
  if (staff) return staff.nav.includes(navId as DashboardNavId);
  if (role === 'alumnus') {
    return navId === 'dashboard' || navId === 'documents' || navId === 'settings';
  }
  return navId === 'dashboard' || navId === 'resume' || navId === 'documents' || navId === 'candidate-profile' || navId === 'settings';
}
