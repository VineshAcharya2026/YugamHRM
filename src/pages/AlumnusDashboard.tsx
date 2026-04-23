import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Trophy, 
  Briefcase, 
  Users, 
  TrendingUp, 
  Star, 
  MessageSquare,
  Gift,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const AlumnusDashboard: React.FC = () => {
  const { profile } = useAuth();

  const achievements = [
    { title: 'Cloud Specialist', date: 'Oct 2023', icon: Trophy, color: 'text-yellow-600 bg-yellow-50' },
    { title: 'Top Referrer', date: 'Jan 2024', icon: Star, color: 'text-purple-600 bg-purple-50' },
  ];

  const opportunities = [
    { company: 'Google Cloud', role: 'Staff Engineer', salary: '$180k+', location: 'Remote' },
    { company: 'Microsoft', role: 'Solutions Architect', salary: '$165k+', location: 'Bangalore' },
  ];

  return (
    <div className="space-y-10 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/5 pb-8">
        <div>
          <p className="text-[10px] font-bold text-windows-accent uppercase tracking-widest">Alumni Network</p>
          <h2 className="text-4xl font-bold tracking-tight text-[#1f1f1f] mt-1">Status: Growing Fast</h2>
          <p className="text-sm font-medium text-black/40 mt-2">Welcome back, {profile?.displayName}. Your career is looking great.</p>
        </div>
        <div className="mt-4 md:mt-0 bg-windows-accent/5 px-4 py-2 rounded-xl border border-windows-accent/10">
          <p className="text-[10px] font-bold text-windows-accent uppercase">Current Employer</p>
          <p className="text-sm font-bold text-[#1f1f1f]">YugamCloud Partners</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Stats */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Referral Bonus', value: '$2,400', icon: Gift, trend: '+15%' },
              { label: 'Career Level', value: 'Senior', icon: TrendingUp, trend: 'Promoted' },
              { label: 'Network Size', value: '142', icon: Users, trend: '+4 New' },
            ].map((stat, i) => (
              <div key={i} className="windows-card p-6 group hover:translate-y-[-4px] transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 rounded-lg bg-black/5 text-black/40 group-hover:bg-windows-accent/10 group-hover:text-windows-accent transition-colors">
                    <stat.icon size={18} />
                  </div>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase">{stat.trend}</span>
                </div>
                <p className="text-[10px] font-bold text-black/30 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-[#1f1f1f] mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="windows-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-[#1f1f1f]">Top Job Referrals</h3>
              <button className="text-[10px] font-bold text-windows-accent uppercase hover:underline">View All Open Roles</button>
            </div>
            <div className="space-y-4">
              {opportunities.map((opp, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-black/5 hover:bg-black/[0.02] transition-colors group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-black/5 flex items-center justify-center text-black/20 group-hover:bg-windows-accent/10 group-hover:text-windows-accent transition-colors">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1f1f1f]">{opp.role}</p>
                      <p className="text-[10px] font-medium text-black/40">{opp.company} • {opp.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#1f1f1f]">{opp.salary}</p>
                    <button className="text-[9px] font-bold text-windows-accent hover:underline">REFER & EARN</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-6">
          <div className="windows-card p-6">
            <h3 className="text-sm font-bold text-black/40 uppercase tracking-widest mb-6">Badges & Credentials</h3>
            <div className="space-y-4">
              {achievements.map((item, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className={cn("p-2 rounded-xl shadow-sm", item.color)}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1f1f1f]">{item.title}</p>
                    <p className="text-[10px] font-medium text-black/40 uppercase">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="windows-card p-6 bg-windows-accent text-white shadow-xl shadow-windows-accent/20">
            <div className="flex items-center space-x-3 mb-6">
               <MessageSquare size={20} />
               <h3 className="text-sm font-bold uppercase tracking-wider">Career Advisor</h3>
            </div>
            <p className="text-xs leading-relaxed opacity-80 mb-6">Ready for your next step? Schedule a quick meeting with your YugamCloud helper.</p>
            <button className="w-full py-2.5 bg-white text-windows-accent text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center space-x-2">
               <span>Book Session</span>
               <ExternalLink size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
