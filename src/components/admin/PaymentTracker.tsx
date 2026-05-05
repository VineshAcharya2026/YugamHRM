import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { listCandidatesForAdmin, type CandidateRow } from '../../lib/adminFirestore';
import {
  createPayment,
  derivePaymentStatus,
  listPaymentsForAdmin,
  paymentBalance,
  updatePayment,
  type PaidForType,
  type PaymentRow,
} from '../../lib/paymentFirestore';
import { Banknote, Pencil, X } from 'lucide-react';
import { motion } from 'motion/react';
import { cn, formatDate } from '../../lib/utils';

const emptyForm = {
  candidateId: '',
  paidFor: 'training' as PaidForType,
  totalAmount: '',
  amountPaid: '',
  currency: 'INR',
  notes: '',
};

function statusStyles(status: ReturnType<typeof derivePaymentStatus>) {
  switch (status) {
    case 'completed':
      return 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30';
    case 'partial':
      return 'bg-amber-500/15 text-amber-800 border-amber-500/30';
    default:
      return 'bg-brand-page text-brand-fg-muted border-windows-border';
  }
}

export const PaymentTracker: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const [payments, setPayments] = useState<PaymentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saveOk, setSaveOk] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoadError(null);
    const [cRes, pRes] = await Promise.all([listCandidatesForAdmin(), listPaymentsForAdmin()]);
    setCandidates(cRes.error ? [] : cRes.candidates);
    setPayments(pRes.payments);
    setLoadError(cRes.error || pRes.error || null);
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadAll();
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, [loadAll]);

  const candidateById = useMemo(() => {
    const m = new Map<string, CandidateRow>();
    for (const c of candidates) m.set(c.id, c);
    return m;
  }, [candidates]);

  const parseMoney = (raw: string): number | null => {
    const s = raw.trim().replace(/,/g, '');
    if (s === '') return null;
    const n = Number(s);
    if (!Number.isFinite(n) || n < 0) return null;
    return Math.round(n * 100) / 100;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSaveOk(null);

    const total = parseMoney(form.totalAmount);
    const paid = parseMoney(form.amountPaid);
    if (!form.candidateId) {
      setFormError('Select a candidate.');
      return;
    }
    if (total === null) {
      setFormError('Enter a valid total fee.');
      return;
    }
    if (paid === null) {
      setFormError('Enter a valid amount paid (use 0 if none).');
      return;
    }
    if (paid > total + 0.0001) {
      setFormError('Amount paid cannot exceed total fee.');
      return;
    }

    const cand = candidateById.get(form.candidateId);
    const payload = {
      candidateId: form.candidateId,
      candidateName: cand?.name as string | undefined,
      candidateEmail: cand?.emailId as string | undefined,
      paidFor: form.paidFor,
      totalAmount: total,
      amountPaid: paid,
      currency: form.currency.trim() || 'INR',
      notes: form.notes.trim(),
    };

    setSaving(true);
    try {
      if (editingId) {
        const { error } = await updatePayment(editingId, payload);
        if (error) {
          setFormError(error);
        } else {
          setSaveOk('Payment record updated.');
          setForm(emptyForm);
          setEditingId(null);
          await loadAll();
        }
      } else {
        const { error } = await createPayment(payload);
        if (error) {
          setFormError(error);
        } else {
          setSaveOk('Payment record saved.');
          setForm(emptyForm);
          await loadAll();
        }
      }
    } finally {
      setSaving(false);
      window.setTimeout(() => setSaveOk(null), 4000);
    }
  };

  const startEdit = (row: PaymentRow) => {
    setFormError(null);
    setSaveOk(null);
    setEditingId(row.id);
    setForm({
      candidateId: row.candidateId,
      paidFor: row.paidFor === 'placement' ? 'placement' : 'training',
      totalAmount: String(row.totalAmount ?? ''),
      amountPaid: String(row.amountPaid ?? ''),
      currency: (row.currency as string) || 'INR',
      notes: (row.notes as string) || '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-20 font-sans">
      <div className="flex items-end justify-between border-b border-windows-border px-1 pb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-brand-fg">Payment tracker</h2>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan">Placement &amp; training fees</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-windows-border bg-brand-panel px-4 py-2 text-[10px] font-bold text-brand-fg-muted shadow-sm">
          <Banknote size={14} className="text-brand-cyan" />
          <span className="uppercase tracking-widest">Admin only</span>
        </div>
      </div>

      {loadError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-800" role="alert">
          {loadError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 windows-card p-8 lg:col-span-5"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-brand-fg">{editingId ? 'Edit record' : 'New payment record'}</h3>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-fg-muted hover:text-brand-fg"
              >
                <X size={14} />
                Cancel
              </button>
            )}
          </div>

          {saveOk && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm font-medium text-emerald-800">
              {saveOk}
            </div>
          )}
          {formError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm font-medium text-red-800">{formError}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="px-1 text-[11px] font-bold uppercase tracking-tighter text-brand-fg-muted">Candidate</label>
              <select
                className="windows-input w-full"
                value={form.candidateId}
                onChange={(e) => setForm((f) => ({ ...f, candidateId: e.target.value }))}
                required
                disabled={!!editingId}
              >
                <option value="">Select candidate…</option>
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {(c.name as string) || 'Unnamed'} — {(c.emailId as string) || c.id.slice(0, 8)}
                  </option>
                ))}
              </select>
              {editingId && (
                <p className="mt-1 text-[10px] text-brand-fg-muted">Candidate cannot be changed when editing. Create a new record if needed.</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="px-1 text-[11px] font-bold uppercase tracking-tighter text-brand-fg-muted">Paid for</label>
              <select
                className="windows-input w-full"
                value={form.paidFor}
                onChange={(e) => setForm((f) => ({ ...f, paidFor: e.target.value as PaidForType }))}
              >
                <option value="training">Training</option>
                <option value="placement">Placement</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="px-1 text-[11px] font-bold uppercase tracking-tighter text-brand-fg-muted">Total fee</label>
                <input
                  className="windows-input w-full"
                  value={form.totalAmount}
                  onChange={(e) => setForm((f) => ({ ...f, totalAmount: e.target.value }))}
                  placeholder="0"
                  inputMode="decimal"
                />
              </div>
              <div className="space-y-1">
                <label className="px-1 text-[11px] font-bold uppercase tracking-tighter text-brand-fg-muted">Amount paid</label>
                <input
                  className="windows-input w-full"
                  value={form.amountPaid}
                  onChange={(e) => setForm((f) => ({ ...f, amountPaid: e.target.value }))}
                  placeholder="0"
                  inputMode="decimal"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="px-1 text-[11px] font-bold uppercase tracking-tighter text-brand-fg-muted">Currency</label>
              <input
                className="windows-input w-full"
                value={form.currency}
                onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                placeholder="INR"
              />
            </div>

            <div className="space-y-1">
              <label className="px-1 text-[11px] font-bold uppercase tracking-tighter text-brand-fg-muted">Notes</label>
              <textarea
                className="windows-input w-full min-h-[88px] resize-y"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                placeholder="Invoice ref, plan name, follow-up…"
              />
            </div>

            <button
              type="submit"
              disabled={saving || loading}
              className="windows-button-primary w-full py-3 text-sm font-bold tracking-wide disabled:opacity-50"
            >
              {saving ? 'Saving…' : editingId ? 'Update record' : 'Save record'}
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="lg:col-span-7 windows-card"
        >
          <div className="border-b border-windows-border bg-brand-panel p-4">
            <h3 className="text-sm font-bold text-brand-fg">All payment records</h3>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-widest text-brand-fg-muted">Balance &amp; status update from totals</p>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center p-16 text-brand-fg-muted">
                <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-brand-cyan border-t-transparent" />
                <p className="text-xs font-bold uppercase tracking-widest">Loading…</p>
              </div>
            ) : payments.length === 0 ? (
              <div className="p-16 text-center text-sm italic text-brand-fg-muted">No payment records yet.</div>
            ) : (
              <table className="w-full min-w-[1080px] text-sm">
                <thead>
                  <tr className="border-b border-windows-border bg-brand-panel">
                    <th className="col-header text-left min-w-[250px]">Candidate</th>
                    <th className="col-header text-left min-w-[110px]">For</th>
                    <th className="col-header text-right min-w-[150px]">Total</th>
                    <th className="col-header text-right min-w-[150px]">Paid</th>
                    <th className="col-header text-right min-w-[150px]">Balance</th>
                    <th className="col-header text-left min-w-[110px]">Status</th>
                    <th className="col-header text-left min-w-[110px]">Updated</th>
                    <th className="col-header text-right min-w-[56px]">Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-windows-border">
                  {payments.map((row) => {
                const total = Number(row.totalAmount) || 0;
                const paid = Number(row.amountPaid) || 0;
                const bal = paymentBalance(total, paid);
                const status = derivePaymentStatus(total, paid);
                const paidFor: PaidForType = row.paidFor === 'placement' ? 'placement' : 'training';
                const name =
                  (row.candidateName as string) ||
                  (candidateById.get(row.candidateId)?.name as string) ||
                  'Unknown';
                const cur = (row.currency as string) || 'INR';
                return (
                    <tr key={row.id} className="transition-colors odd:bg-brand-page even:bg-brand-surface hover:bg-brand-surface-hover">
                      <td className="px-4 py-3">
                        <div className="truncate font-semibold text-brand-fg">{name}</div>
                        <div className="truncate text-[11px] text-brand-fg-muted">
                          {(row.candidateEmail as string) || (candidateById.get(row.candidateId)?.emailId as string) || row.candidateId}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-wide text-brand-cyan">{paidFor}</td>
                      <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">{cur} {total.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">{cur} {paid.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-right tabular-nums font-medium whitespace-nowrap">{cur} {bal.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={cn(
                            'inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border',
                            statusStyles(status),
                          )}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-[11px] font-semibold uppercase text-brand-fg-muted">
                        {row.updatedAt || row.createdAt ? formatDate((row.updatedAt ?? row.createdAt) as string) : '—'}
                      </td>
                      <td className="px-3 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => startEdit(row)}
                          className="rounded-md p-2 text-brand-fg-muted transition-colors hover:bg-brand-surface-hover hover:text-brand-cyan"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
