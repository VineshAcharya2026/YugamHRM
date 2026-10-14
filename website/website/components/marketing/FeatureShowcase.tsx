import React from 'react';
import Link from 'next/link';
import { MARKETING_IMAGES } from '@/lib/marketingAssets';

const blocks = [
  {
    title: 'Live instruction & recordings',
    desc: 'Attend live sessions and revisit concepts on your schedule.',
    img: MARKETING_IMAGES.heroAi,
    href: '/programs',
  },
  {
    title: 'Industry-shaped projects',
    desc: 'Build artifacts you can discuss in interviews with confidence.',
    img: MARKETING_IMAGES.companies,
    href: '/placements',
  },
  {
    title: 'Mentor feedback loops',
    desc: 'Short feedback cycles so you correct course early, not at the end.',
    img: MARKETING_IMAGES.welcomeSecondary,
    href: '/about',
  },
];

const FeatureShowcase: React.FC = () => {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-14 max-w-3xl text-center lg:mb-16">
          <p className="section-title">How we teach</p>
          <h2 className="heading-display mb-4 text-balance">A studio, not a slide deck</h2>
          <p className="text-lg text-slate-600">
            Clear milestones, accountable mentors, and outcomes you can measure — not just slides to sit through.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {blocks.map((b) => (
            <Link
              key={b.title}
              href={b.href}
              className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-slate-50/30 shadow-card transition hover:border-brand/25 hover:shadow-lift"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={b.img} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/20 via-slate-900/5 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-lg font-bold text-ink group-hover:text-brand">{b.title}</h3>
                <p className="text-sm text-slate-600">{b.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;
