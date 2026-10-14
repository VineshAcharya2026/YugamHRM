'use client';

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { hrmTapFeedback } from '@/lib/hrmMotion';
import { BriefcaseBusiness, RefreshCcw, UserPlus } from 'lucide-react';
import {
  hrmCreateCandidate,
  hrmCreateJob,
  hrmGetCandidates,
  hrmGetJobs,
} from '@/api/hrmRecruitment';
import HrmOfflineBanner from '@/components/hrm/ui/HrmOfflineBanner';
import HrmSkeleton from '@/components/hrm/ui/HrmSkeleton';
import { canCallHrmApi } from '@/lib/hrmConstants';
import { useHrmAuthStore } from '@/store/hrmAuthStore';

const jobSchema = z.object({
  title: z.string().trim().min(2).max(120),
  employmentType: z.enum(['full_time', 'part_time', 'contract', 'intern']),
  location: z.string().trim().max(120).optional(),
});
const candidateSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email(),
});

const HrmRecruitmentModule: React.FC = () => {
  const token = useHrmAuthStore((s) => s.token);
  const apiReady = canCallHrmApi(token);
  const qc = useQueryClient();
  const [job, setJob] = useState({ title: '', employmentType: 'full_time' as const, location: '' });
  const [candidate, setCandidate] = useState({ firstName: '', lastName: '', email: '' });
  const [error, setError] = useState<string | null>(null);

  const jobs = useQuery({
    queryKey: ['hrm', 'jobs', token],
    queryFn: () => hrmGetJobs(token),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    enabled: apiReady,
  });
  const candidates = useQuery({
    queryKey: ['hrm', 'candidates', token],
    queryFn: () => hrmGetCandidates(token),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    enabled: apiReady,
  });

  const jobMutation = useMutation({
    mutationFn: () => hrmCreateJob(jobSchema.parse(job), token),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['hrm', 'jobs', token] });
      setJob({ title: '', employmentType: 'full_time', location: '' });
      setError(null);
    },
  });
  const candidateMutation = useMutation({
    mutationFn: () => hrmCreateCandidate(candidateSchema.parse(candidate), token),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['hrm', 'candidates', token] });
      setCandidate({ firstName: '', lastName: '', email: '' });
      setError(null);
    },
  });

  const clickPulse = (el: HTMLButtonElement | null) => {
    if (!el) return;
    hrmTapFeedback(el);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/40 bg-white/70 p-5 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
        <div>
          <h4 className="text-xl font-black text-slate-900">Recruitment</h4>
          <p className="text-sm font-medium text-slate-500">Manage jobs and candidate intake.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!apiReady}
            onClick={() => {
              void jobs.refetch();
              void candidates.refetch();
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCcw className="h-4 w-4" /> Refresh
          </button>
        </div>
      </div>

      <HrmOfflineBanner token={token} />

      <div className="grid gap-4 lg:grid-cols-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            try { jobSchema.parse(job); } catch { setError('Invalid job details'); return; }
            clickPulse(e.currentTarget.querySelector('button[type="submit"]'));
            jobMutation.mutate();
          }}
          className="space-y-3 rounded-3xl border border-white/40 bg-white/70 p-5 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)]"
        >
          <h5 className="text-sm font-black uppercase tracking-wider text-slate-500">Create Job</h5>
          <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Job title" value={job.title} onChange={(e) => setJob((p) => ({ ...p, title: e.target.value }))} />
          <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" value={job.employmentType} onChange={(e) => setJob((p) => ({ ...p, employmentType: e.target.value as typeof p.employmentType }))}>
            <option value="full_time">full_time</option>
            <option value="part_time">part_time</option>
            <option value="contract">contract</option>
            <option value="intern">intern</option>
          </select>
          <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Location" value={job.location} onChange={(e) => setJob((p) => ({ ...p, location: e.target.value }))} />
          <button
            type="submit"
            disabled={jobMutation.isPending || !apiReady}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-black text-white disabled:opacity-60"
          >
            <BriefcaseBusiness className="h-4 w-4" />
            {jobMutation.isPending ? 'Creating...' : 'Create Job'}
          </button>
        </form>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            try { candidateSchema.parse(candidate); } catch { setError('Invalid candidate details'); return; }
            clickPulse(e.currentTarget.querySelector('button[type="submit"]'));
            candidateMutation.mutate();
          }}
          className="space-y-3 rounded-3xl border border-white/40 bg-white/70 p-5 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)]"
        >
          <h5 className="text-sm font-black uppercase tracking-wider text-slate-500">Add Candidate</h5>
          <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="First name" value={candidate.firstName} onChange={(e) => setCandidate((p) => ({ ...p, firstName: e.target.value }))} />
          <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Last name" value={candidate.lastName} onChange={(e) => setCandidate((p) => ({ ...p, lastName: e.target.value }))} />
          <input className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" type="email" placeholder="Email" value={candidate.email} onChange={(e) => setCandidate((p) => ({ ...p, email: e.target.value }))} />
          <button
            type="submit"
            disabled={candidateMutation.isPending || !apiReady}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-black text-white disabled:opacity-60"
          >
            <UserPlus className="h-4 w-4" />
            {candidateMutation.isPending ? 'Saving...' : 'Add Candidate'}
          </button>
        </form>
      </div>
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
      {jobMutation.isError ? <p className="text-sm font-medium text-red-600">{(jobMutation.error as Error).message}</p> : null}
      {candidateMutation.isError ? <p className="text-sm font-medium text-red-600">{(candidateMutation.error as Error).message}</p> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="overflow-hidden rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
          <header className="bg-slate-100/80 px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Job Postings</header>
          <div className="p-4">
            {!apiReady ? (
              <p className="text-sm text-slate-500">Connect the API to load jobs.</p>
            ) : jobs.isLoading ? (
              <HrmSkeleton lines={4} />
            ) : jobs.isError ? (
              <p className="text-sm text-red-600">{(jobs.error as Error).message}</p>
            ) : (
              <ul className="space-y-2">
                {(jobs.data ?? []).slice(0, 8).map((row) => (
                  <li key={row.id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
                    <p className="font-semibold text-slate-700">{row.title}</p>
                    <p className="text-xs uppercase tracking-wider text-slate-500">{row.employment_type} · {row.status}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </article>

        <article className="overflow-hidden rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
          <header className="bg-slate-100/80 px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Candidates</header>
          <div className="p-4">
            {!apiReady ? (
              <p className="text-sm text-slate-500">Connect the API to load candidates.</p>
            ) : candidates.isLoading ? (
              <HrmSkeleton lines={4} />
            ) : candidates.isError ? (
              <p className="text-sm text-red-600">{(candidates.error as Error).message}</p>
            ) : (
              <ul className="space-y-2">
                {(candidates.data ?? []).slice(0, 8).map((row) => (
                  <li key={row.id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
                    <p className="font-semibold text-slate-700">{row.first_name} {row.last_name}</p>
                    <p className="text-xs text-slate-500">{row.email}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </article>
      </div>
    </section>
  );
};

export default HrmRecruitmentModule;
