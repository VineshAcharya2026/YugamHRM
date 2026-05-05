import React from 'react';
import Image from 'next/image';
import { Building2, Briefcase, Mic2 } from 'lucide-react';
import { MARKETING_IMAGES } from '@/lib/marketingAssets';

const TILES = [
  {
    title: 'Interview coaching',
    description: 'Mock panels, feedback loops, and communication drills aligned with hiring bar at top firms.',
    image: MARKETING_IMAGES.interview,
    alt: 'Professional job interview conversation',
    icon: Mic2,
  },
  {
    title: 'Roles & openings',
    description: 'Curated paths from fundamentals to specialist tracks that map to real job descriptions.',
    image: MARKETING_IMAGES.jobs,
    alt: 'Team collaborating on hiring and career growth',
    icon: Briefcase,
  },
  {
    title: 'Company network',
    description: 'Partners across product, consulting, and enterprise IT who trust our graduates.',
    image: MARKETING_IMAGES.companies,
    alt: 'Modern city skyline representing global companies',
    icon: Building2,
  },
];

const CareersSpotlight: React.FC = () => {
  return (
    <section id="careers" className="py-24 md:py-28 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-14 md:mb-16">
          <p className="text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-3">Careers</p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">
            From interviews to offers — built around real employers
          </h2>
          <p className="text-lg text-slate-600 font-medium leading-relaxed">
            High-touch preparation plus a hiring ecosystem so you are not learning in isolation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {TILES.map((tile) => (
            <article
              key={tile.title}
              className="group flex flex-col overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-sm shadow-slate-200/50 transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-200">
                <Image
                  src={tile.image}
                  alt={tile.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-md bg-white/95 text-blue-600 shadow-sm">
                  <tile.icon className="h-5 w-5" aria-hidden />
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-black text-slate-900 mb-2">{tile.title}</h3>
                <p className="text-sm text-slate-600 font-medium leading-relaxed">{tile.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareersSpotlight;
