'use client';

import React from 'react';
import { TESTIMONIALS } from '@/constants';
import { Star } from 'lucide-react';

const Testimonials: React.FC = () => {
  return (
    <section id="case-studies" className="bg-[var(--surface-muted)] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center lg:mb-16">
          <p className="section-title">Outcomes</p>
          <h2 className="heading-display mb-4 text-balance">Trusted by learners and teams</h2>
          <p className="text-lg text-slate-600">
            A few voices from recent cohorts — we measure success by the careers you build after the classroom.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.id}
              className="flex flex-col rounded-2xl border border-slate-100 bg-white p-8 shadow-card transition hover:border-brand/20 hover:shadow-lift"
            >
              <div className="mb-5 flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-brand text-brand" />
                ))}
              </div>
              <p className="mb-8 flex-1 text-base font-medium italic leading-relaxed text-slate-700">&ldquo;{t.content}&rdquo;</p>
              <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                <img src={t.image} alt="" className="h-12 w-12 rounded-full object-cover ring-2 ring-brand-50" />
                <div>
                  <p className="font-bold text-slate-900">{t.name}</p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand">
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
