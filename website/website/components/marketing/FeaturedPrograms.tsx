'use client';

import React from 'react';
import Link from 'next/link';
import { SERVICES, getWhatsAppLink } from '@/constants';

const FEATURED_IDS = ['ai-consulting', 'snowflake', 'fullstack', 'devops-aws'];

const FeaturedPrograms: React.FC = () => {
  const featured = FEATURED_IDS.map((id) => SERVICES.find((service) => service.id === id)).filter(
    (service): service is (typeof SERVICES)[number] => Boolean(service),
  );

  return (
    <section className="bg-paper py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="section-title">Longer tracks</p>
          <h2 className="heading-display text-3xl sm:text-4xl">Programs built around a hiring target</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {featured.map((course) => (
            <article key={course.id} className="flex flex-col rounded-3xl border border-ink/10 bg-white p-7 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                {course.duration} · {course.level}
              </p>
              <h3 className="mt-3 font-display text-3xl text-ink">{course.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">{course.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() =>
                    window.open(
                      getWhatsAppLink(
                        `Hi Softivox Tech! I want to enroll in ${course.title}. Please share the next batch.`,
                      ),
                      '_blank',
                    )
                  }
                >
                  Enroll now
                </button>
                <Link href={`/courses/${course.id}`} className="btn-secondary">
                  View course
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPrograms;
