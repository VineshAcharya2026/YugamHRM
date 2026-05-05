
import React from 'react';
import { VALUE_PROPS } from '@/constants';

const WhyChooseUs: React.FC = () => {
  return (
    <section id="why-yugam" className="relative overflow-hidden border-y border-slate-200/80 bg-slate-50 py-32 text-slate-900">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-24 grid grid-cols-1 items-center gap-20 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-brand">The Yugam Advantage</h2>
            <h3 className="mb-8 text-4xl font-black leading-tight md:text-5xl">Engineered for Your Growth</h3>
            <p className="text-lg font-medium leading-relaxed text-slate-600">
              We don&apos;t just deploy solutions; we build resilient, future-proof systems that align with your strategic
              business objectives.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-card">
              <p className="mb-2 text-4xl font-black text-brand">98%</p>
              <p className="text-sm font-bold text-slate-600">Process Efficiency</p>
            </div>
            <div className="mt-8 rounded-2xl border border-slate-200/90 bg-white p-8 shadow-card">
              <p className="mb-2 text-4xl font-black text-brand">24/7</p>
              <p className="text-sm font-bold text-slate-600">Global Monitoring</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((prop, idx) => (
            <div
              key={idx}
              className="group flex flex-col items-start rounded-[2.5rem] border border-slate-200/90 bg-white p-8 shadow-sm transition-all duration-300 hover:border-brand/25 hover:shadow-lift"
            >
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-xl bg-brand text-white transition-transform group-hover:scale-110">
                {prop.icon}
              </div>
              <h4 className="mb-4 text-xl font-bold">{prop.title}</h4>
              <p className="text-sm font-medium leading-relaxed text-slate-600">{prop.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-0 top-0 h-[600px] w-[600px] -translate-y-1/2 translate-x-1/2 rounded-full bg-brand/10 blur-[200px]" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/2 translate-y-1/2 rounded-full bg-sky-400/10 blur-[150px]" />
    </section>
  );
};

export default WhyChooseUs;
