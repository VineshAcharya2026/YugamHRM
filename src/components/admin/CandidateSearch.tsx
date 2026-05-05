import React, { useState, useEffect } from 'react';
import { listCandidatesForAdmin, type CandidateRow } from '../../lib/adminFirestore';
import { Search, FileUser, ExternalLink, Mail, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { formatDate } from '../../lib/utils';

export const CandidateSearch: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateRow | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadError(null);
      const { candidates: rows, error } = await listCandidatesForAdmin();
      if (cancelled) return;
      if (error) {
        setLoadError(error);
        setCandidates([]);
      } else {
        setCandidates(rows);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const term = searchTerm.toLowerCase().trim();
  const filteredCandidates = candidates.filter((c) => {
    if (!term) return true;
    const haystack = [
      c.name,
      c.contactNo,
      c.emailId,
      c.currentCompany,
      c.skillDomain,
      c.currentCtc,
      c.expectedCtc,
      c.noticePeriod as string | undefined,
      c.isGenuine as string | undefined,
      c.referredBy,
      c.remarks as string | undefined,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(term);
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-brand-fg">Talent Pool</h2>
          <p className="text-xs font-medium opacity-40 uppercase tracking-widest mt-0.5">Directory of all registered candidates</p>
        </div>
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-fg-disabled group-focus-within:text-brand-cyan transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Master filter: name, company, phone, CTC, status, remarks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="windows-input w-full !pl-12"
          />
        </div>
      </div>

      {loadError && (
        <div
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {loadError}
        </div>
      )}

      <div className="windows-card overflow-hidden">
        <div className="grid grid-cols-[40px_2fr_1.5fr_1fr_1fr] p-2 border-b border-windows-border bg-brand-panel">
          <div className="col-header">#</div>
          <div className="col-header">Candidate</div>
          <div className="col-header">Specialization</div>
          <div className="col-header">Last Updated</div>
          <div className="col-header text-right">Options</div>
        </div>

        {loading ? (
          <div className="p-20 text-center flex flex-col items-center justify-center opacity-30">
            <div className="w-8 h-8 rounded-full border-2 border-brand-cyan border-t-transparent animate-spin mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest">Accessing Candidate Files...</p>
          </div>
        ) : loadError ? (
          <div className="p-20 text-center text-sm text-brand-fg-muted">Fix the error above, then refresh the page.</div>
        ) : filteredCandidates.length === 0 ? (
          <div className="p-20 text-center opacity-30 italic text-sm">No matching candidates found in the pool.</div>
        ) : (
          <div className="divide-y divide-windows-border">
            {filteredCandidates.map((candidate, idx) => (
              <div key={candidate.id} className="data-row grid grid-cols-[40px_2fr_1.5fr_1fr_1fr] p-3 items-center text-sm group">
                <div className="text-[10px] font-mono opacity-30">{(idx + 1).toString().padStart(2, '0')}</div>
                <div className="font-bold flex items-center space-x-3 text-brand-fg">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-brand-info-bg text-brand-cyan text-xs font-bold border border-brand-cyan/10">
                    {candidate.name?.[0] || '?'}
                  </div>
                  <span>{candidate.name || 'Unnamed candidate'}</span>
                </div>
                <div className="opacity-50 text-[11px] font-medium tracking-tight truncate pr-4">
                  {candidate.skillDomain || candidate.currentCompany || '-'}
                </div>
                <div className="text-[11px] font-semibold opacity-40 uppercase">{formatDate(candidate.createdAt)}</div>
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={() => setSelectedCandidate(candidate)} 
                    className="p-1.5 rounded-lg hover:bg-brand-info-bg text-brand-cyan transition-all group-hover:scale-110"
                    title="View Profile"
                  >
                    <FileUser size={18} />
                  </button>
                  {typeof candidate.resumeUrl === 'string' && candidate.resumeUrl ? (
                    <a
                      href={candidate.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg hover:bg-brand-surface-hover text-brand-fg-muted hover:text-brand-fg transition-all group-hover:scale-110"
                      title="Open Resume"
                    >
                      <ExternalLink size={18} />
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setSelectedCandidate(null)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative z-10 max-h-full w-full max-w-4xl overflow-y-auto rounded-2xl border border-windows-border bg-brand-surface shadow-2xl"
          >
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-windows-border bg-brand-panel p-8 backdrop-blur-sm">
              <div className="flex items-center space-x-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-cyan text-2xl font-bold text-brand-cta-text shadow-lg">
                  {selectedCandidate.name?.[0] || '?'}
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-brand-fg">{selectedCandidate.name || 'Unnamed candidate'}</h3>
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-cyan">{selectedCandidate.skillDomain || '-'}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="windows-button-secondary px-6 text-xs uppercase font-bold"
              >
                Close
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h4 className="mb-3 flex items-center text-[11px] font-bold uppercase tracking-widest text-brand-fg-muted">
                    <span className="mr-2 h-0.5 w-4 bg-brand-cyan" /> Lead Details
                  </h4>
                  <div className="space-y-3 rounded-xl border border-windows-border bg-brand-page p-6 text-sm shadow-sm">
                    <p><span className="opacity-50">Current company:</span> <span className="font-semibold">{selectedCandidate.currentCompany || '-'}</span></p>
                    <p><span className="opacity-50">Current CTC:</span> <span className="font-semibold">{selectedCandidate.currentCtc || '-'}</span></p>
                    <p><span className="opacity-50">Expected CTC:</span> <span className="font-semibold">{selectedCandidate.expectedCtc || '-'}</span></p>
                    <p><span className="opacity-50">Notice period:</span> <span className="font-semibold">{(selectedCandidate.noticePeriod as string) || '-'}</span></p>
                    <p><span className="opacity-50">Referred by:</span> <span className="font-semibold">{selectedCandidate.referredBy || '-'}</span></p>
                    <p><span className="opacity-50">Status:</span> <span className="font-semibold">{(selectedCandidate.isGenuine as string) || '-'}</span></p>
                    <div className="border-t border-windows-border pt-2">
                      <p className="opacity-50 text-[11px] uppercase tracking-wider mb-1">Remarks</p>
                      <p className="font-medium whitespace-pre-wrap">{(selectedCandidate.remarks as string) || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="windows-card bg-brand-info-bg/30 p-6">
                  <h4 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-brand-fg-muted">Contact Info</h4>
                  <div className="space-y-4 text-xs font-medium">
                    <div className="flex items-center space-x-3 truncate">
                       <Mail size={14} className="text-brand-cyan" />
                       <span className="opacity-70">{selectedCandidate.emailId || '-'}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                       <Phone size={14} className="text-brand-cyan" />
                       <span className="opacity-70">{selectedCandidate.contactNo || '-'}</span>
                    </div>
                  </div>
                </div>

                {typeof selectedCandidate.resumeUrl === 'string' && selectedCandidate.resumeUrl ? (
                  <a
                    href={selectedCandidate.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="windows-button-secondary w-full text-center text-xs uppercase font-bold"
                  >
                    Open Uploaded Resume
                  </a>
                ) : (
                  <p className="text-xs opacity-50 text-center">No resume attached for this lead.</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
