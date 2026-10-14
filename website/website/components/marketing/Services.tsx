'use client';

import React from 'react';
import Link from 'next/link';
import { SERVICES } from '@/constants';

const Services: React.FC = () => {
  return (
    <section id="solutions" className="bg-[#f4f6fb] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="section-title">Courses</p>
          <h2 className="heading-display text-3xl sm:text-4xl">Job-oriented programs</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <Link
              key={service.id}
              href={`/courses/${service.id}`}
              className="flex h-full flex-col rounded-2xl bg-white p-3 shadow-[0_10px_28px_-16px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-18px_rgba(15,23,42,0.4)]"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-ink">
                <video
                  className="h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label={`${service.title} preview`}
                >
                  <source src={`/courses/${service.id}.mp4`} type="video/mp4" />
                </video>
              </div>
              <div className="flex flex-1 flex-col px-2 pb-2 pt-3">
                <img
                  src="/softivox-logo.jpg"
                  alt="Softivox Tech"
                  className="h-8 w-auto max-w-[180px] object-contain object-left"
                />
                <h3 className="mt-2 text-[1.05rem] font-semibold leading-snug text-ink">{service.title}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {service.level} · {service.duration}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-md bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-800">
                    {service.level}
                  </span>
                  <span className="rounded-md border border-sky-500 px-2 py-0.5 text-xs font-medium text-sky-700">
                    Enroll
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
