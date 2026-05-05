'use client';

import React, { useState } from 'react';
import { FAQS } from '@/constants';
import { Plus, Minus } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="border border-slate-100 rounded-lg overflow-hidden transition-all">
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <span className="font-bold text-slate-900">{faq.q}</span>
                {openIndex === idx ? <Minus className="w-5 h-5 text-blue-600" /> : <Plus className="w-5 h-5 text-slate-400" />}
              </button>
              {openIndex === idx && (
                <div className="p-6 bg-white animate-in slide-in-from-top-2 duration-300">
                  <p className="text-slate-600 leading-relaxed font-medium">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
