'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Wallet } from 'lucide-react';
import { hrmGetPayrollRuns } from '@/api/hrmPayroll';
import HrmOfflineBanner from '@/components/hrm/ui/HrmOfflineBanner';
import HrmSkeleton from '@/components/hrm/ui/HrmSkeleton';
import { canCallHrmApi } from '@/lib/hrmConstants';
import { useHrmAuthStore } from '@/store/hrmAuthStore';

const HrmPayrollWidget: React.FC = () => {
  const token = useHrmAuthStore((state) => state.token);
  const query = useQuery({
    queryKey: ['hrm', 'payroll-runs', token],
    queryFn: () => hrmGetPayrollRuns(token),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    enabled: canCallHrmApi(token),
  });

  return (
    <article className="rounded-3xl border border-white/40 bg-white/70 p-6 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
      <header className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Payroll</h4>
        <Wallet className="h-5 w-5 text-blue-600" />
      </header>

      <HrmOfflineBanner token={token} />

      {!canCallHrmApi(token) ? null : query.isLoading ? (
        <HrmSkeleton lines={4} />
      ) : query.isError ? (
        <p className="text-sm font-medium text-red-600">{(query.error as Error).message}</p>
      ) : (
        <div className="space-y-3">
          <p className="text-3xl font-black text-slate-900">{query.data?.length ?? 0}</p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Recent payroll runs</p>
          <ul className="space-y-2">
            {(query.data ?? []).slice(0, 4).map((run) => (
              <li key={run.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                <span className="font-semibold text-slate-700">{run.month}</span>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-bold uppercase">{run.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
};

export default HrmPayrollWidget;
