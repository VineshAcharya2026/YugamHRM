import React from 'react';
import { MARKETING_IMAGES } from '@/lib/marketingAssets';

const cards = [
  {
    title: 'Designed for working professionals',
    desc: 'Evening and weekend tracks so you can learn without pausing your career.',
    img: MARKETING_IMAGES.welcomePrimary,
  },
  {
    title: 'Hands-on, project-first curriculum',
    desc: 'Labs and capstones mirror what hiring managers expect in interviews.',
    img: MARKETING_IMAGES.interview,
  },
  {
    title: 'Placement-aligned outcomes',
    desc: 'Resume reviews, mock interviews, and partner introductions when you are ready.',
    img: MARKETING_IMAGES.jobs,
  },
];

const Welcome: React.FC = () => {
  return (
    <section id="about" className="bg-paper py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center lg:mb-16">
          <p className="section-title">Why Softivox Tech</p>
          <h2 className="heading-display mb-4 text-balance">Built for people who want a real IT role</h2>
          <p className="text-lg text-slate-600">
            Softivox Tech runs focused cohorts for working professionals and career switchers — labs, mentors, and
            placement support from our Bengaluru studio.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {cards.map((c) => (
            <article
              key={c.title}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/40 shadow-card transition hover:-translate-y-1 hover:border-brand/20 hover:shadow-lift"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={c.img} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-90" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-2 text-lg font-bold text-slate-900">{c.title}</h3>
                <p className="text-sm leading-relaxed text-slate-600">{c.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Welcome;
