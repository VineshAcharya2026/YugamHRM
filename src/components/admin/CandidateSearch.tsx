import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Search, Filter, FileUser, ExternalLink, Download, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { formatDate } from '../../lib/utils';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { ResumeTemplate } from '../resume/ResumeTemplate';

export const CandidateSearch: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      const q = query(collection(db, 'resumes'), limit(50));
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCandidates(docs);
      setLoading(false);
    };
    fetchCandidates();
  }, []);

  const filteredCandidates = candidates.filter(c => 
    c.personal?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.skills?.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#1f1f1f]">Talent Pool</h2>
          <p className="text-xs font-medium opacity-40 uppercase tracking-widest mt-0.5">Directory of all registered candidates</p>
        </div>
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-windows-accent transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="windows-input w-full !pl-12"
          />
        </div>
      </div>

      <div className="windows-card overflow-hidden">
        <div className="grid grid-cols-[40px_2fr_1.5fr_1fr_1fr] p-2 bg-black/[0.02] border-b border-black/5">
          <div className="col-header">#</div>
          <div className="col-header">Candidate</div>
          <div className="col-header">Specialization</div>
          <div className="col-header">Last Updated</div>
          <div className="col-header text-right">Options</div>
        </div>

        {loading ? (
          <div className="p-20 text-center flex flex-col items-center justify-center opacity-30">
            <div className="w-8 h-8 rounded-full border-2 border-windows-accent border-t-transparent animate-spin mb-4" />
            <p className="text-xs font-bold uppercase tracking-widest">Accessing Candidate Files...</p>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="p-20 text-center opacity-30 italic text-sm">No matching candidates found in the pool.</div>
        ) : (
          <div className="divide-y divide-black/[0.03]">
            {filteredCandidates.map((candidate, idx) => (
              <div key={candidate.id} className="data-row grid grid-cols-[40px_2fr_1.5fr_1fr_1fr] p-3 items-center text-sm group">
                <div className="text-[10px] font-mono opacity-30">{(idx + 1).toString().padStart(2, '0')}</div>
                <div className="font-bold flex items-center space-x-3 text-[#1f1f1f]">
                  <div className="w-8 h-8 rounded-lg bg-windows-accent/10 flex items-center justify-center text-windows-accent text-xs font-bold border border-windows-accent/10">
                    {candidate.personal?.fullName?.[0]}
                  </div>
                  <span>{candidate.personal?.fullName}</span>
                </div>
                <div className="opacity-50 text-[11px] font-medium tracking-tight truncate pr-4">{candidate.personal?.tagline}</div>
                <div className="text-[11px] font-semibold opacity-40 uppercase">{formatDate(candidate.lastUpdated)}</div>
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={() => setSelectedCandidate(candidate)} 
                    className="p-1.5 rounded-lg hover:bg-windows-accent/10 text-windows-accent transition-all group-hover:scale-110"
                    title="View Profile"
                  >
                    <FileUser size={18} />
                  </button>
                  <PDFDownloadLink 
                    document={<ResumeTemplate data={candidate} />} 
                    fileName={`${candidate.personal?.fullName}.pdf`}
                    className="p-1.5 rounded-lg hover:bg-black/5 text-black/40 hover:text-black/80 transition-all group-hover:scale-110"
                    title="Export PDF"
                  >
                    <Download size={18} />
                  </PDFDownloadLink>
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
            className="bg-windows-bg w-full max-w-4xl max-h-full overflow-y-auto relative z-10 rounded-2xl shadow-2xl border border-white/20"
          >
            <div className="p-8 border-b border-black/5 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-20">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-windows-accent text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                  {selectedCandidate.personal?.fullName?.[0]}
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight text-[#1f1f1f]">{selectedCandidate.personal?.fullName}</h3>
                  <p className="text-xs font-semibold text-windows-accent uppercase tracking-widest">{selectedCandidate.personal?.tagline}</p>
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
                  <h4 className="text-[11px] font-bold text-black/40 uppercase tracking-widest mb-3 flex items-center">
                    <span className="w-4 h-0.5 bg-windows-accent mr-2"></span> Career Summary
                  </h4>
                  <p className="text-sm leading-relaxed text-black/80 bg-white p-6 rounded-xl border border-black/5 shadow-sm italic">
                    "{selectedCandidate.summary}"
                  </p>
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-black/40 uppercase tracking-widest mb-5 flex items-center">
                    <span className="w-4 h-0.5 bg-windows-accent mr-2"></span> Work Experience
                  </h4>
                  <div className="space-y-6">
                    {selectedCandidate.experience?.map((exp: any, i: number) => (
                      <div key={i} className="relative pl-8 group">
                        <div className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full bg-windows-accent shadow-[0_0_10px_rgba(0,120,212,0.4)] transition-all"></div>
                        {i < selectedCandidate.experience.length - 1 && (
                          <div className="absolute left-[4.5px] top-4 w-0.5 h-full bg-black/5"></div>
                        )}
                        <p className="text-sm font-bold text-[#1f1f1f]">{exp.position} <span className="font-medium text-black/40">at</span> {exp.company}</p>
                        <p className="text-[10px] font-bold text-windows-accent mt-0.5">{exp.startDate} — {exp.endDate}</p>
                        <p className="mt-3 text-[11px] leading-relaxed text-black/60 bg-black/5 p-4 rounded-lg">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="windows-card p-6 bg-windows-accent/5">
                  <h4 className="text-[11px] font-bold text-black/40 uppercase tracking-widest mb-4">Contact Info</h4>
                  <div className="space-y-4 text-xs font-medium">
                    <div className="flex items-center space-x-3 truncate">
                       <Mail size={14} className="text-windows-accent" />
                       <span className="opacity-70">{selectedCandidate.personal?.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                       <div className="w-3.5 h-3.5 rounded-full bg-windows-accent/10 flex items-center justify-center text-windows-accent">
                          <span className="text-[10px]">📞</span>
                       </div>
                       <span className="opacity-70">{selectedCandidate.personal?.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-black/40 uppercase tracking-widest mb-4 px-2">Expertise Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills?.map((skill: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-white border border-black/5 rounded-md text-[10px] font-bold text-black/70 shadow-sm hover:scale-105 transition-all cursor-default">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
