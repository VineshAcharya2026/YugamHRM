'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { hrmGetEmployees } from '@/api/hrmEmployees';
import HrmOfflineBanner from '@/components/hrm/ui/HrmOfflineBanner';
import HrmSkeleton from '@/components/hrm/ui/HrmSkeleton';
import { canCallHrmApi } from '@/lib/hrmConstants';
import { useHrmAuthStore } from '@/store/hrmAuthStore';

const HrmEmployeesWidget: React.FC = () => {
  const token = useHrmAuthStore((state) => state.token);
  const query = useQuery({
    queryKey: ['hrm', 'employees', token],
    queryFn: () => hrmGetEmployees(token),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    enabled: canCallHrmApi(token),
  });

  return (
    <article className="rounded-3xl border border-white/40 bg-white/70 p-6 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
      <header className="mb-4 flex items-center justify-between">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500">Employees</h4>
        <Users className="h-5 w-5 text-brand" />
      </header>

      <HrmOfflineBanner token={token} />

      {!canCallHrmApi(token) ? null : query.isLoading ? (
        <HrmSkeleton lines={4} />
      ) : query.isError ? (
        <p className="text-sm font-medium text-red-600">{(query.error as Error).message}</p>
      ) : (
        <div className="space-y-3">
          <p className="text-3xl font-black text-slate-900">{query.data?.length ?? 0}</p>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total employees</p>
          <ul className="space-y-2">
            {(query.data ?? []).slice(0, 4).map((emp) => (
              <li key={emp.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-sm">
                <span className="font-semibold text-slate-700">
                  {emp.first_name} {emp.last_name}
                </span>
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-bold uppercase">{emp.status}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
};

export default HrmEmployeesWidget;
