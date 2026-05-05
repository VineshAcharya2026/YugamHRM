'use client';

import React from 'react';
import { ALUMNI_SUCCESS, getWhatsAppLink } from '@/constants';
import { Trophy, ArrowUpRight } from 'lucide-react';

const Placements: React.FC = () => {
  const handleWhatsApp = () => {
    window.open(
      getWhatsAppLink(
        "Hello! I saw your successful placements. I'm interested in knowing how I can get placed in an MNC like your alumni.",
      ),
      '_blank',
    );
  };

  return (
    <section id="placements" className="relative overflow-hidden border-y border-slate-200/80 bg-white py-32">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-brand/20 bg-brand-50 px-4 py-2">
              <Trophy className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-black uppercase tracking-widest text-slate-600">Hall of Fame</span>
            </div>
            <h3 className="text-5xl font-black leading-tight tracking-tighter text-slate-900">
              Our Graduates Now <br />
              <span className="text-brand">Lead at Global MNCs.</span>
            </h3>
          </div>
          <button
            onClick={handleWhatsApp}
            className="flex w-fit transform items-center gap-3 rounded-2xl bg-brand px-10 py-5 text-lg font-black text-white shadow-lift transition-all hover:-translate-y-1 hover:bg-brand-600"
          >
            Claim Your Success <ArrowUpRight className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {ALUMNI_SUCCESS.map((alumni, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/80 p-8 shadow-sm transition-all hover:border-brand/25 hover:bg-white hover:shadow-md"
            >
              <div className="relative z-10">
                <div className="mx-auto mb-6 h-24 w-24 overflow-hidden rounded-lg border-2 border-slate-200 transition-colors group-hover:border-brand/40">
                  <img
                    src={`https://i.pravatar.cc/200?u=${alumni.name}`}
                    alt={alumni.name}
                    className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                  />
                </div>
                <h4 className="mb-1 text-xl font-black text-slate-900">{alumni.name}</h4>
                <p className="mb-4 text-sm font-bold text-brand">{alumni.course}</p>
                <div className="flex flex-col gap-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{alumni.role}</p>
                  <div className="rounded-md border border-brand/20 bg-brand-50 py-2 px-4">
                    <p className="text-sm font-black text-brand-800">{alumni.salary}</p>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-brand/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          ))}
        </div>

        <div className="mt-24 border-t border-slate-200 py-12">
          <p className="mb-12 text-center text-sm font-black uppercase tracking-[0.3em] text-slate-500">
            Trusted by the best in business
          </p>
          <div className="flex flex-wrap justify-center gap-16 opacity-50 grayscale">
            {['IBM', 'Accenture', 'Capgemini', 'Wipro', 'TCS', 'Infosys'].map((brand) => (
              <div key={brand} className="text-3xl font-black italic tracking-tighter text-slate-700">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute right-0 top-0 h-[800px] w-[800px] -translate-y-1/2 translate-x-1/2 rounded-full bg-brand/10 blur-[200px]" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] -translate-x-1/2 translate-y-1/2 rounded-full bg-sky-400/10 blur-[150px]" />
    </section>
  );
};

export default Placements;
