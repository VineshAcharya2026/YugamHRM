'use client';

import React, { useState } from 'react';
import { FAQS } from '@/constants';
import { Plus, Minus } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="section-title">FAQ</p>
          <h2 className="heading-display text-3xl sm:text-4xl">Questions before you enroll</h2>
        </div>
        
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="overflow-hidden rounded-2xl border border-ink/10 bg-paper">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="font-semibold text-ink">{faq.q}</span>
                {openIndex === idx ? <Minus className="h-5 w-5 shrink-0 text-brand" /> : <Plus className="h-5 w-5 shrink-0 text-slate-400" />}
              </button>
              {openIndex === idx ? (
                <div className="border-t border-ink/10 bg-white px-5 py-4">
                  <p className="leading-relaxed text-slate-600">{faq.a}</p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
