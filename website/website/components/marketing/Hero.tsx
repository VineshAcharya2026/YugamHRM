'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';
import { getWhatsAppLink, DASHBOARD_NAV_ITEM } from '@/constants';

function HeroDashboardPreview() {
  return (
    <div className="relative rounded-2xl border border-slate-200/90 bg-white shadow-[0_24px_80px_-16px_rgba(0,168,201,0.2)] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50/40 via-transparent to-sky-50/30 pointer-events-none" />
      <div className="relative flex min-h-[320px] sm:min-h-[380px] lg:min-h-[420px]">
        <div className="hidden sm:flex w-28 shrink-0 flex-col gap-2 border-r border-slate-100 bg-slate-50/90 p-3">
          {['Overview', 'Programs', 'Placements', 'Reports', 'Settings'].map((label, i) => (
            <div
              key={label}
              className={`rounded-lg px-2 py-2 text-[10px] font-semibold uppercase tracking-wide ${
                i === 0 ? 'bg-brand text-white shadow-md' : 'text-slate-500 hover:bg-white'
              }`}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Training ops</p>
              <p className="text-lg font-bold text-slate-900">Cohort pipeline</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
              Live admissions
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { v: '13+', l: 'Years', a: 'bg-brand text-white' },
              { v: '20k+', l: 'Alumni', a: 'bg-white text-slate-800 ring-1 ring-slate-100' },
              { v: '150+', l: 'Partners', a: 'bg-white text-slate-800 ring-1 ring-slate-100' },
            ].map((c) => (
              <div key={c.l} className={`rounded-xl p-3 shadow-sm ${c.a}`}>
                <p className="text-xl font-black leading-none sm:text-2xl">{c.v}</p>
                <p className={`mt-1 text-[9px] font-bold uppercase tracking-wider ${c.a.includes('text-white') ? 'text-white/85' : 'text-slate-500'}`}>
                  {c.l}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-2.5">
            {[72, 88, 64, 92, 58].map((w, j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="h-2 w-14 shrink-0 rounded bg-slate-100" />
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${w}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[35, 50, 40, 65].map((h, k) => (
              <div key={k} className="flex flex-col justify-end rounded-lg bg-slate-50 p-2 ring-1 ring-slate-100">
                <div className="mx-auto w-full max-w-[48px] rounded-t bg-brand/80" style={{ height: `${h}px` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 -top-28 h-[420px] w-[420px] rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-[380px] w-[380px] rounded-full bg-sky-100/60 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="section-title">YugamCloud.ai Academy</p>
            <h1 className="heading-display mb-6 text-balance">
              Simplify upskilling — training, placements &amp; HRM in one place
            </h1>
            <p className="mb-10 max-w-xl text-lg leading-relaxed text-slate-600">
              Expert-led programs in Snowflake, AI, SAP, cloud, and full-stack — with structured placement support and an
              optional HRM workspace for teams.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/programs" className="btn-primary">
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  window.open(
                    getWhatsAppLink('Hi! I would like a quick walkthrough of programs and the next batch dates.'),
                    '_blank',
                  )
                }
              >
                <Play className="h-4 w-4 text-brand" />
                Talk to admissions
              </button>
            </div>
            <p className="mt-8 text-sm text-slate-500">
              Prefer the app?{' '}
              <Link href={DASHBOARD_NAV_ITEM.href} className="font-semibold text-brand hover:underline">
                Open {DASHBOARD_NAV_ITEM.label}
              </Link>
            </p>
          </div>

          <div className="relative lg:pl-4">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-brand/5 via-transparent to-sky-100/40 blur-2xl" />
            <HeroDashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
