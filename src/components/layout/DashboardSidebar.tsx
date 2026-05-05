import React from 'react';
import { X, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SiteBrandMark } from '../brand/SiteBrandMark';
import type { DashboardNavItem } from './dashboardNav';

type Props = {
  items: DashboardNavItem[];
  activeTab: string;
  onNavigate: (id: string) => void;
  onRequestClose: () => void;
  profileName: string | null | undefined;
  profileEmail: string | null | undefined;
  roleLabel: string;
  avatarLetter: string;
  onLogout: () => void | Promise<void>;
};

export const DashboardSidebar: React.FC<Props> = ({
  items,
  activeTab,
  onNavigate,
  onRequestClose,
  profileName,
  profileEmail,
  roleLabel,
  avatarLetter,
  onLogout,
}) => {
  return (
    <aside
      className={cn(
        'flex h-full w-[min(288px,90vw)] max-w-[288px] shrink-0 flex-col overflow-hidden',
        'border-r border-slate-200/90 bg-white shadow-[4px_0_24px_-8px_rgba(15,23,42,0.08)]',
        /* Mobile drawer */
        'fixed left-0 top-0 z-50 lg:relative lg:z-auto lg:max-w-[272px] lg:w-[272px] lg:shadow-none',
      )}
      aria-label="Main navigation"
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-b from-slate-50/80 to-white px-4 py-3.5">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex min-w-0 items-center gap-2">
            <SiteBrandMark className="h-8 w-auto max-w-[min(200px,70vw)] sm:h-9" priority />
            <span className="shrink-0 rounded-md bg-brand-info-bg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-cyan-dim">
              HRM
            </span>
          </div>
          <p className="truncate pl-0.5 text-[11px] text-brand-fg-muted">Workspace</p>
        </div>
        <button
          type="button"
          onClick={onRequestClose}
          className="rounded-lg p-2 text-brand-fg-muted transition-colors hover:bg-slate-100 hover:text-brand-fg lg:hidden"
          aria-label="Close navigation"
        >
          <X size={20} strokeWidth={2} />
        </button>
      </div>

      <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto overflow-x-hidden px-2 py-3" role="navigation">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-fg-muted">Menu</p>
        <ul className="space-y-0.5">
          {items.map((item) => {
            const active = activeTab === item.id;
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-150',
                    active
                      ? 'bg-gradient-to-r from-brand-info-bg to-brand-info-bg/50 text-brand-fg shadow-sm ring-1 ring-brand-cyan/20'
                      : 'text-brand-fg-muted hover:bg-slate-100 hover:text-brand-fg',
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <span
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
                      active ? 'bg-white text-brand-cyan shadow-sm' : 'bg-slate-100/80 text-brand-cyan-dim group-hover:bg-white group-hover:text-brand-cyan',
                    )}
                  >
                    <Icon size={18} strokeWidth={active ? 2.25 : 2} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {active ? (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-cyan shadow-[0_0_8px_rgba(0,168,201,0.6)]" aria-hidden />
                  ) : null}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-slate-100 bg-slate-50/60 p-3">
        <div className="mb-2 flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-cyan to-brand-cyan-dim text-sm font-bold text-white shadow-md ring-2 ring-white">
            {avatarLetter}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-brand-fg">{profileName || 'User'}</p>
            <p className="truncate text-[11px] text-brand-fg-muted">{profileEmail || '—'}</p>
            <p className="mt-0.5 truncate text-[10px] font-bold uppercase tracking-wide text-brand-cyan-dim">{roleLabel}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void onLogout()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200/90 bg-white py-2.5 text-sm font-semibold text-brand-fg-muted transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut size={17} strokeWidth={2} aria-hidden />
          Sign out
        </button>
      </div>
    </aside>
  );
};
