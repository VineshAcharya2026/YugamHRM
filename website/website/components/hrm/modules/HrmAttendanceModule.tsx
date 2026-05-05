'use client';

import React, { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { hrmTapFeedback } from '@/lib/hrmMotion';
import { CalendarPlus2, RefreshCcw } from 'lucide-react';
import { hrmGetEmployees } from '@/api/hrmEmployees';
import { hrmGetAttendance, hrmUpsertAttendance } from '@/api/hrmAttendance';
import HrmOfflineBanner from '@/components/hrm/ui/HrmOfflineBanner';
import HrmSkeleton from '@/components/hrm/ui/HrmSkeleton';
import { canCallHrmApi } from '@/lib/hrmConstants';
import { useHrmAuthStore } from '@/store/hrmAuthStore';

const attendanceSchema = z.object({
  employeeId: z.coerce.number().int().positive(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  totalHours: z.coerce.number().min(0).max(24).optional(),
  status: z.enum(['present', 'absent', 'half_day', 'wfh', 'holiday', 'on_leave']),
  notes: z.string().trim().max(500).optional(),
});

const HrmAttendanceModule: React.FC = () => {
  const token = useHrmAuthStore((s) => s.token);
  const apiReady = canCallHrmApi(token);
  const qc = useQueryClient();
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [form, setForm] = useState({
    employeeId: '',
    date: new Date().toISOString().slice(0, 10),
    checkIn: '',
    checkOut: '',
    totalHours: '',
    status: 'present',
    notes: '',
  });
  const [error, setError] = useState<string | null>(null);

  const employees = useQuery({
    queryKey: ['hrm', 'employees', token],
    queryFn: () => hrmGetEmployees(token),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    enabled: apiReady,
  });
  const attendance = useQuery({
    queryKey: ['hrm', 'attendance', token, month],
    queryFn: () => hrmGetAttendance({ month }, token),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    enabled: apiReady,
  });

  const mutation = useMutation({
    mutationFn: () =>
      hrmUpsertAttendance(
        attendanceSchema.parse({
          employeeId: form.employeeId,
          date: form.date,
          checkIn: form.checkIn || undefined,
          checkOut: form.checkOut || undefined,
          totalHours: form.totalHours ? Number(form.totalHours) : undefined,
          status: form.status,
          notes: form.notes || undefined,
        }),
        token,
      ),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['hrm', 'attendance', token] });
      setError(null);
      setForm((prev) => ({ ...prev, notes: '' }));
    },
  });

  const totalHours = useMemo(
    () => (attendance.data ?? []).reduce((acc, row) => acc + (row.total_hours ?? 0), 0),
    [attendance.data],
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/40 bg-white/70 p-5 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
        <div>
          <h4 className="text-xl font-black text-slate-900">Attendance</h4>
          <p className="text-sm font-medium text-slate-500">Track daily attendance and work hours.</p>
        </div>
        <div className="flex items-center gap-2">
          <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700" type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
          <button
            type="button"
            disabled={!apiReady}
            onClick={() => {
              void attendance.refetch();
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCcw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      <HrmOfflineBanner token={token} />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/40 bg-white/70 p-4 backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Records</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{apiReady ? attendance.data?.length ?? 0 : '—'}</p>
        </div>
        <div className="rounded-2xl border border-white/40 bg-white/70 p-4 backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Worked Hours</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{apiReady ? totalHours.toFixed(1) : '—'}</p>
        </div>
        <div className="rounded-2xl border border-white/40 bg-white/70 p-4 backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Month</p>
          <p className="mt-2 text-2xl font-black text-slate-900">{month}</p>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          try {
            attendanceSchema.parse({
              employeeId: form.employeeId,
              date: form.date,
              checkIn: form.checkIn || undefined,
              checkOut: form.checkOut || undefined,
              totalHours: form.totalHours ? Number(form.totalHours) : undefined,
              status: form.status,
              notes: form.notes || undefined,
            });
          } catch {
            setError('Please enter valid attendance details.');
            return;
          }
          setError(null);
          const target = e.currentTarget.querySelector('button[type="submit"]');
          if (target) {
            hrmTapFeedback(target);
          }
          mutation.mutate();
        }}
        className="grid gap-3 rounded-3xl border border-white/40 bg-white/70 p-6 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)] md:grid-cols-3"
      >
        <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={form.employeeId} onChange={(e) => setForm((p) => ({ ...p, employeeId: e.target.value }))}>
          <option value="">Select employee</option>
          {(employees.data ?? []).map((e) => (
            <option key={e.id} value={e.id}>{e.first_name} {e.last_name} ({e.employee_id})</option>
          ))}
        </select>
        <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} />
        <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="half_day">Half day</option>
          <option value="wfh">WFH</option>
          <option value="holiday">Holiday</option>
          <option value="on_leave">On leave</option>
        </select>
        <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" type="time" value={form.checkIn} onChange={(e) => setForm((p) => ({ ...p, checkIn: e.target.value }))} />
        <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" type="time" value={form.checkOut} onChange={(e) => setForm((p) => ({ ...p, checkOut: e.target.value }))} />
        <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" type="number" step="0.5" min="0" max="24" placeholder="Total hours" value={form.totalHours} onChange={(e) => setForm((p) => ({ ...p, totalHours: e.target.value }))} />
        <input className="md:col-span-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Notes (optional)" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />
        <div className="md:col-span-3 flex items-center gap-3">
          <button
            type="submit"
            disabled={mutation.isPending || !apiReady}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-black text-white disabled:opacity-60"
          >
            <CalendarPlus2 className="h-4 w-4" />
            {mutation.isPending ? 'Saving...' : 'Save Attendance'}
          </button>
          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
          {mutation.isError ? <p className="text-sm font-medium text-red-600">{(mutation.error as Error).message}</p> : null}
          {mutation.isSuccess ? <p className="text-sm font-medium text-emerald-700">{mutation.data.message}</p> : null}
        </div>
      </form>

      <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-100/80">
              <tr>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Employee</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Date</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Check-in</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Check-out</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Hours</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {!apiReady ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={6}>
                    Connect the API to view attendance.
                  </td>
                </tr>
              ) : attendance.isLoading ? (
                <tr><td className="px-4 py-4" colSpan={6}><HrmSkeleton lines={4} /></td></tr>
              ) : attendance.isError ? (
                <tr><td className="px-4 py-4 text-red-600" colSpan={6}>{(attendance.error as Error).message}</td></tr>
              ) : (attendance.data ?? []).length === 0 ? (
                <tr><td className="px-4 py-4 text-slate-500" colSpan={6}>No attendance records found.</td></tr>
              ) : (
                (attendance.data ?? []).map((row) => (
                  <tr key={row.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-semibold text-slate-700">{row.first_name} {row.last_name}</td>
                    <td className="px-4 py-3 text-slate-600">{row.date}</td>
                    <td className="px-4 py-3 text-slate-600">{row.check_in ?? '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{row.check_out ?? '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{row.total_hours ?? '-'}</td>
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

export default HrmAttendanceModule;
