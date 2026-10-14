'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SERVICES, STATS, getWhatsAppLink } from '@/constants';

const partnerCount = STATS.find((stat) => stat.label === 'Corporate Partners')?.value ?? '150+';

const Hero: React.FC = () => {
  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-ink">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label="A hiring interview, the kind of session Softivox runs for training and placement"
      >
        <source src="/hero-hiring.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/75 to-ink/35" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-24 sm:px-6 lg:px-8">
        <p className="section-title !text-leaf-200">Softivox Tech · Bengaluru</p>
        <h1 className="heading-display mb-4 max-w-3xl !text-white">Get an IT role, with packages up to 30 LPA</h1>
        <p className="mb-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
          The placement desk works with {partnerCount} hiring partners across product, consulting, and enterprise IT,
          and introduces you for the role you trained for — developer, consultant, data, or cloud.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="btn-primary"
            onClick={() =>
              window.open(
                getWhatsAppLink('Hi Softivox Tech! I want to enroll. Please share the next batch dates.'),
                '_blank',
              )
            }
          >
            Enroll now
          </button>
          <Link href="/programs" className="btn-secondary">
            Browse programs
          </Link>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <ArrowRight className="h-8 w-8 shrink-0 text-leaf-200" aria-hidden="true" />
          <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {SERVICES.map((service) => (
              <li key={service.id}>
                <Link
                  href={`/courses/${service.id}`}
                  className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:border-brand hover:bg-brand"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Hero;
