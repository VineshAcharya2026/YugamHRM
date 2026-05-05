'use client';

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { hrmTapFeedback } from '@/lib/hrmMotion';
import { CalendarPlus2, RefreshCcw } from 'lucide-react';
import { hrmCreateLeaveRequest, hrmGetLeaveRequests, hrmGetLeaveTypes } from '@/api/hrmLeaves';
import HrmOfflineBanner from '@/components/hrm/ui/HrmOfflineBanner';
import HrmSkeleton from '@/components/hrm/ui/HrmSkeleton';
import { canCallHrmApi } from '@/lib/hrmConstants';
import { useHrmAuthStore } from '@/store/hrmAuthStore';

const requestSchema = z.object({
  leaveTypeId: z.coerce.number().int().positive(),
  fromDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  toDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  totalDays: z.coerce.number().positive(),
  reason: z.string().trim().max(500).optional(),
});

const HrmLeavesModule: React.FC = () => {
  const token = useHrmAuthStore((s) => s.token);
  const apiReady = canCallHrmApi(token);
  const qc = useQueryClient();
  const [form, setForm] = useState({ leaveTypeId: '', fromDate: '', toDate: '', totalDays: '', reason: '' });
  const [error, setError] = useState<string | null>(null);

  const leaveTypes = useQuery({
    queryKey: ['hrm', 'leave-types', token],
    queryFn: () => hrmGetLeaveTypes(token),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    enabled: apiReady,
  });
  const requests = useQuery({
    queryKey: ['hrm', 'leave-requests', token],
    queryFn: () => hrmGetLeaveRequests(token),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    enabled: apiReady,
  });

  const mutation = useMutation({
    mutationFn: () =>
      hrmCreateLeaveRequest(
        requestSchema.parse({
          leaveTypeId: form.leaveTypeId,
          fromDate: form.fromDate,
          toDate: form.toDate,
          totalDays: form.totalDays,
          reason: form.reason || undefined,
        }),
        token,
      ),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['hrm', 'leave-requests', token] });
      setForm({ leaveTypeId: '', fromDate: '', toDate: '', totalDays: '', reason: '' });
      setError(null);
    },
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/40 bg-white/70 p-5 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
        <div>
          <h4 className="text-xl font-black text-slate-900">Leaves</h4>
          <p className="text-sm font-medium text-slate-500">Submit and track leave requests.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!apiReady}
            onClick={() => {
              void leaveTypes.refetch();
              void requests.refetch();
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCcw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      <HrmOfflineBanner token={token} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            requestSchema.parse({
              leaveTypeId: form.leaveTypeId,
              fromDate: form.fromDate,
              toDate: form.toDate,
              totalDays: form.totalDays,
              reason: form.reason || undefined,
            });
          } catch {
            setError('Please fill a valid leave request.');
            return;
          }
          setError(null);
          const target = e.currentTarget.querySelector('button[type="submit"]');
          if (target) {
            hrmTapFeedback(target);
          }
          mutation.mutate();
        }}
        className="grid gap-3 rounded-3xl border border-white/40 bg-white/70 p-6 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)] md:grid-cols-2"
      >
        <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={form.leaveTypeId} onChange={(e) => setForm((p) => ({ ...p, leaveTypeId: e.target.value }))}>
          <option value="">Select leave type</option>
          {(leaveTypes.data ?? []).map((t) => (
            <option key={t.id} value={t.id}>{t.name} ({t.code})</option>
          ))}
        </select>
        <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" type="date" value={form.fromDate} onChange={(e) => setForm((p) => ({ ...p, fromDate: e.target.value }))} />
        <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" type="date" value={form.toDate} onChange={(e) => setForm((p) => ({ ...p, toDate: e.target.value }))} />
        <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" type="number" step="0.5" min="0.5" placeholder="Total days" value={form.totalDays} onChange={(e) => setForm((p) => ({ ...p, totalDays: e.target.value }))} />
        <input className="md:col-span-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Reason (optional)" value={form.reason} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} />
        <div className="md:col-span-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={mutation.isPending || !apiReady}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-black text-white disabled:opacity-60"
          >
            <CalendarPlus2 className="h-4 w-4" />
            {mutation.isPending ? 'Submitting...' : 'Submit Leave Request'}
          </button>
          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
          {mutation.isError ? <p className="text-sm font-medium text-red-600">{(mutation.error as Error).message}</p> : null}
          {mutation.isSuccess ? <p className="text-sm font-medium text-emerald-700">{mutation.data.message}</p> : null}
        </div>
      </form>

      <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-100/80">
              <tr>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Employee</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Type</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">From</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">To</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Days</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {!apiReady ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={6}>
                    Connect the API to view leave requests.
                  </td>
                </tr>
              ) : requests.isLoading ? (
                <tr><td className="px-4 py-4" colSpan={6}><HrmSkeleton lines={4} /></td></tr>
              ) : requests.isError ? (
                <tr><td className="px-4 py-4 text-red-600" colSpan={6}>{(requests.error as Error).message}</td></tr>
              ) : (requests.data ?? []).length === 0 ? (
                <tr><td className="px-4 py-4 text-slate-500" colSpan={6}>No leave requests found.</td></tr>
              ) : (
                (requests.data ?? []).map((row) => (
                  <tr key={row.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-semibold text-slate-700">{row.first_name} {row.last_name}</td>
                    <td className="px-4 py-3 text-slate-600">{row.leave_type}</td>
                    <td className="px-4 py-3 text-slate-600">{row.from_date}</td>
                    <td className="px-4 py-3 text-slate-600">{row.to_date}</td>
                    <td className="px-4 py-3 text-slate-600">{row.total_days}</td>
                    <td className="px-4 py-3"><span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-600">{row.status}</span></td>
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

export default HrmLeavesModule;
