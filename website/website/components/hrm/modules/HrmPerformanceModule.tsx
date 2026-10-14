'use client';

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { hrmTapFeedback } from '@/lib/hrmMotion';
import { RefreshCcw, Target, PlusCircle } from 'lucide-react';
import { hrmGetEmployees } from '@/api/hrmEmployees';
import {
  hrmCreateGoal,
  hrmCreatePerformanceCycle,
  hrmCreateReview,
  hrmGetGoals,
  hrmGetPerformanceCycles,
  hrmGetReviews,
} from '@/api/hrmPerformance';
import HrmOfflineBanner from '@/components/hrm/ui/HrmOfflineBanner';
import HrmSkeleton from '@/components/hrm/ui/HrmSkeleton';
import { canCallHrmApi } from '@/lib/hrmConstants';
import { useHrmAuthStore } from '@/store/hrmAuthStore';

const cycleSchema = z.object({
  name: z.string().trim().min(2).max(120),
  periodFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  periodTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const goalSchema = z.object({
  employeeId: z.coerce.number().int().positive(),
  cycleId: z.coerce.number().int().positive().optional(),
  title: z.string().trim().min(2).max(200),
  description: z.string().trim().max(2000).optional(),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

const HrmPerformanceModule: React.FC = () => {
  const token = useHrmAuthStore((s) => s.token);
  const apiReady = canCallHrmApi(token);
  const role = useHrmAuthStore((s) => s.user?.role);
  const canManageCycles = role === 'admin' || role === 'hr';
  const canManageGoalsReviews = role === 'admin' || role === 'hr' || role === 'manager';
  const qc = useQueryClient();
  const [cycleForm, setCycleForm] = useState({ name: '', periodFrom: '', periodTo: '' });
  const [goalForm, setGoalForm] = useState({
    employeeId: '',
    cycleId: '',
    title: '',
    description: '',
    dueDate: '',
  });
  const [reviewForm, setReviewForm] = useState({
    employeeId: '',
    reviewerId: '',
    cycleId: '',
    finalRating: '',
    status: 'draft' as 'draft' | 'submitted' | 'completed',
  });
  const [err, setErr] = useState<string | null>(null);

  const cycles = useQuery({
    queryKey: ['hrm', 'perf-cycles', token],
    queryFn: () => hrmGetPerformanceCycles(token),
    staleTime: 30_000,
    enabled: apiReady,
  });
  const goals = useQuery({
    queryKey: ['hrm', 'perf-goals', token],
    queryFn: () => hrmGetGoals({}, token),
    staleTime: 30_000,
    enabled: apiReady,
  });
  const reviews = useQuery({
    queryKey: ['hrm', 'perf-reviews', token],
    queryFn: () => hrmGetReviews(token),
    staleTime: 30_000,
    enabled: apiReady,
  });
  const employees = useQuery({
    queryKey: ['hrm', 'employees', token],
    queryFn: () => hrmGetEmployees(token),
    staleTime: 60_000,
    enabled: apiReady,
  });

  const cycleMut = useMutation({
    mutationFn: () =>
      hrmCreatePerformanceCycle(cycleSchema.parse(cycleForm), token),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['hrm', 'perf-cycles', token] });
      setCycleForm({ name: '', periodFrom: '', periodTo: '' });
      setErr(null);
    },
  });

  const goalMut = useMutation({
    mutationFn: () =>
      hrmCreateGoal(
        goalSchema.parse({
          employeeId: goalForm.employeeId,
          cycleId: goalForm.cycleId ? Number(goalForm.cycleId) : undefined,
          title: goalForm.title,
          description: goalForm.description || undefined,
          dueDate: goalForm.dueDate || undefined,
        }),
        token,
      ),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['hrm', 'perf-goals', token] });
      setGoalForm({ employeeId: '', cycleId: '', title: '', description: '', dueDate: '' });
      setErr(null);
    },
  });

  const reviewMut = useMutation({
    mutationFn: () => {
      const employeeId = Number(reviewForm.employeeId);
      const reviewerId = Number(reviewForm.reviewerId);
      if (!Number.isFinite(employeeId) || !Number.isFinite(reviewerId)) {
        throw new Error('Select employee and reviewer');
      }
      if (employeeId === reviewerId) throw new Error('Reviewer must differ from employee');
      const rawRating = reviewForm.finalRating.trim();
      const finalRating = rawRating === '' ? undefined : Number(rawRating);
      if (finalRating !== undefined && (!Number.isFinite(finalRating) || finalRating < 0 || finalRating > 5)) {
        throw new Error('Final rating must be between 0 and 5');
      }
      return hrmCreateReview(
        {
          employeeId,
          reviewerId,
          cycleId: reviewForm.cycleId ? Number(reviewForm.cycleId) : null,
          finalRating,
          status: reviewForm.status,
        },
        token,
      );
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['hrm', 'perf-reviews', token] });
      setReviewForm({ employeeId: '', reviewerId: '', cycleId: '', finalRating: '', status: 'draft' });
      setErr(null);
    },
  });

  const pulse = (el: EventTarget | null) => {
    if (el instanceof HTMLElement) hrmTapFeedback(el);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/40 bg-white/70 p-5 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
        <div>
          <h4 className="text-xl font-black text-slate-900">Performance</h4>
          <p className="text-sm font-medium text-slate-500">Cycles, goals, and review records.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!apiReady}
            onClick={() => {
              void cycles.refetch();
              void goals.refetch();
              void reviews.refetch();
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCcw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      <HrmOfflineBanner token={token} />

      <div className="grid gap-4 md:grid-cols-2">
        {canManageCycles ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            try {
              cycleSchema.parse(cycleForm);
            } catch {
              setErr('Enter a valid cycle.');
              return;
            }
            setErr(null);
            pulse(e.currentTarget.querySelector('button[type="submit"]'));
            cycleMut.mutate();
          }}
          className="space-y-3 rounded-3xl border border-white/40 bg-white/70 p-6 backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 text-slate-900">
            <PlusCircle className="h-5 w-5 text-brand" />
            <h5 className="font-black">New review cycle</h5>
          </div>
          <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Cycle name" value={cycleForm.name} onChange={(e) => setCycleForm((p) => ({ ...p, name: e.target.value }))} />
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" type="date" value={cycleForm.periodFrom} onChange={(e) => setCycleForm((p) => ({ ...p, periodFrom: e.target.value }))} />
            <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" type="date" value={cycleForm.periodTo} onChange={(e) => setCycleForm((p) => ({ ...p, periodTo: e.target.value }))} />
          </div>
          <button
            type="submit"
            disabled={cycleMut.isPending || !apiReady}
            className="rounded-xl bg-brand px-4 py-2 text-sm font-black text-white disabled:opacity-60"
          >
            Create cycle
          </button>
          {cycleMut.isError ? <p className="text-sm text-red-600">{(cycleMut.error as Error).message}</p> : null}
          {cycleMut.isSuccess ? <p className="text-sm text-emerald-700">{cycleMut.data.message}</p> : null}
        </form>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/50 p-6 text-sm text-slate-500">
            Only HR or Admin can create review cycles.
          </div>
        )}

        {canManageGoalsReviews ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            try {
              goalSchema.parse(goalForm);
            } catch {
              setErr('Enter a valid goal.');
              return;
            }
            setErr(null);
            pulse(e.currentTarget.querySelector('button[type="submit"]'));
            goalMut.mutate();
          }}
          className="space-y-3 rounded-3xl border border-white/40 bg-white/70 p-6 backdrop-blur-xl"
        >
          <div className="flex items-center gap-2 text-slate-900">
            <Target className="h-5 w-5 text-brand" />
            <h5 className="font-black">New goal</h5>
          </div>
          <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={goalForm.employeeId} onChange={(e) => setGoalForm((p) => ({ ...p, employeeId: e.target.value }))}>
            <option value="">Employee</option>
            {(employees.data ?? []).map((e) => (
              <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>
            ))}
          </select>
          <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={goalForm.cycleId} onChange={(e) => setGoalForm((p) => ({ ...p, cycleId: e.target.value }))}>
            <option value="">Cycle (optional)</option>
            {(cycles.data ?? []).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Goal title" value={goalForm.title} onChange={(e) => setGoalForm((p) => ({ ...p, title: e.target.value }))} />
          <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Description (optional)" value={goalForm.description} onChange={(e) => setGoalForm((p) => ({ ...p, description: e.target.value }))} />
          <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" type="date" value={goalForm.dueDate} onChange={(e) => setGoalForm((p) => ({ ...p, dueDate: e.target.value }))} />
          <button
            type="submit"
            disabled={goalMut.isPending || !apiReady}
            className="rounded-xl bg-brand px-4 py-2 text-sm font-black text-white hover:bg-brand-600 disabled:opacity-60"
          >
            Create goal
          </button>
          {goalMut.isError ? <p className="text-sm text-red-600">{(goalMut.error as Error).message}</p> : null}
          {goalMut.isSuccess ? <p className="text-sm text-emerald-700">{goalMut.data.message}</p> : null}
        </form>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white/50 p-6 text-sm text-slate-500">
            Managers and HR can assign goals.
          </div>
        )}
      </div>

      {canManageGoalsReviews ? (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setErr(null);
          pulse(e.currentTarget.querySelector('button[type="submit"]'));
          reviewMut.mutate();
        }}
        className="space-y-3 rounded-3xl border border-white/40 bg-white/70 p-6 backdrop-blur-xl"
      >
        <div className="flex items-center gap-2 text-slate-900">
          <Target className="h-5 w-5 text-brand" />
          <h5 className="font-black">New performance review</h5>
        </div>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={reviewForm.employeeId} onChange={(e) => setReviewForm((p) => ({ ...p, employeeId: e.target.value }))}>
            <option value="">Employee</option>
            {(employees.data ?? []).map((e) => (
              <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>
            ))}
          </select>
          <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={reviewForm.reviewerId} onChange={(e) => setReviewForm((p) => ({ ...p, reviewerId: e.target.value }))}>
            <option value="">Reviewer (manager)</option>
            {(employees.data ?? []).map((e) => (
              <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>
            ))}
          </select>
          <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={reviewForm.cycleId} onChange={(e) => setReviewForm((p) => ({ ...p, cycleId: e.target.value }))}>
            <option value="">Cycle (optional)</option>
            {(cycles.data ?? []).map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Final rating 0–5" value={reviewForm.finalRating} onChange={(e) => setReviewForm((p) => ({ ...p, finalRating: e.target.value }))} />
          <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={reviewForm.status} onChange={(e) => setReviewForm((p) => ({ ...p, status: e.target.value as typeof p.status }))}>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={reviewMut.isPending || !apiReady}
          className="rounded-xl bg-brand px-4 py-2 text-sm font-black text-white disabled:opacity-60"
        >
          Create review
        </button>
        {reviewMut.isError ? <p className="text-sm text-red-600">{(reviewMut.error as Error).message}</p> : null}
        {reviewMut.isSuccess ? <p className="text-sm text-emerald-700">{reviewMut.data.message}</p> : null}
      </form>
      ) : null}

      {err ? <p className="text-sm text-red-600">{err}</p> : null}

      <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl">
        <div className="border-b border-slate-100 px-4 py-3 text-sm font-black text-slate-700">Goals</div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-100/80">
              <tr>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Employee</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Title</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Cycle</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {!apiReady ? (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-slate-500">
                    Connect the API to load goals.
                  </td>
                </tr>
              ) : goals.isLoading ? (
                <tr><td colSpan={4} className="px-4 py-4"><HrmSkeleton lines={3} /></td></tr>
              ) : goals.isError ? (
                <tr><td colSpan={4} className="px-4 py-4 text-red-600">{(goals.error as Error).message}</td></tr>
              ) : (goals.data ?? []).length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-4 text-slate-500">No goals yet.</td></tr>
              ) : (
                (goals.data ?? []).map((g) => (
                  <tr key={g.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-semibold text-slate-700">{g.first_name} {g.last_name}</td>
                    <td className="px-4 py-3 text-slate-600">{g.title}</td>
                    <td className="px-4 py-3 text-slate-600">{g.cycle_name ?? '—'}</td>
                    <td className="px-4 py-3"><span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-bold uppercase">{g.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl">
        <div className="border-b border-slate-100 px-4 py-3 text-sm font-black text-slate-700">Reviews</div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-100/80">
              <tr>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Employee</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Reviewer</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Final</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {!apiReady ? (
                <tr>
                  <td colSpan={4} className="px-4 py-4 text-slate-500">
                    Connect the API to load reviews.
                  </td>
                </tr>
              ) : reviews.isLoading ? (
                <tr><td colSpan={4} className="px-4 py-4"><HrmSkeleton lines={3} /></td></tr>
              ) : reviews.isError ? (
                <tr><td colSpan={4} className="px-4 py-4 text-red-600">{(reviews.error as Error).message}</td></tr>
              ) : (reviews.data ?? []).length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-4 text-slate-500">No reviews yet.</td></tr>
              ) : (
                (reviews.data ?? []).map((r) => (
                  <tr key={r.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-semibold text-slate-700">{r.employee_name}</td>
                    <td className="px-4 py-3 text-slate-600">{r.reviewer_name}</td>
                    <td className="px-4 py-3 text-slate-600">{r.final_rating ?? '—'}</td>
                    <td className="px-4 py-3"><span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-bold uppercase">{r.status}</span></td>
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

export default HrmPerformanceModule;
