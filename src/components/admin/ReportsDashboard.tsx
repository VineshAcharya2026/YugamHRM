import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, getDocs, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Users, FileText, CheckCircle, TrendingUp, ArrowUpRight, Search, X, Filter, DollarSign, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ReportsDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    totalResumes: 0,
    totalDocuments: 0,
    activeTraining: 24, // Mock
    placements: 12     // Mock
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [candidates, setCandidates] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const candidatesSnap = await getDocs(collection(db, 'candidates'));
      const resumes = await getDocs(collection(db, 'resumes'));
      const documents = await getDocs(collection(db, 'documents'));
      
      const candidateList = candidatesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCandidates(candidateList);

      setStats(prev => ({
        ...prev,
        totalCandidates: candidateList.length,
        totalResumes: resumes.size,
        totalDocuments: documents.size
      }));
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredCandidates = candidates.filter(c => {
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

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 opacity-30">
      <div className="w-10 h-10 rounded-full border-4 border-windows-accent border-t-transparent animate-spin mb-6" />
      <p className="text-sm font-bold uppercase tracking-widest">Loading your data...</p>
    </div>
  );

  return (
    <div className="space-y-10 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-black/5 pb-8 gap-6">
        <div className="flex-1">
          <h2 className="text-3xl font-bold tracking-tight text-[#1f1f1f]">Reports Overview</h2>
          <p className="text-xs font-semibold text-windows-accent uppercase tracking-[0.2em] mt-1">Live Business Updates</p>
        </div>
        
        {/* Master Filter */}
        <div className="relative w-full md:w-[400px] group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-windows-accent transition-colors flex items-center space-x-2">
            <Search size={18} />
          </div>
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Master Filter: e.g. 'DevOps', '5LPA', 'Google'..."
            className="windows-input w-full !pl-12 !pr-10 !py-3 bg-white"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-black/5 rounded-full text-black/30 hover:text-red-500 transition-all"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="text-right hidden md:block">
          <p className="text-[10px] font-bold text-black/30 uppercase">Last Sync</p>
          <p className="text-xs font-bold text-black/60">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {searchTerm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="windows-card p-0 overflow-hidden border-2 border-windows-accent/20">
              <div className="bg-windows-accent/5 p-4 border-b border-windows-accent/10 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                   <Filter size={14} className="text-windows-accent" />
                   <h3 className="text-xs font-bold uppercase tracking-[0.1em] text-[#1f1f1f]">
                     Search Results <span className="opacity-40 font-medium">({filteredCandidates.length} matches)</span>
                   </h3>
                </div>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {filteredCandidates.length > 0 ? (
                  <div className="divide-y divide-black/5">
                    {filteredCandidates.map((candidate) => (
                      <div key={candidate.id} className="p-4 flex items-center justify-between hover:bg-black/[0.02] transition-colors group">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-10 h-10 rounded-xl bg-windows-accent/10 flex items-center justify-center text-windows-accent font-bold shadow-sm">
                            {candidate.name?.[0]}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-[#1f1f1f] truncate">{candidate.name}</h4>
                            <div className="flex items-center space-x-3 text-[10px] font-bold opacity-40 uppercase tracking-tighter mt-0.5">
                              <span className="flex items-center"><Briefcase size={10} className="mr-1" /> {candidate.skillDomain}</span>
                              <span className="flex items-center"><DollarSign size={10} className="mr-1" /> {candidate.currentCtc}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 ml-4">
                           <div className="text-right hidden sm:block">
                              <p className="text-[10px] font-bold opacity-30 uppercase">Company</p>
                              <p className="text-[11px] font-semibold">{candidate.currentCompany}</p>
                           </div>
                           <button className="p-2 rounded-lg hover:bg-windows-accent text-windows-accent hover:text-white transition-all shadow-sm">
                              <ArrowUpRight size={14} />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-xs font-bold text-black/20 uppercase tracking-widest italic">No candidates matching "{searchTerm}"</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="windows-card p-6 group hover:ring-2 hover:ring-windows-accent/20 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-xl bg-windows-accent/10 text-windows-accent shadow-sm group-hover:scale-110 transition-transform">
                <card.icon size={20} />
              </div>
              <div className="px-2 py-1 rounded-md bg-green-500/10 text-[10px] font-bold text-green-600 flex items-center">
                {card.trend} <ArrowUpRight size={10} className="ml-1" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{card.label}</p>
              <p className="text-4xl font-bold text-[#1f1f1f] mt-1 tracking-tighter">
                {card.value.toString().padStart(2, '0')}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 windows-card p-10">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-1.5 h-6 bg-windows-accent rounded-full"></div>
            <h3 className="text-lg font-bold text-[#1f1f1f] tracking-tight">Student Progress</h3>
          </div>
          <div className="space-y-8">
            {[
              { name: 'Cloud Engineering', count: 12, progress: 75, color: 'bg-windows-accent' },
              { name: 'Fullstack Dev', count: 8, progress: 40, color: 'bg-orange-500' },
              { name: 'DevOps Training', count: 15, progress: 90, color: 'bg-green-500' },
              { name: 'System Design', count: 5, progress: 20, color: 'bg-blue-600' },
            ].map((course, i) => (
               <div key={i} className="space-y-3">
                 <div className="flex justify-between items-end">
                   <div>
                     <p className="text-sm font-bold text-[#1f1f1f]">{course.name}</p>
                     <p className="text-[10px] font-medium text-black/40 uppercase">{course.count} Students Learning</p>
                   </div>
                   <span className="text-xs font-bold text-black/60">{course.progress}%</span>
                 </div>
                 <div className="h-2.5 w-full bg-black/5 rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                    className={`h-full ${course.color} shadow-sm`}
                   />
                 </div>
               </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 windows-card bg-black/[0.02] border-dashed p-8 border-2 border-black/5">
          <h3 className="text-xs font-bold text-black/40 uppercase tracking-[0.2em] mb-8 px-2">Recent Activity</h3>
          <div className="space-y-6">
            {[
              { action: 'Admin created candidate profile', time: '2m ago', type: 'create' },
              { action: 'Candidate uploaded Master Resume', time: '15m ago', type: 'upload' },
              { action: 'System generated monthly report', time: '1h ago', type: 'system' },
              { action: 'New placement: Vinesh (Google Cloud)', time: '3h ago', type: 'placement' },
              { action: 'Candidate updated skills: React, K8s', time: '5h ago', type: 'update' },
            ].map((log, i) => (
              <div key={i} className="flex items-start justify-between group cursor-default">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 rounded-full bg-windows-accent mt-2 opacity-30 group-hover:opacity-100 transition-opacity"></div>
                  <div>
                    <p className="text-[11px] font-bold text-[#1f1f1f] group-hover:text-windows-accent transition-colors">{log.action}</p>
                    <p className="text-[10px] font-medium text-black/30 mt-0.5">{log.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-3 bg-white text-[10px] font-bold uppercase tracking-widest text-black/60 rounded-xl border border-black/5 hover:bg-black/5 transition-all">
            Download Full History
          </button>
        </div>
      </div>
    </div>
  );
};
