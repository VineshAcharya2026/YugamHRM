import React, { useState, useEffect, useCallback } from 'react';
import { fetchAdminDashboardData, type CandidateRow } from '../../lib/adminFirestore';
import { Users, FileText, CheckCircle, TrendingUp, ArrowUpRight, Search, X, Filter, DollarSign, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ReportsDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    totalResumes: 0,
    totalDocuments: 0,
    activeTraining: 24,
    placements: 12,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const [dataError, setDataError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setDataError(null);
    const { stats: next, candidates: rows, error } = await fetchAdminDashboardData();
    setStats((prev) => ({ ...prev, ...next }));
    setCandidates(rows);
    setDataError(error);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filteredCandidates = candidates.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.skillDomain?.toLowerCase().includes(term) ||
      c.currentCompany?.toLowerCase().includes(term) ||
      c.currentCtc?.toLowerCase().includes(term) ||
      c.expectedCtc?.toLowerCase().includes(term) ||
      c.referredBy?.toLowerCase().includes(term)
    );
  });

  const metricCards = [
    { label: 'Total Candidates', value: stats.totalCandidates, icon: Users, trend: '+12%' },
    { label: 'Resumes Built', value: stats.totalResumes, icon: FileText, trend: '+5%' },
    { label: 'Documents Stored', value: stats.totalDocuments, icon: CheckCircle, trend: '+8%' },
    { label: 'Active Placements', value: stats.placements, icon: TrendingUp, trend: '+20%' },
  ];

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center p-20 text-brand-fg-muted">
        <div className="mb-6 h-10 w-10 animate-spin rounded-full border-4 border-brand-cyan border-t-transparent" />
        <p className="text-sm font-bold uppercase tracking-widest">Loading your data...</p>
      </div>
    );

  return (
    <div className="space-y-10 font-sans">
      <div className="flex flex-col items-start justify-between gap-6 border-b border-windows-border pb-8 md:flex-row md:items-center">
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight text-brand-fg">Reports Overview</h2>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-cyan">Live Business Updates</p>
        </div>

        <div className="group relative w-full md:w-[400px]">
          <div className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center space-x-2 text-brand-fg-disabled transition-colors group-focus-within:text-brand-cyan">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Master Filter: e.g. 'DevOps', '5LPA', 'Google'..."
            className="windows-input w-full !py-3 !pl-12 !pr-10"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-brand-fg-disabled transition-all hover:bg-brand-surface-hover hover:text-red-400"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="hidden text-right md:block">
          <p className="text-[10px] font-bold uppercase text-brand-fg-muted">Last Sync</p>
          <p className="text-xs font-bold text-brand-fg">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {dataError && (
        <div
          className="flex flex-col gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <span>{dataError}</span>
          <button
            type="button"
            onClick={() => void load()}
            className="shrink-0 rounded-md bg-amber-500 px-3 py-1.5 text-xs font-bold text-brand-cta-text hover:bg-amber-400"
          >
            Retry
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {searchTerm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="windows-card overflow-hidden border-2 border-brand-cyan/30 p-0">
              <div className="flex items-center justify-between border-b border-windows-border bg-brand-panel p-4">
                <div className="flex items-center space-x-2">
                  <Filter size={14} className="text-brand-cyan" />
                  <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-brand-fg">
                    Search Results <span className="font-medium text-brand-fg-muted">({filteredCandidates.length} matches)</span>
                  </h3>
                </div>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {filteredCandidates.length > 0 ? (
                  <div className="divide-y divide-windows-border">
                    {filteredCandidates.map((candidate) => (
                      <div key={candidate.id} className="group flex items-center justify-between p-4 transition-colors hover:bg-brand-surface-hover">
                        <div className="flex flex-1 items-center space-x-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-windows-border bg-brand-info-bg text-sm font-bold text-brand-cyan shadow-sm">
                            {candidate.name?.[0]}
                          </div>
                          <div className="min-w-0">
                            <h4 className="truncate text-sm font-bold text-brand-fg">{candidate.name}</h4>
                            <div className="mt-0.5 flex items-center space-x-3 text-[10px] font-bold uppercase tracking-tighter text-brand-fg-muted">
                              <span className="flex items-center">
                                <Briefcase size={10} className="mr-1" /> {candidate.skillDomain}
                              </span>
                              <span className="flex items-center">
                                <DollarSign size={10} className="mr-1" /> {candidate.currentCtc}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 flex items-center space-x-4">
                          <div className="hidden text-right sm:block">
                            <p className="text-[10px] font-bold uppercase text-brand-fg-muted">Company</p>
                            <p className="text-[11px] font-semibold text-brand-fg">{candidate.currentCompany}</p>
                          </div>
                          <button className="rounded-lg p-2 text-brand-cyan shadow-sm transition-all hover:bg-brand-info-bg">
                            <ArrowUpRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-xs font-bold uppercase italic tracking-widest text-brand-fg-disabled">
                      No candidates matching &quot;{searchTerm}&quot;
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group windows-card p-6 transition-all hover:ring-2 hover:ring-brand-cyan/25"
          >
            <div className="mb-6 flex items-start justify-between">
              <div className="rounded-xl bg-brand-info-bg p-3 text-brand-cyan shadow-sm transition-transform group-hover:scale-110">
                <card.icon size={20} />
              </div>
              <div className="flex items-center rounded-md bg-emerald-500/15 px-2 py-1 text-[10px] font-bold text-emerald-700">
                {card.trend} <ArrowUpRight size={10} className="ml-1" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-fg-muted">{card.label}</p>
              <p className="mt-1 text-4xl font-bold tracking-tighter text-brand-fg">{card.value.toString().padStart(2, '0')}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="windows-card p-10 lg:col-span-3">
          <div className="mb-8 flex items-center space-x-2">
            <div className="h-6 w-1.5 rounded-full bg-brand-cyan" />
            <h3 className="text-lg font-bold tracking-tight text-brand-fg">Student Progress</h3>
          </div>
          <div className="space-y-8">
            {[
              { name: 'Cloud Engineering', count: 12, progress: 75, color: 'bg-brand-cyan' },
              { name: 'Fullstack Dev', count: 8, progress: 40, color: 'bg-brand-violet' },
              { name: 'DevOps Training', count: 15, progress: 90, color: 'bg-emerald-500' },
              { name: 'System Design', count: 5, progress: 20, color: 'bg-brand-magenta' },
            ].map((course, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm font-bold text-brand-fg">{course.name}</p>
                    <p className="text-[10px] font-medium uppercase text-brand-fg-muted">{course.count} Students Learning</p>
                  </div>
                  <span className="text-xs font-bold text-brand-fg-muted">{course.progress}%</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-brand-page">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    className={`h-full ${course.color} shadow-sm`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="windows-card border-2 border-dashed border-windows-border bg-brand-page p-8 lg:col-span-2">
          <h3 className="mb-8 px-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-fg-muted">Recent Activity</h3>
          <div className="space-y-6">
            {[
              { action: 'Admin created candidate profile', time: '2m ago', type: 'create' },
              { action: 'Candidate uploaded Master Resume', time: '15m ago', type: 'upload' },
              { action: 'System generated monthly report', time: '1h ago', type: 'system' },
              { action: 'New placement: Vinesh (Google Cloud)', time: '3h ago', type: 'placement' },
              { action: 'Candidate updated skills: React, K8s', time: '5h ago', type: 'update' },
            ].map((log, i) => (
              <div key={i} className="group flex cursor-default items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="mt-2 h-2 w-2 rounded-full bg-brand-cyan opacity-40 transition-opacity group-hover:opacity-100" />
                  <div>
                    <p className="text-[11px] font-bold text-brand-fg transition-colors group-hover:text-brand-cyan">{log.action}</p>
                    <p className="mt-0.5 text-[10px] font-medium text-brand-fg-muted">{log.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="windows-button-secondary mt-10 w-full py-3 text-[10px] font-bold uppercase tracking-widest">
            Download Full History
          </button>
        </div>
      </div>
    </div>
  );
};
