/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { CandidateDashboard } from './pages/CandidateDashboard';
import { ResumeBuilder } from './components/resume/ResumeBuilder';
import { DocumentManager } from './components/documents/DocumentManager';
import { CandidateSearch } from './components/admin/CandidateSearch';
import { ReportsDashboard } from './components/admin/ReportsDashboard';
import { CandidateTracker } from './components/admin/CandidateTracker';
import { PaymentTracker } from './components/admin/PaymentTracker';
import { SettingsPage } from './pages/SettingsPage';
import { AlumnusDashboard } from './pages/AlumnusDashboard';
import { CandidateProfilePage } from './pages/CandidateProfilePage';
import { canOpenNav, homeNavId, sessionRole, type AppRole } from './lib/staffAccounts';

const AppContent: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const role: AppRole = sessionRole(profile?.role, false);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-brand-page font-mono text-sm text-brand-fg">
        <div className="text-center">
          <p className="animate-pulse">Starting up...</p>
          <div className="mx-auto mt-4 h-1.5 w-48 overflow-hidden rounded-full bg-brand-cyan-dim/30">
            <div className="hrm-loading-bar" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderContent = () => {
    const tab = activeTab === 'dashboard' ? 'dashboard' : activeTab;
    const allowed = tab === 'dashboard' || canOpenNav(role, tab);
    const screen = allowed ? tab : 'dashboard';

    if (screen === 'dashboard') {
      if (role === 'alumnus') return <AlumnusDashboard />;
      if (role === 'candidate') return <CandidateDashboard />;
      const home = homeNavId(role);
      if (home === 'tracker') return <CandidateTracker />;
      if (home === 'payments') return <PaymentTracker />;
      if (home === 'search') return <CandidateSearch />;
      return <ReportsDashboard />;
    }

    switch (screen) {
      case 'resume':
        return <ResumeBuilder />;
      case 'documents':
        return <DocumentManager />;
      case 'candidate-profile':
        return <CandidateProfilePage />;
      case 'search':
        return <CandidateSearch />;
      case 'reports':
        return <ReportsDashboard />;
      case 'tracker':
        return <CandidateTracker />;
      case 'payments':
        return <PaymentTracker />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <CandidateDashboard />;
    }
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
