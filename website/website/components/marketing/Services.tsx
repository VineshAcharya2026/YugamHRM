'use client';

import React from 'react';
import Link from 'next/link';
import { SERVICES } from '@/constants';
import { ArrowRight } from 'lucide-react';

const pastelShells = [
  'bg-sky-50 ring-sky-100/80',
  'bg-emerald-50 ring-emerald-100/80',
  'bg-amber-50 ring-amber-100/80',
  'bg-rose-50 ring-rose-100/80',
  'bg-violet-50 ring-violet-100/80',
  'bg-cyan-50 ring-cyan-100/80',
];

const Services: React.FC = () => {
  const featured = SERVICES.slice(0, 6);

  return (
    <section id="solutions" className="border-t border-slate-100 bg-[var(--surface-muted)] py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center lg:mb-16">
          <p className="section-title">Programs</p>
          <h2 className="heading-display mb-4 text-balance">Built for every role in your tech journey</h2>
          <p className="text-lg text-slate-600">
            From data platforms to AI, SAP, and cloud — pick a track that matches where you want to go next.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((service, i) => (
            <div
              key={service.id}
              className={`flex flex-col rounded-2xl p-6 ring-1 transition hover:-translate-y-0.5 hover:shadow-lift ${pastelShells[i % pastelShells.length]}`}
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 text-brand shadow-sm ring-1 ring-slate-100 [&_svg]:h-6 [&_svg]:w-6 [&_svg]:!text-brand">
                {service.icon}
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">{service.title}</h3>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-600">{service.description}</p>
              <Link
                href={`/courses/${service.id}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand-700"
              >
                View syllabus
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
