import type { HrmDashboardModule, HrmModuleKey } from '@/types';

/** Single source for HRM module metadata (App Router paths). */
export const HRM_MODULES: readonly HrmDashboardModule[] = [
  {
    key: 'employees',
    title: 'Employees',
    description: 'Employee directory, profile, and org data.',
    status: 'live',
    route: '/hrm/employees',
  },
  {
    key: 'payroll',
    title: 'Payroll',
    description: 'Run payroll and review monthly payslips.',
    status: 'live',
    route: '/hrm/payroll',
  },
  {
    key: 'recruitment',
    title: 'Recruitment',
    description: 'Candidate pipeline, jobs, and interviews.',
    status: 'live',
    route: '/hrm/recruitment',
  },
  {
    key: 'leaves',
    title: 'Leaves',
    description: 'Leave request workflow and balances.',
    status: 'live',
    route: '/hrm/leaves',
  },
  {
    key: 'attendance',
    title: 'Attendance',
    description: 'Time tracking and attendance calendar.',
    status: 'live',
    route: '/hrm/attendance',
  },
  {
    key: 'performance',
    title: 'Performance',
    description: 'Review cycles, goals, and ratings.',
    status: 'live',
    route: '/hrm/performance',
  },
  {
    key: 'documents',
    title: 'Documents',
    description: 'Employee and company document center.',
    status: 'live',
    route: '/hrm/documents',
  },
  {
    key: 'reports',
    title: 'Reports',
    description: 'Headcount, payroll, and compliance reports.',
    status: 'live',
    route: '/hrm/reports',
  },
  {
    key: 'settings',
    title: 'Settings',
    description: 'Roles, policies, structures, and company setup.',
    status: 'live',
    route: '/hrm/settings',
  },
];

const keySet = new Set<string>(HRM_MODULES.map((m) => m.key));

export function isHrmModuleKey(value: string): value is HrmModuleKey {
  return keySet.has(value);
}

export function getHrmModuleMeta(key: HrmModuleKey): { title: string; isLive: boolean } {
  const m = HRM_MODULES.find((mod) => mod.key === key);
  if (!m) return { title: 'Module', isLive: false };
  return { title: m.title, isLive: m.status === 'live' };
}
