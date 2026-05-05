import React, { useMemo, useState } from 'react';
import { Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { DASHBOARD_NAV_ITEMS, filterDashboardNavItems, getDashboardNavLabel } from './dashboardNav';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';

export const DashboardLayout: React.FC<{
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (id: string) => void;
}> = ({ children, activeTab, onTabChange }) => {
  const { profile, logout, isMaster } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filteredNavItems = useMemo(
    () => filterDashboardNavItems(DASHBOARD_NAV_ITEMS, { role: profile?.role, isMaster }),
    [profile?.role, isMaster],
  );

  const headerTitle = getDashboardNavLabel(DASHBOARD_NAV_ITEMS, activeTab);
  const avatarLetter = (profile?.displayName?.[0] || profile?.email?.[0] || 'U').toUpperCase();
  const roleLabel = isMaster ? 'Master admin' : (profile?.role ?? '—').toString();

  const handleNavigate = (id: string) => {
    onTabChange(id);
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-brand-page font-sans text-brand-fg">
      {sidebarOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-[1px] transition-opacity lg:hidden"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      {sidebarOpen ? (
        <DashboardSidebar
          items={filteredNavItems}
          activeTab={activeTab}
          onNavigate={handleNavigate}
          onRequestClose={() => setSidebarOpen(false)}
          profileName={profile?.displayName}
          profileEmail={profile?.email}
          roleLabel={roleLabel}
          avatarLetter={avatarLetter}
          onLogout={logout}
        />
      ) : null}

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-brand-page">
        <DashboardHeader
          title={headerTitle}
          sidebarOpen={sidebarOpen}
          onOpenSidebar={() => setSidebarOpen(true)}
          onCollapseSidebar={() => setSidebarOpen(false)}
        />

        <main className="hrm-scrollbar min-h-0 flex-1 overflow-y-auto bg-brand-page">
          <div className="mx-auto max-w-7xl p-6 pb-28 sm:p-8 md:p-12">{children}</div>
        </main>

        <footer className="flex h-7 shrink-0 select-none items-center justify-between gap-2 border-t border-slate-200/90 bg-white px-3 text-[9px] font-semibold text-brand-fg-muted sm:px-4">
          <div className="flex min-w-0 items-center gap-2 sm:gap-4">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-cyan shadow-sm" aria-hidden />
              <span className="hidden truncate sm:inline">Asia-Southeast1</span>
              <span className="truncate sm:hidden">GCP</span>
            </div>
            <span className="h-3 w-px shrink-0 bg-slate-200" aria-hidden />
            <span className="truncate font-mono opacity-90">{profile?.uid?.slice(0, 12).toUpperCase()}…</span>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <span className="hidden opacity-90 sm:inline">v2.4.0</span>
            <span className="h-3 w-px bg-slate-200" aria-hidden />
            <span className="flex items-center gap-1">
              <Shield size={10} className="text-brand-cyan-dim" aria-hidden />
              <span className="hidden sm:inline">TLS</span>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};
