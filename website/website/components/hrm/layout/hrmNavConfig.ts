import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  Wallet,
  UserRoundSearch,
  CalendarCheck,
  Timer,
  Target,
  FolderKanban,
  BarChart3,
  Settings,
} from 'lucide-react';
import { HRM_MODULES } from '@/lib/hrmModules';
import type { HrmModuleKey } from '@/types';

export const HRM_MODULE_ICONS: Record<HrmModuleKey, LucideIcon> = {
  employees: Users,
  payroll: Wallet,
  recruitment: UserRoundSearch,
  leaves: CalendarCheck,
  attendance: Timer,
  performance: Target,
  documents: FolderKanban,
  reports: BarChart3,
  settings: Settings,
};

export type HrmNavEntry = {
  label: string;
  href: string;
  icon: LucideIcon;
  match: (pathname: string) => boolean;
};

export const HRM_NAV_ENTRIES: HrmNavEntry[] = [
  {
    label: 'Overview',
    href: '/hrm/dashboard',
    icon: LayoutDashboard,
    match: (pathname: string) => pathname === '/hrm/dashboard',
  },
  ...HRM_MODULES.map((m) => ({
    label: m.title,
    href: m.route,
    icon: HRM_MODULE_ICONS[m.key],
    match: (pathname: string) => pathname === m.route || pathname.startsWith(`${m.route}/`),
  })),
];
