'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, RefreshCcw, Users, Wallet, Briefcase, CalendarCheck, Timer, FolderKanban, Target, ClipboardList } from 'lucide-react';
import { hrmGetReportSummary } from '@/api/hrmReports';
import HrmOfflineBanner from '@/components/hrm/ui/HrmOfflineBanner';
import HrmSkeleton from '@/components/hrm/ui/HrmSkeleton';
import { canCallHrmApi } from '@/lib/hrmConstants';
import { useHrmAuthStore } from '@/store/hrmAuthStore';

const HrmReportsModule: React.FC = () => {
  const token = useHrmAuthStore((s) => s.token);
  const apiReady = canCallHrmApi(token);
  const summary = useQuery({
    queryKey: ['hrm', 'report-summary', token],
    queryFn: () => hrmGetReportSummary(token),
    staleTime: 30_000,
    enabled: apiReady,
  });

  const cards = summary.data
    ? [
        { label: 'Employees (active)', value: summary.data.employees.active, sub: `of ${summary.data.employees.total} total`, icon: Users },
        { label: 'Payroll runs', value: summary.data.payrollRuns, sub: 'all time', icon: Wallet },
        { label: 'Open job postings', value: summary.data.openJobs, sub: 'published / active', icon: Briefcase },
        { label: 'Pending leave', value: summary.data.pendingLeaveRequests, sub: 'requests', icon: CalendarCheck },
        { label: 'Attendance rows (month)', value: summary.data.attendanceRecordsThisMonth, sub: 'current month', icon: Timer },
        { label: 'Documents', value: summary.data.documents, sub: 'stored', icon: FolderKanban },
        { label: 'Goals', value: summary.data.goals, sub: 'all cycles', icon: Target },
        { label: 'Performance reviews', value: summary.data.performanceReviews, sub: 'records', icon: ClipboardList },
      ]
    : [];

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/40 bg-white/70 p-5 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
        <div>
          <h4 className="text-xl font-black text-slate-900">Reports</h4>
          <p className="text-sm font-medium text-slate-500">Live snapshot from your HRM database.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!apiReady}
            onClick={() => {
              void summary.refetch();
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCcw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      <HrmOfflineBanner token={token} />

      {!apiReady ? (
        <p className="text-sm font-medium text-slate-500">Connect the API to load the report summary.</p>
      ) : summary.isLoading ? (
        <HrmSkeleton lines={6} />
      ) : summary.isError ? (
        <p className="text-sm font-medium text-red-600">{(summary.error as Error).message}</p>
      ) : summary.data ? (
        <>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Generated {new Date(summary.data.generatedAt).toLocaleString()}
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.label}
                  className="rounded-3xl border border-white/40 bg-white/70 p-6 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)]"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-500">{c.label}</span>
                    <div className="rounded-2xl bg-blue-50 p-2 text-blue-600">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="text-3xl font-black text-slate-900">{c.value}</p>
                  <p className="mt-1 text-sm font-medium text-slate-500">{c.sub}</p>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Export CSV and scheduled reports can be added next; this dashboard reads live D1 aggregates.
          </div>
        </>
      ) : null}
    </section>
  );
};

export default HrmReportsModule;
