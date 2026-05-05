import React from 'react';
import { Menu, PanelLeftClose, ChevronRight } from 'lucide-react';

type Props = {
  title: string;
  /** When false, show “open menu” (mobile + when sidebar collapsed on desktop). */
  sidebarOpen: boolean;
  onOpenSidebar: () => void;
  onCollapseSidebar: () => void;
};

export const DashboardHeader: React.FC<Props> = ({ title, sidebarOpen, onOpenSidebar, onCollapseSidebar }) => {
  return (
    <header className="sticky top-0 z-20 flex h-[3.75rem] shrink-0 items-center justify-between gap-4 border-b border-slate-200/90 bg-white/90 px-4 shadow-sm backdrop-blur-md sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        {!sidebarOpen ? (
          <button
            type="button"
            onClick={onOpenSidebar}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-brand-fg shadow-sm transition-all hover:border-brand-cyan/30 hover:bg-brand-info-bg/40"
            aria-label="Open navigation"
          >
            <Menu size={20} strokeWidth={2} />
          </button>
        ) : (
          <button
            type="button"
            onClick={onCollapseSidebar}
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-brand-fg-muted shadow-sm transition-all hover:bg-slate-50 lg:flex"
            aria-label="Hide navigation panel"
            title="Hide sidebar"
          >
            <PanelLeftClose size={20} strokeWidth={2} />
          </button>
        )}

        <div className="min-w-0 flex items-center gap-1.5 text-brand-fg-muted">
          <span className="hidden text-xs font-medium sm:inline">Workspace</span>
          <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 opacity-50 sm:block" aria-hidden />
          <h1 className="truncate text-base font-bold tracking-tight text-brand-fg sm:text-lg">{title}</h1>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div
          className="flex items-center gap-2 rounded-full border border-emerald-200/90 bg-emerald-50/90 py-1.5 pl-2.5 pr-3 shadow-sm"
          role="status"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[11px] font-semibold text-emerald-900 sm:text-xs">Online</span>
        </div>
      </div>
    </header>
  );
};
