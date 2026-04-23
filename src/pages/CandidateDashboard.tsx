import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ResumeBuilder } from '../components/resume/ResumeBuilder';
import { CandidateSearch } from '../components/admin/CandidateSearch';
import { DocumentManager } from '../components/documents/DocumentManager';
import { ReportsDashboard } from '../components/admin/ReportsDashboard';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  TrendingUp, 
  Clock, 
  Calendar,
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';
import { formatDate } from '../lib/utils';

import { cn } from '../lib/utils';

export const CandidateDashboard: React.FC = () => {
  const { profile } = useAuth();

  return (
    <div className="space-y-10 font-sans">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/5 pb-8">
        <div>
          <p className="text-[10px] font-bold text-windows-accent uppercase tracking-widest">Overview</p>
          <h2 className="text-4xl font-bold tracking-tight text-[#1f1f1f] mt-1">Hello, {profile?.displayName || profile?.email?.split('@')[0]}</h2>
        </div>
        <div className="mt-4 md:mt-0 text-right font-mono text-[10px] opacity-40">
          <p>LOC_TIME: {new Date().toLocaleTimeString()}</p>
          <p>SES_ID: {profile?.uid?.slice(0, 8).toUpperCase()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 windows-card p-8 flex flex-col items-center">
           <div className="w-24 h-24 rounded-full bg-gradient-to-br from-windows-accent to-blue-500 p-1 shadow-lg ring-4 ring-windows-accent/10 mb-6">
             <div className="w-full h-full rounded-full bg-[#141414] border-4 border-white flex items-center justify-center text-white text-3xl font-bold">
               {profile?.displayName?.[0] || 'U'}
             </div>
           </div>
           <h3 className="font-bold text-lg text-[#1f1f1f]">{profile?.displayName || 'Candidate'}</h3>
           <p className="text-xs font-medium opacity-50 mb-8">{profile?.email}</p>
           
           <div className="w-full space-y-4 pt-6 border-t border-black/5">
              <div className="flex justify-between items-center text-xs">
                <span className="opacity-50 font-medium">Profile Status</span>
                <span className="bg-green-500/10 text-green-600 px-2 py-0.5 rounded font-bold uppercase text-[9px]">Completed</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="opacity-50 font-medium">Learning Status</span>
                <span className="font-bold text-[#1f1f1f]">Ready for Jobs</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="opacity-50 font-medium">Resume Export</span>
                <span className="font-bold text-windows-accent">Enabled</span>
              </div>
           </div>
        </div>

        {/* Quick Stats & Actions */}
        <div className="lg:col-span-2 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="windows-card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                    <Clock size={18} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-60">Upcoming Classes</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-black/5 transition-all">
                    <span className="text-sm font-semibold">Cloud Architecture Learning</span>
                    <span className="text-[10px] font-bold bg-black/5 px-2 py-0.5 rounded">OCT-24</span>
                  </div>
                  <div className="flex justify-between items-center group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-black/5 transition-all">
                    <span className="text-sm font-semibold">Microservices Class</span>
                    <span className="text-[10px] font-bold bg-black/5 px-2 py-0.5 rounded">OCT-28</span>
                  </div>
                </div>
              </div>

              <div className="windows-card p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-50 text-windows-accent">
                    <Calendar size={18} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-60">Interview Schedule</span>
                </div>
                  <div className="flex items-center space-x-4 bg-black/5 p-3 rounded-xl border border-black/5">
                    <div className="bg-windows-accent text-white rounded-lg px-2 py-1 text-center min-w-[48px]">
                      <p className="text-[8px] font-bold uppercase">OCT</p>
                      <p className="text-lg font-bold leading-tight">30</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold">Google Cloud - Screening</p>
                      <p className="text-[10px] font-medium opacity-50 uppercase">10:00 AM IST</p>
                    </div>
                  </div>
              </div>
           </div>

           <div className="windows-card p-8">
             <h3 className="text-sm font-bold opacity-60 uppercase tracking-widest mb-6">Job Progress</h3>
             <div className="space-y-8 relative pb-4">
               {[
                 { step: 'Onboarding', status: 'done', label: 'Profile Setup Finished' },
                 { step: 'Learning', status: 'done', label: 'Technical Classes Finished' },
                 { step: 'Practice', status: 'current', label: 'Final Practice Interview Review' },
                 { step: 'Job Match', status: 'pending', label: 'Looking for your best match' },
               ].map((item, i) => (
                 <div key={i} className="flex items-start space-x-5 relative">
                   <div className={cn(
                     "w-10 h-10 flex items-center justify-center rounded-xl border-2 z-10 transition-all shadow-sm",
                     item.status === 'done' ? "border-green-500 bg-green-500 text-white" : 
                     item.status === 'current' ? "border-windows-accent bg-windows-accent text-white scale-110 shadow-lg" : "border-black/5 bg-white text-black/20"
                   )}>
                     {item.status === 'done' ? <CheckCircle size={20} /> : <span className="text-xs font-bold">{i + 1}</span>}
                   </div>
                   <div className="pt-0.5">
                     <p className={cn("text-xs uppercase font-bold", item.status === 'pending' ? "opacity-20" : "text-[#1f1f1f]")}>{item.step}</p>
                     <p className={cn("text-[11px] opacity-50 font-medium", item.status === 'pending' && "hidden")}>{item.label}</p>
                   </div>
                   {i < 3 && (
                     <div className={cn(
                       "absolute left-5 top-10 w-0.5 h-8 -translate-x-1/2",
                       item.status === 'done' ? "bg-green-500/30" : "bg-black/5"
                     )}></div>
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
