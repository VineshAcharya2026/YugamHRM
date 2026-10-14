import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  BarChart3,
  Plus,
  ClipboardList,
  Banknote,
  IdCard,
} from 'lucide-react';
import { canOpenNav, type AppRole } from '../../lib/staffAccounts';

export type DashboardNavId =
  | 'dashboard'
  | 'resume'
  | 'documents'
  | 'candidate-profile'
  | 'tracker'
  | 'search'
  | 'payments'
  | 'reports'
  | 'settings';

export interface DashboardNavItem {
  label: string;
  icon: LucideIcon;
  id: DashboardNavId;
  /** Informational. Visibility is decided by `canOpenNav`. */
  roles?: ('candidate' | 'alumnus' | 'admin')[];
}

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { label: 'Resume Builder', icon: FileText, id: 'resume', roles: ['candidate'] },
  { label: 'My Files', icon: Plus, id: 'documents', roles: ['candidate', 'alumnus'] },
  { label: 'Candidate Details', icon: IdCard, id: 'candidate-profile', roles: ['candidate'] },
  { label: 'Candidate Tracker', icon: ClipboardList, id: 'tracker', roles: ['admin'] },
  { label: 'Candidate List', icon: Users, id: 'search', roles: ['admin'] },
  { label: 'Payments', icon: Banknote, id: 'payments', roles: ['admin'] },
  { label: 'Reports', icon: BarChart3, id: 'reports', roles: ['admin'] },
  { label: 'Settings', icon: Settings, id: 'settings' },
];

export function filterDashboardNavItems(
  items: DashboardNavItem[],
  args: { role: string | undefined },
): DashboardNavItem[] {
  return items.filter((item) => canOpenNav((args.role || 'candidate') as AppRole, item.id));
}

export function getDashboardNavLabel(items: DashboardNavItem[], activeId: string): string {
  return items.find((i) => i.id === activeId)?.label ?? 'Dashboard';
}
