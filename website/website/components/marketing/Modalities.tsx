
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
    <section id="internship" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Designed for All Your Training Needs</h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto font-medium">End-to-end training and support for individuals and organizations.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {MODALITIES.map((item, idx) => (
            <div key={idx} className="p-8 rounded-[2rem] bg-slate-50 hover:bg-white border border-transparent hover:border-blue-100 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 mb-6 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
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
