'use client';

import React from 'react';
import { ALUMNI_SUCCESS, getWhatsAppLink } from '@/constants';

const Placements: React.FC = () => {
  return (
    <section id="placements" className="bg-paper py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="section-title">Placements</p>
            <h2 className="heading-display text-3xl sm:text-4xl">Recent outcomes</h2>
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={() =>
              window.open(
                getWhatsAppLink("Hi Softivox Tech! I'd like to know how placement support works for the next batch."),
                '_blank',
              )
            }
          >
            Ask about placements
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {ALUMNI_SUCCESS.map((alumni) => (
            <article
              key={alumni.name}
              className="min-w-[220px] flex-1 rounded-3xl border border-ink/10 bg-white p-6 shadow-card"
            >
              <p className="font-display text-3xl text-brand">{alumni.salary}</p>
              <h3 className="mt-3 text-lg font-semibold text-ink">{alumni.name}</h3>
              <p className="mt-1 text-sm text-slate-600">{alumni.role}</p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-slate-500">{alumni.course}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Placements;
