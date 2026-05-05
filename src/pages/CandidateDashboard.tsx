import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, Clock, Calendar, ClipboardList, Save } from 'lucide-react';
import { cn, formatDate } from '../lib/utils';
import {
  EMPTY_CANDIDATE_FORM,
  loadCandidateDetails,
  saveCandidateProfileForm,
  type CandidateFormFields,
} from '../lib/candidateDetailsPersistence';

export const CandidateDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [form, setForm] = useState<CandidateFormFields>(EMPTY_CANDIDATE_FORM);
  const [recordUpdatedAt, setRecordUpdatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await loadCandidateDetails(user.uid);
      if (data) {
        setForm(data.form);
        setRecordUpdatedAt(data.candidateRecordUpdatedAt);
      }
    } catch (e) {
      console.error('CandidateDashboard load:', e);
      setError('Could not load your candidate record.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await saveCandidateProfileForm(user.uid, profile ?? {}, form);
      setSuccess('Saved. Your record is updated for admissions and mentors.');
      setRecordUpdatedAt(new Date().toISOString());
      window.setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      console.error('CandidateDashboard save:', err);
      setError('Could not save. Check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10 font-sans">
      <div className="flex flex-col justify-between border-b border-windows-border pb-8 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-cyan">Overview</p>
          <h2 className="mt-1 text-4xl font-bold tracking-tight text-brand-fg">
            Hello, {profile?.displayName || profile?.email?.split('@')[0]}
          </h2>
        </div>
        <div className="mt-4 font-mono text-[10px] text-brand-fg-muted md:mt-0 md:text-right">
          <p>LOC_TIME: {new Date().toLocaleTimeString()}</p>
          <p>SES_ID: {profile?.uid?.slice(0, 8).toUpperCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="windows-card p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-2">
            <ClipboardList size={18} className="text-brand-cyan" />
            <div>
              <h3 className="text-lg font-bold text-brand-fg">Your candidate record</h3>
              <p className="text-xs text-brand-fg-muted">
                Updates here sync to the same Firestore row used in <strong className="text-brand-fg">Candidate Details</strong> and admin tools.
              </p>
            </div>
          </div>
          {loading ? (
            <p className="text-sm text-brand-fg-muted">Loading your details…</p>
          ) : (
            <form onSubmit={onSave} className="space-y-4">
              {error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-800">{error}</div>}
              {success && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-800">{success}</div>
              )}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-brand-fg-muted">Phone</label>
                  <input
                    className="windows-input w-full text-sm"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-brand-fg-muted">Location</label>
                  <input
                    className="windows-input w-full text-sm"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase text-brand-fg-muted">Primary skill</label>
                  <input
                    className="windows-input w-full text-sm"
                    value={form.primarySkill}
                    onChange={(e) => setForm((f) => ({ ...f, primarySkill: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-brand-fg-muted">Experience (yrs)</label>
                  <input
                    className="windows-input w-full text-sm"
                    value={form.experienceYears}
                    onChange={(e) => setForm((f) => ({ ...f, experienceYears: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-brand-fg-muted">Designation</label>
                  <input
                    className="windows-input w-full text-sm"
                    value={form.designation}
                    onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold uppercase text-brand-fg-muted">Current company</label>
                  <input
                    className="windows-input w-full text-sm"
                    value={form.currentCompany}
                    onChange={(e) => setForm((f) => ({ ...f, currentCompany: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-brand-fg-muted">Current CTC</label>
                  <input
                    className="windows-input w-full text-sm"
                    value={form.currentCtc}
                    onChange={(e) => setForm((f) => ({ ...f, currentCtc: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-brand-fg-muted">Expected CTC</label>
                  <input
                    className="windows-input w-full text-sm"
                    value={form.expectedCtc}
                    onChange={(e) => setForm((f) => ({ ...f, expectedCtc: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-brand-fg-muted">Notice period</label>
                  <input
                    className="windows-input w-full text-sm"
                    value={form.noticePeriod}
                    onChange={(e) => setForm((f) => ({ ...f, noticePeriod: e.target.value }))}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-brand-fg-muted">Referred by</label>
                  <input
                    className="windows-input w-full text-sm"
                    value={form.referredBy}
                    onChange={(e) => setForm((f) => ({ ...f, referredBy: e.target.value }))}
                  />
                </div>
              </div>
              <p className="text-[11px] text-brand-fg-muted">
                Blood group, full address, and interview readouts: use <strong className="text-brand-fg">Candidate Details</strong> in the sidebar.
              </p>
              <button
                type="submit"
                disabled={saving}
                className="windows-button-primary flex w-full items-center justify-center gap-2 py-2.5 text-sm sm:w-auto sm:px-8"
              >
                <Save size={16} />
                {saving ? 'Saving…' : 'Save to dashboard record'}
              </button>
            </form>
          )}
        </div>

        <div className="windows-card flex flex-col p-6 sm:p-8">
          <h3 className="mb-1 text-lg font-bold text-brand-fg">On file</h3>
          <p className="mb-6 text-xs text-brand-fg-muted">What we show to your cohort team from your latest save.</p>
          <dl className="flex-1 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-windows-border pb-2">
              <dt className="text-brand-fg-muted">Phone</dt>
              <dd className="max-w-[55%] truncate text-right font-medium text-brand-fg">{form.phone || '—'}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-windows-border pb-2">
              <dt className="text-brand-fg-muted">Skill</dt>
              <dd className="max-w-[55%] truncate text-right font-medium text-brand-fg">{form.primarySkill || '—'}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-windows-border pb-2">
              <dt className="text-brand-fg-muted">Company</dt>
              <dd className="max-w-[55%] truncate text-right font-medium text-brand-fg">{form.currentCompany || '—'}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-windows-border pb-2">
              <dt className="text-brand-fg-muted">CTC (curr / exp)</dt>
              <dd className="text-right font-medium text-brand-fg">
                {[form.currentCtc, form.expectedCtc].filter(Boolean).join(' → ') || '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-brand-fg-muted">Record updated</dt>
              <dd className="text-right text-xs font-semibold text-brand-fg-muted">
                {recordUpdatedAt ? formatDate(recordUpdatedAt) : '—'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col items-center p-8 lg:col-span-1 windows-card">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-brand-cyan bg-brand-page p-1 shadow-lg ring-4 ring-brand-cyan/20">
            <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-windows-border bg-brand-surface text-3xl font-bold text-brand-fg">
              {profile?.displayName?.[0] || 'U'}
            </div>
          </div>
          <h3 className="text-lg font-bold text-brand-fg">{profile?.displayName || 'Candidate'}</h3>
          <p className="mb-8 text-xs font-medium text-brand-fg-muted">{profile?.email}</p>

          <div className="w-full space-y-4 border-t border-windows-border pt-6">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-brand-fg-muted">Profile Status</span>
              <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold uppercase text-emerald-700">Completed</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-brand-fg-muted">Learning Status</span>
              <span className="font-bold text-brand-fg">Ready for Jobs</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-brand-fg-muted">Resume Export</span>
              <span className="font-bold text-brand-cyan">Enabled</span>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="windows-card p-6">
              <div className="mb-4 flex items-center space-x-3">
                <div className="rounded-lg bg-brand-secondary-bg p-2 text-brand-violet">
                  <Clock size={18} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-fg-muted">Upcoming Classes</span>
              </div>
              <div className="space-y-4">
                <div className="group -mx-2 flex cursor-pointer items-center justify-between rounded-lg p-2 transition-all hover:bg-brand-surface-hover">
                  <span className="text-sm font-semibold text-brand-fg">Cloud Architecture Learning</span>
                  <span className="rounded bg-brand-page px-2 py-0.5 text-[10px] font-bold text-brand-fg-muted">OCT-24</span>
                </div>
                <div className="group -mx-2 flex cursor-pointer items-center justify-between rounded-lg p-2 transition-all hover:bg-brand-surface-hover">
                  <span className="text-sm font-semibold text-brand-fg">Microservices Class</span>
                  <span className="rounded bg-brand-page px-2 py-0.5 text-[10px] font-bold text-brand-fg-muted">OCT-28</span>
                </div>
              </div>
            </div>

            <div className="windows-card p-6">
              <div className="mb-4 flex items-center space-x-3">
                <div className="rounded-lg bg-brand-info-bg p-2 text-brand-cyan">
                  <Calendar size={18} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-fg-muted">Interview Schedule</span>
              </div>
              <div className="flex items-center space-x-4 rounded-xl border border-windows-border bg-brand-page p-3">
                <div className="min-w-[48px] rounded-lg bg-brand-cyan px-2 py-1 text-center text-brand-cta-text">
                  <p className="text-[8px] font-bold uppercase">OCT</p>
                  <p className="text-lg font-bold leading-tight">30</p>
                </div>
                <div>
                  <p className="text-sm font-bold text-brand-fg">Google Cloud - Screening</p>
                  <p className="text-[10px] font-medium uppercase text-brand-fg-muted">10:00 AM IST</p>
                </div>
              </div>
            </div>
          </div>

          <div className="windows-card p-8">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-brand-fg-muted">Job Progress</h3>
            <div className="relative space-y-8 pb-4">
              {[
                { step: 'Onboarding', status: 'done', label: 'Profile Setup Finished' },
                { step: 'Learning', status: 'done', label: 'Technical Classes Finished' },
                { step: 'Practice', status: 'current', label: 'Final Practice Interview Review' },
                { step: 'Job Match', status: 'pending', label: 'Looking for your best match' },
              ].map((item, i) => (
                <div key={i} className="relative flex items-start space-x-5">
                  <div
                    className={cn(
                      'z-10 flex h-10 w-10 items-center justify-center rounded-xl border-2 shadow-sm transition-all',
                      item.status === 'done'
                        ? 'border-emerald-500 bg-emerald-500 text-brand-cta-text'
                        : item.status === 'current'
                          ? 'scale-110 border-brand-cyan bg-brand-cyan text-brand-cta-text shadow-lg'
                          : 'border-windows-border bg-brand-surface text-brand-fg-disabled',
                    )}
                  >
                    {item.status === 'done' ? <CheckCircle size={20} /> : <span className="text-xs font-bold">{i + 1}</span>}
                  </div>
                  <div className="pt-0.5">
                    <p className={cn('text-xs font-bold uppercase', item.status === 'pending' ? 'text-brand-fg-disabled' : 'text-brand-fg')}>
                      {item.step}
                    </p>
                    <p className={cn('text-[11px] font-medium text-brand-fg-muted', item.status === 'pending' && 'hidden')}>{item.label}</p>
                  </div>
                  {i < 3 && (
                    <div
                      className={cn(
                        'absolute left-5 top-10 h-8 w-0.5 -translate-x-1/2',
                        item.status === 'done' ? 'bg-emerald-500/30' : 'bg-windows-border',
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
