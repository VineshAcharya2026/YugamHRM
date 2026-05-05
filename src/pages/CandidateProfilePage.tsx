import React, { useEffect, useMemo, useState } from 'react';
import { UserRound, Save, BriefcaseBusiness } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn, formatDate } from '../lib/utils';
import {
  EMPTY_CANDIDATE_FORM,
  loadCandidateDetails,
  saveCandidateProfileForm,
  type CandidateFormFields,
  type InterviewStage,
} from '../lib/candidateDetailsPersistence';

function stageLabel(stage: InterviewStage): string {
  switch (stage) {
    case 'scheduled':
      return 'Scheduled';
    case 'screening':
      return 'Screening';
    case 'final-round':
      return 'Final Round';
    case 'selected':
      return 'Selected';
    case 'rejected':
      return 'Rejected';
    default:
      return 'Not Scheduled';
  }
}

function stageClass(stage: InterviewStage): string {
  switch (stage) {
    case 'selected':
      return 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30';
    case 'rejected':
      return 'bg-red-500/15 text-red-400 border-red-500/30';
    case 'final-round':
      return 'bg-brand-secondary-bg text-brand-violet border-brand-violet/30';
    case 'screening':
      return 'bg-brand-info-bg text-brand-cyan border-brand-cyan/30';
    case 'scheduled':
      return 'bg-brand-highlight-bg text-brand-magenta border-brand-magenta/30';
    default:
      return 'bg-brand-page text-brand-fg-muted border-windows-border';
  }
}

export const CandidateProfilePage: React.FC = () => {
  const { user, profile } = useAuth();
  const [details, setDetails] = useState<CandidateFormFields>(EMPTY_CANDIDATE_FORM);
  const [stage, setStage] = useState<InterviewStage>('not-scheduled');
  const [interviewCompany, setInterviewCompany] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [interviewUpdatedAt, setInterviewUpdatedAt] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user) return;
      try {
        const loaded = await loadCandidateDetails(user.uid);
        if (cancelled) return;
        if (!loaded) {
          setLoading(false);
          return;
        }
        setDetails(loaded.form);
        setStage(loaded.interview.stage);
        setInterviewCompany(loaded.interview.company);
        setInterviewNotes(loaded.interview.notes);
        setInterviewUpdatedAt(loaded.interview.updatedAt);
      } catch (e) {
        console.error('CandidateProfilePage load:', e);
        if (!cancelled) setError('Could not load candidate details right now.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const canShowInterviewDate = useMemo(() => interviewUpdatedAt && interviewUpdatedAt.length > 0, [interviewUpdatedAt]);

  const saveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      await saveCandidateProfileForm(user.uid, profile ?? {}, details);
      setSuccess('Candidate details updated.');
      window.setTimeout(() => setSuccess(null), 3500);
    } catch (err) {
      console.error('CandidateProfilePage save:', err);
      setError('Failed to update details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 font-sans">
      <div className="flex items-end justify-between border-b border-windows-border pb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-brand-fg">Candidate details</h2>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan">Profile update & interview status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="windows-card p-8 lg:col-span-7">
          <div className="mb-6 flex items-center gap-2">
            <UserRound size={18} className="text-brand-cyan" />
            <h3 className="text-lg font-bold text-brand-fg">Update your profile</h3>
          </div>
          {loading ? (
            <div className="text-sm text-brand-fg-muted">Loading profile...</div>
          ) : (
            <form onSubmit={saveDetails} className="space-y-5">
              {error && (
                <div className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-800">{error}</div>
              )}
              {success && (
                <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-800">{success}</div>
              )}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="px-1 text-[11px] font-bold uppercase tracking-tighter text-brand-fg-muted">Name</label>
                  <input className="windows-input w-full opacity-80" value={profile?.displayName || ''} disabled />
                </div>
                <div className="space-y-1">
                  <label className="px-1 text-[11px] font-bold uppercase tracking-tighter text-brand-fg-muted">Email</label>
                  <input className="windows-input w-full opacity-80" value={profile?.email || ''} disabled />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="px-1 text-[11px] font-bold uppercase tracking-tighter text-brand-fg-muted">Phone</label>
                  <input
                    className="windows-input w-full"
                    value={details.phone}
                    onChange={(e) => setDetails((d) => ({ ...d, phone: e.target.value }))}
                    placeholder="+91..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="px-1 text-[11px] font-bold uppercase tracking-tighter text-brand-fg-muted">Location</label>
                  <input
                    className="windows-input w-full"
                    value={details.location}
                    onChange={(e) => setDetails((d) => ({ ...d, location: e.target.value }))}
                    placeholder="City, State"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1 md:col-span-2">
                  <label className="px-1 text-[11px] font-bold uppercase tracking-tighter text-brand-fg-muted">Designation</label>
                  <input
                    className="windows-input w-full"
                    value={details.designation}
                    onChange={(e) => setDetails((d) => ({ ...d, designation: e.target.value }))}
                    placeholder="HR Executive"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="px-1 text-[11px] font-bold uppercase tracking-tighter text-brand-fg-muted">Blood group</label>
                  <input
                    className="windows-input w-full max-w-md"
                    value={details.bloodGroup}
                    onChange={(e) => setDetails((d) => ({ ...d, bloodGroup: e.target.value }))}
                    placeholder="O+ve"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="px-1 text-[11px] font-bold uppercase tracking-tighter text-brand-fg-muted">Full address</label>
                  <textarea
                    className="windows-input min-h-[88px] w-full resize-y py-2.5"
                    value={details.address}
                    onChange={(e) => setDetails((d) => ({ ...d, address: e.target.value }))}
                    placeholder="Street, area, PIN"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="px-1 text-[11px] font-bold uppercase tracking-tighter text-brand-fg-muted">Primary skill</label>
                  <input
                    className="windows-input w-full"
                    value={details.primarySkill}
                    onChange={(e) => setDetails((d) => ({ ...d, primarySkill: e.target.value }))}
                    placeholder="React, Cloud, Testing..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="px-1 text-[11px] font-bold uppercase tracking-tighter text-brand-fg-muted">Experience (years)</label>
                  <input
                    className="windows-input w-full"
                    value={details.experienceYears}
                    onChange={(e) => setDetails((d) => ({ ...d, experienceYears: e.target.value }))}
                    placeholder="0 / 1 / 2..."
                  />
                </div>
              </div>
              <div className="border-t border-windows-border pt-4">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-brand-fg-muted">Placement &amp; compensation</p>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-1 md:col-span-2">
                    <label className="px-1 text-[11px] font-bold uppercase tracking-tighter text-brand-fg-muted">Current company</label>
                    <input
                      className="windows-input w-full"
                      value={details.currentCompany}
                      onChange={(e) => setDetails((d) => ({ ...d, currentCompany: e.target.value }))}
                      placeholder="Employer or Freelance"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="px-1 text-[11px] font-bold uppercase tracking-tighter text-brand-fg-muted">Current CTC (LPA)</label>
                    <input
                      className="windows-input w-full"
                      value={details.currentCtc}
                      onChange={(e) => setDetails((d) => ({ ...d, currentCtc: e.target.value }))}
                      placeholder="e.g. 8"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="px-1 text-[11px] font-bold uppercase tracking-tighter text-brand-fg-muted">Expected CTC (LPA)</label>
                    <input
                      className="windows-input w-full"
                      value={details.expectedCtc}
                      onChange={(e) => setDetails((d) => ({ ...d, expectedCtc: e.target.value }))}
                      placeholder="e.g. 12"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="px-1 text-[11px] font-bold uppercase tracking-tighter text-brand-fg-muted">Notice period</label>
                    <input
                      className="windows-input w-full"
                      value={details.noticePeriod}
                      onChange={(e) => setDetails((d) => ({ ...d, noticePeriod: e.target.value }))}
                      placeholder="60 days, immediate..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="px-1 text-[11px] font-bold uppercase tracking-tighter text-brand-fg-muted">Referred by</label>
                    <input
                      className="windows-input w-full"
                      value={details.referredBy}
                      onChange={(e) => setDetails((d) => ({ ...d, referredBy: e.target.value }))}
                      placeholder="Alumni / employee name"
                    />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="windows-button-primary flex w-full items-center justify-center gap-2 py-3"
              >
                <Save size={16} />
                <span>{saving ? 'Saving...' : 'Save details'}</span>
              </button>
            </form>
          )}
        </div>

        <div className="space-y-6 windows-card p-8 lg:col-span-5">
          <div className="flex items-center gap-2">
            <BriefcaseBusiness size={18} className="text-brand-cyan" />
            <h3 className="text-lg font-bold text-brand-fg">Interview status</h3>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium text-brand-fg-muted">Current stage</span>
              <span className={cn('rounded border px-2 py-1 text-[10px] font-bold uppercase tracking-wider', stageClass(stage))}>
                {stageLabel(stage)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-brand-fg-muted">Company</span>
              <span className="font-semibold text-brand-fg">{interviewCompany || 'Not assigned yet'}</span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <span className="font-medium text-brand-fg-muted">Notes</span>
              <span className="max-w-[60%] break-words text-right font-medium text-brand-fg">
                {interviewNotes || 'No interview notes yet.'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-brand-fg-muted">Last update</span>
              <span className="text-[11px] font-semibold uppercase text-brand-fg-muted">
                {canShowInterviewDate ? formatDate(interviewUpdatedAt) : '—'}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-brand-fg-muted">
            Interview status is updated by admin. You can keep your profile details up to date for better matching.
          </p>
        </div>
      </div>
    </div>
  );
};
