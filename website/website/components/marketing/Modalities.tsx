
import React from 'react';
import { BookOpen, Monitor, Building2, UserCheck } from 'lucide-react';

const MODALITIES = [
  {
    title: "Classroom Training",
    description: "Efficient quality classroom training according to industry needs. Trainers with profound practice expertise.",
    icon: <BookOpen className="w-6 h-6" />
  },
  {
    title: "Online Training",
    description: "Tailored for individuals and employees working globally wishing to receive virtual professional training.",
    icon: <Monitor className="w-6 h-6" />
  },
  {
    title: "Corporate Training",
    description: "Software courses tailored to suit your company objectives. Specialists in IT expansion and guidance.",
    icon: <Building2 className="w-6 h-6" />
  },
  {
    title: "Internship Training",
    description: "Providing students with in-training and live projects as part of a final year curriculum.",
    icon: <UserCheck className="w-6 h-6" />
  }
];

const Modalities: React.FC = () => {
  return (
    <section id="internship" className="bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <p className="section-title">How you can learn</p>
          <h2 className="heading-display text-3xl sm:text-4xl">Classroom, online, corporate, internship</h2>
          <p className="mt-4 text-slate-600">Same curriculum. Pick the schedule that fits the week you already have.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {MODALITIES.map((item, idx) => (
            <div key={idx} className="group rounded-3xl border border-ink/10 bg-paper p-8 transition hover:-translate-y-0.5 hover:border-brand/30 hover:bg-white hover:shadow-card">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-paper transition group-hover:bg-brand">
                {item.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Modalities;
