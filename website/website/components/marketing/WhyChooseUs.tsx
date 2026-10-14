import React from 'react';
import { Check, X } from 'lucide-react';

const classroom = [
  'Slides with little time on a real codebase',
  'One recorded path and no mentor on the call',
  'A certificate, then you are on your own',
];

const softivox = [
  'Labs and capstones you can walk through in an interview',
  'Live sessions with trainers who still ship',
  'Resume reviews, mock interviews, and partner introductions',
];

const WhyChooseUs: React.FC = () => {
  return (
    <section id="why-softivox" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="section-title">Why Softivox</p>
          <h2 className="heading-display text-3xl sm:text-4xl">Training that stays close to the job</h2>
          <p className="mt-4 text-lg text-slate-600">
            Classroom, online, and corporate tracks share one bar: projects you can explain, and a placement desk that
            stays after the last class.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-ink/10 bg-paper p-8">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Classroom-only habits</h3>
            <ul className="mt-6 space-y-4">
              {classroom.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-ink p-8 text-paper">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-leaf-200">Softivox Tech</h3>
            <ul className="mt-6 space-y-4">
              {softivox.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-relaxed text-paper/90">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf-200" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
