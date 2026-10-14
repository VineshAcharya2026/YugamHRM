'use client';

import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { hrmTapFeedback } from '@/lib/hrmMotion';
import { FilePlus2, RefreshCcw } from 'lucide-react';
import { hrmGetEmployees } from '@/api/hrmEmployees';
import { hrmCreateDocument, hrmGetDocuments } from '@/api/hrmDocuments';
import HrmOfflineBanner from '@/components/hrm/ui/HrmOfflineBanner';
import HrmSkeleton from '@/components/hrm/ui/HrmSkeleton';
import { canCallHrmApi } from '@/lib/hrmConstants';
import { useHrmAuthStore } from '@/store/hrmAuthStore';

const documentSchema = z.object({
  employeeId: z.union([z.coerce.number().int().positive(), z.literal('')]),
  name: z.string().trim().min(2).max(140),
  type: z.string().trim().min(2).max(60).regex(/^[a-z0-9_]+$/i),
  fileUrl: z.string().url(),
  fileSize: z.coerce.number().int().nonnegative().optional(),
  mimeType: z.string().trim().max(120).optional(),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

const HrmDocumentsModule: React.FC = () => {
  const token = useHrmAuthStore((s) => s.token);
  const apiReady = canCallHrmApi(token);
  const qc = useQueryClient();
  const [typeFilter, setTypeFilter] = useState('');
  const [form, setForm] = useState({
    employeeId: '',
    name: '',
    type: '',
    fileUrl: '',
    fileSize: '',
    mimeType: '',
    expiryDate: '',
  });
  const [error, setError] = useState<string | null>(null);

  const employees = useQuery({
    queryKey: ['hrm', 'employees', token],
    queryFn: () => hrmGetEmployees(token),
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    enabled: apiReady,
  });
  const documents = useQuery({
    queryKey: ['hrm', 'documents', token, typeFilter],
    queryFn: () => hrmGetDocuments({ type: typeFilter || undefined }, token),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
    enabled: apiReady,
  });

  const mutation = useMutation({
    mutationFn: () => {
      const parsed = documentSchema.parse({
        employeeId: form.employeeId,
        name: form.name,
        type: form.type,
        fileUrl: form.fileUrl,
        fileSize: form.fileSize ? Number(form.fileSize) : undefined,
        mimeType: form.mimeType || undefined,
        expiryDate: form.expiryDate || undefined,
      });
      return hrmCreateDocument(
        {
          employeeId: parsed.employeeId === '' ? null : Number(parsed.employeeId),
          name: parsed.name,
          type: parsed.type,
          fileUrl: parsed.fileUrl,
          fileSize: parsed.fileSize,
          mimeType: parsed.mimeType,
          expiryDate: parsed.expiryDate,
        },
        token,
      );
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['hrm', 'documents', token] });
      setForm({
        employeeId: '',
        name: '',
        type: '',
        fileUrl: '',
        fileSize: '',
        mimeType: '',
        expiryDate: '',
      });
      setError(null);
    },
  });

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/40 bg-white/70 p-5 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
        <div>
          <h4 className="text-xl font-black text-slate-900">Documents</h4>
          <p className="text-sm font-medium text-slate-500">Manage employee and compliance documents.</p>
        </div>
        <div className="flex items-center gap-2">
          <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700" placeholder="Filter type (e.g. id_card)" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} />
          <button
            type="button"
            disabled={!apiReady}
            onClick={() => {
              void documents.refetch();
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
            documentSchema.parse({
              employeeId: form.employeeId,
              name: form.name,
              type: form.type,
              fileUrl: form.fileUrl,
              fileSize: form.fileSize ? Number(form.fileSize) : undefined,
              mimeType: form.mimeType || undefined,
              expiryDate: form.expiryDate || undefined,
            });
          } catch {
            setError('Please enter valid document details.');
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
          <option value="">Company document (no employee)</option>
          {(employees.data ?? []).map((e) => (
            <option key={e.id} value={e.id}>{e.first_name} {e.last_name} ({e.employee_id})</option>
          ))}
        </select>
        <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Document name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
        <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="Type (e.g. offer_letter)" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} />
        <input className="md:col-span-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="File URL" value={form.fileUrl} onChange={(e) => setForm((p) => ({ ...p, fileUrl: e.target.value }))} />
        <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" type="number" min="0" placeholder="File size (bytes)" value={form.fileSize} onChange={(e) => setForm((p) => ({ ...p, fileSize: e.target.value }))} />
        <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" placeholder="MIME type (optional)" value={form.mimeType} onChange={(e) => setForm((p) => ({ ...p, mimeType: e.target.value }))} />
        <input className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm" type="date" value={form.expiryDate} onChange={(e) => setForm((p) => ({ ...p, expiryDate: e.target.value }))} />
        <div className="md:col-span-3 flex items-center gap-3">
          <button
            type="submit"
            disabled={mutation.isPending || !apiReady}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-black text-white disabled:opacity-60"
          >
            <FilePlus2 className="h-4 w-4" />
            {mutation.isPending ? 'Saving...' : 'Create Document'}
          </button>
          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
          {mutation.isError ? <p className="text-sm font-medium text-red-600">{(mutation.error as Error).message}</p> : null}
          {mutation.isSuccess ? <p className="text-sm font-medium text-emerald-700">{mutation.data.message}</p> : null}
        </div>
      </form>

      <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/70 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-100/80">
              <tr>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Name</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Type</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Employee</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Verified</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">Created</th>
                <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-slate-500">URL</th>
              </tr>
            </thead>
            <tbody>
              {!apiReady ? (
                <tr>
                  <td className="px-4 py-4 text-slate-500" colSpan={6}>
                    Connect the API to view documents.
                  </td>
                </tr>
              ) : documents.isLoading ? (
                <tr><td className="px-4 py-4" colSpan={6}><HrmSkeleton lines={4} /></td></tr>
              ) : documents.isError ? (
                <tr><td className="px-4 py-4 text-red-600" colSpan={6}>{(documents.error as Error).message}</td></tr>
              ) : (documents.data ?? []).length === 0 ? (
                <tr><td className="px-4 py-4 text-slate-500" colSpan={6}>No documents found.</td></tr>
              ) : (
                (documents.data ?? []).map((row) => (
                  <tr key={row.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-semibold text-slate-700">{row.name}</td>
                    <td className="px-4 py-3 text-slate-600">{row.type}</td>
                    <td className="px-4 py-3 text-slate-600">{row.employee_name ?? 'Company'}</td>
                    <td className="px-4 py-3 text-slate-600">{row.is_verified ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-3 text-slate-600">{row.created_at}</td>
                    <td className="px-4 py-3 text-brand"><a href={row.file_url} target="_blank" rel="noreferrer">Open</a></td>
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

export default HrmDocumentsModule;
