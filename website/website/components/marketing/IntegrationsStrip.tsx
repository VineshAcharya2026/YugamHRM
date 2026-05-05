import React from 'react';

const items = [
  { name: 'Google Workspace', detail: 'Calendars & meet' },
  { name: 'Microsoft 365', detail: 'Teams-friendly' },
  { name: 'Cloud labs', detail: 'AWS-aligned practice' },
  { name: 'HRM module', detail: 'Optional /hrm app' },
];

const IntegrationsStrip: React.FC = () => {
  return (
    <section className="border-y border-slate-100 bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="mb-8 text-center text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
          Integrated with your existing workflow
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {items.map((item) => (
            <div key={item.name} className="flex items-center gap-3 text-slate-700">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-sm font-black text-brand ring-1 ring-brand/15">
                {item.name.slice(0, 1)}
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationsStrip;
