import React from 'react';
import { STATS } from '@/constants';

const Stats: React.FC = () => {
  return (
    <section className="border-y border-slate-100 bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-10 sm:gap-12 lg:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-black tracking-tight text-brand sm:text-4xl lg:text-5xl">{stat.value}</div>
              <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
