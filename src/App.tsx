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
import { SettingsPage } from './pages/SettingsPage';
import { AlumnusDashboard } from './pages/AlumnusDashboard';

const AppContent: React.FC = () => {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#E4E3E0] font-mono text-sm">
        <div className="text-center">
          <p className="animate-pulse">Starting up...</p>
          <div className="mt-4 w-48 h-1 bg-[#141414]/10 mx-auto overflow-hidden">
            <div className="h-full bg-[#141414] animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderContent = () => {
    // Role-based root dashboard
    if (activeTab === 'dashboard') {
      if (profile?.role === 'admin') return <ReportsDashboard />;
      if (profile?.role === 'alumnus') return <AlumnusDashboard />;
      return <CandidateDashboard />;
    }

    switch (activeTab) {
      case 'resume':
        return <ResumeBuilder />;
      case 'documents':
        return <DocumentManager />;
      case 'search':
        return <CandidateSearch />;
      case 'reports':
        return <ReportsDashboard />;
      case 'tracker':
        return <CandidateTracker />;
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
