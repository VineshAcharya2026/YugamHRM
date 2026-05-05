import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Trophy, Briefcase, Users, TrendingUp, Star, MessageSquare, Gift, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

export const AlumnusDashboard: React.FC = () => {
  const { profile } = useAuth();

  const achievements = [
    { title: 'Cloud Specialist', date: 'Oct 2023', icon: Trophy, color: 'text-amber-800 bg-amber-500/15' },
    { title: 'Top Referrer', date: 'Jan 2024', icon: Star, color: 'text-brand-violet bg-brand-secondary-bg' },
  ];

  const opportunities = [
    { company: 'Google Cloud', role: 'Staff Engineer', salary: '$180k+', location: 'Remote' },
    { company: 'Microsoft', role: 'Solutions Architect', salary: '$165k+', location: 'Bangalore' },
  ];

  return (
    <div className="space-y-10 font-sans">
      <div className="flex flex-col justify-between border-b border-windows-border pb-8 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-cyan">Alumni Network</p>
          <h2 className="mt-1 text-4xl font-bold tracking-tight text-brand-fg">Status: Growing Fast</h2>
          <p className="mt-2 text-sm font-medium text-brand-fg-muted">
            Welcome back, {profile?.displayName}. Your career is looking great.
          </p>
        </div>
        <div className="mt-4 rounded-xl border border-windows-border bg-brand-info-bg/40 px-4 py-2 md:mt-0">
          <p className="text-[10px] font-bold uppercase text-brand-cyan">Current Employer</p>
          <p className="text-sm font-bold text-brand-fg">YugamCloud Partners</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { label: 'Referral Bonus', value: '$2,400', icon: Gift, trend: '+15%' },
              { label: 'Career Level', value: 'Senior', icon: TrendingUp, trend: 'Promoted' },
              { label: 'Network Size', value: '142', icon: Users, trend: '+4 New' },
            ].map((stat, i) => (
              <div key={i} className="group windows-card p-6 transition-all hover:translate-y-[-4px]">
                <div className="mb-4 flex items-start justify-between">
                  <div className="rounded-lg bg-brand-page p-2 text-brand-fg-disabled transition-colors group-hover:bg-brand-info-bg group-hover:text-brand-cyan">
                    <stat.icon size={18} />
                  </div>
                  <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">{stat.trend}</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-fg-muted">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-brand-fg">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="windows-card p-8">
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-lg font-bold text-brand-fg">Top Job Referrals</h3>
              <button className="text-[10px] font-bold uppercase text-brand-cyan hover:underline">View All Open Roles</button>
            </div>
            <div className="space-y-4">
              {opportunities.map((opp, i) => (
                <div
                  key={i}
                  className="group flex items-center justify-between rounded-xl border border-windows-border p-4 transition-colors hover:bg-brand-surface-hover"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-page text-brand-fg-disabled transition-colors group-hover:bg-brand-info-bg group-hover:text-brand-cyan">
                      <Briefcase size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-fg">{opp.role}</p>
                      <p className="text-[10px] font-medium text-brand-fg-muted">
                        {opp.company} • {opp.location}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-brand-fg">{opp.salary}</p>
                    <button className="text-[9px] font-bold text-brand-cyan hover:underline">REFER & EARN</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="windows-card p-6">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-brand-fg-muted">Badges & Credentials</h3>
            <div className="space-y-4">
              {achievements.map((item, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className={cn('rounded-xl p-2 shadow-sm', item.color)}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-fg">{item.title}</p>
                    <p className="text-[10px] font-medium uppercase text-brand-fg-muted">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="windows-card bg-brand-info-bg/50 p-6 shadow-xl shadow-brand-cyan/15">
            <div className="mb-6 flex items-center space-x-3">
              <MessageSquare size={20} className="text-brand-cyan" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-fg">Career Advisor</h3>
            </div>
            <p className="mb-6 text-xs leading-relaxed text-brand-fg-muted">
              Ready for your next step? Schedule a quick meeting with your YugamCloud helper.
            </p>
            <button className="windows-button-primary flex w-full items-center justify-center space-x-2 rounded-lg py-2.5 text-[10px] font-bold uppercase tracking-widest">
              <span>Book Session</span>
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
