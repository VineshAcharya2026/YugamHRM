'use client';

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { hrmTapFeedback } from '@/lib/hrmMotion';
import { CalendarClock, Play, RefreshCcw } from 'lucide-react';
import { hrmGetPayrollRuns, hrmRunPayroll } from '@/api/hrmPayroll';
import HrmOfflineBanner from '@/components/hrm/ui/HrmOfflineBanner';
import HrmSkeleton from '@/components/hrm/ui/HrmSkeleton';
import { canCallHrmApi } from '@/lib/hrmConstants';
import { useHrmAuthStore } from '@/store/hrmAuthStore';

const runPayrollSchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/),
});

const HrmPayrollModule: React.FC = () => {
  const token = useHrmAuthStore((state) => state.token);
  const apiReady = canCallHrmApi(token);
  const queryClient = useQueryClient();
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [formError, setFormError] = useState<string | null>(null);

  const runsQuery = useQuery({
    queryKey: ['hrm', 'payroll-runs', token],
    queryFn: () => hrmGetPayrollRuns(token),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    enabled: apiReady,
  });

  const runMutation = useMutation({
    mutationFn: () => hrmRunPayroll(runPayrollSchema.parse({ month }).month, token),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['hrm', 'payroll-runs', token] });
      setFormError(null);
    },
  });

  const onRunPayroll: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setFormError(null);
    if (!runPayrollSchema.safeParse({ month }).success) {
      setFormError('Select a valid month.');
      return;
    }
    const button = event.currentTarget.querySelector('button[type="submit"]');
    if (button) {
      hrmTapFeedback(button);
    }
    runMutation.mutate();
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/40 bg-white/70 p-5 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
        <div>
          <h4 className="text-xl font-black text-slate-900">Payroll</h4>
          <p className="text-sm font-medium text-slate-500">Initiate payroll runs and monitor run history.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!apiReady}
            onClick={() => runsQuery.refetch()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      <HrmOfflineBanner token={token} />

      <form
        onSubmit={onRunPayroll}
        className="flex flex-wrap items-end gap-3 rounded-3xl border border-white/40 bg-white/70 p-6 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)]"
      >
        <label className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Payroll Month</span>
          <input
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-900 focus:border-blue-500 focus:outline-none"
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={runMutation.isPending || !apiReady}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-black text-white disabled:opacity-60"
        >
          <Play className="h-4 w-4" />
          {runMutation.isPending ? 'Running...' : 'Run Payroll'}
        </button>
        {formError ? <p className="text-sm font-medium text-red-600">{formError}</p> : null}
        {runMutation.isError ? <p className="text-sm font-medium text-red-600">{(runMutation.error as Error).message}</p> : null}
        {runMutation.isSuccess ? (
          <p className="text-sm font-medium text-emerald-700">{runMutation.data.message}</p>
        ) : null}
      </form>

      <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-slate-100/80">
              <tr>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Month</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Employees</th>
              </tr>
            </thead>
            <tbody>
              {!apiReady ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={3}>
                    Connect the API to view payroll runs.
                  </td>
                </tr>
              ) : runsQuery.isLoading ? (
                <tr>
                  <td className="px-4 py-4" colSpan={3}>
                    <HrmSkeleton lines={4} />
                  </td>
                </tr>
              ) : runsQuery.isError ? (
                <tr>
                  <td className="px-4 py-4 text-red-600" colSpan={3}>
                    {(runsQuery.error as Error).message}
                  </td>
                </tr>
              ) : (runsQuery.data ?? []).length === 0 ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={3}>
                    No payroll runs found.
                  </td>
                </tr>
              ) : (
                (runsQuery.data ?? []).map((run) => (
                  <tr key={run.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-semibold text-slate-700">{run.month}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-600">
                        {run.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <CalendarClock className="h-4 w-4 text-blue-600" />
                        {run.employee_count ?? 0}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default HrmPayrollModule;
