'use client';

import React, { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Wallet,
  UserRoundSearch,
  CalendarCheck,
  Timer,
  Target,
  FolderKanban,
  BarChart3,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { HRM_MODULES } from '@/lib/hrmModules';
import type { HrmDashboardModule } from '@/types';
import { gsap, useGSAP } from '@/lib/gsap';
import { hrmTapFeedback } from '@/lib/hrmMotion';
import HrmEmployeesWidget from './HrmEmployeesWidget';
import HrmPayrollWidget from './HrmPayrollWidget';

const HrmDashboard: React.FC = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const modules = useMemo(() => [...HRM_MODULES] as HrmDashboardModule[], []);

  useGSAP(
    () => {
      gsap.from('.hrm-dashboard-widget', {
        opacity: 0,
        y: 24,
        stagger: 0.12,
        duration: 0.55,
        ease: 'power3.out',
      });
      gsap.from('.hrm-module-card', {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.5,
        ease: 'power2.out',
        delay: 0.2,
      });
    },
    { scope: containerRef, dependencies: [] },
  );

  const iconMap = {
    employees: Users,
    payroll: Wallet,
    recruitment: UserRoundSearch,
    leaves: CalendarCheck,
    attendance: Timer,
    performance: Target,
    documents: FolderKanban,
    reports: BarChart3,
    settings: Settings,
  } as const;

  const onCardClick = (module: HrmDashboardModule, event: React.MouseEvent<HTMLButtonElement>) => {
    hrmTapFeedback(event.currentTarget);
    router.push(module.route);
  };

  return (
    <div ref={containerRef} className="space-y-8">
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="hrm-dashboard-widget">
          <HrmEmployeesWidget />
        </div>
        <div className="hrm-dashboard-widget">
          <HrmPayrollWidget />
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-xl font-black text-slate-900">HRM Modules</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => {
            const Icon = iconMap[module.key];
            const isLive = module.status === 'live';
            return (
              <button
                key={module.key}
                type="button"
                onClick={(event) => onCardClick(module, event)}
                className="hrm-module-card group rounded-3xl border border-white/40 bg-white/70 p-6 text-left backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_45px_rgba(15,23,42,0.12)] focus:outline-none focus:ring-2 focus:ring-brand"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-2xl bg-brand-50 p-3 text-brand">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
                      isLive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isLive ? 'Live' : 'Coming Soon'}
                  </span>
                </div>
                <h4 className="text-lg font-black text-slate-900">{module.title}</h4>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">{module.description}</p>
                <div className="mt-4 flex items-center gap-2 text-sm font-bold text-brand">
                  Open Module
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default HrmDashboard;
