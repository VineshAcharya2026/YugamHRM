'use client';

import React from 'react';
import { Mail, MessageCircle, MapPin, Send } from 'lucide-react';
import { getWhatsAppLink } from '@/constants';

const ContactForm: React.FC = () => {
  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const course = (document.querySelector('select') as HTMLSelectElement).value;
    const name = (document.querySelector('input[placeholder="First name"]') as HTMLInputElement).value;
    window.open(
      getWhatsAppLink(
        `Hi! I'm ${name || 'interested'}. I'd like to enroll in the ${course} batch. Please share the curriculum and details.`,
      ),
      '_blank',
    );
  };

  return (
    <section id="contact" className="border-t border-slate-100 bg-white py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="section-title">Contact</p>
          <h2 className="heading-display mb-3 text-balance">Let&apos;s start a conversation</h2>
          <p className="text-lg text-slate-600">Tell us about your background and goals — we&apos;ll route you to the right counselor.</p>
        </div>

        <div className="grid gap-10 overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-50/50 shadow-card lg:grid-cols-12">
          <div className="flex flex-col justify-between bg-brand p-8 text-white lg:col-span-4 lg:p-10">
            <div>
              <h3 className="mb-3 text-xl font-bold">Admissions desk</h3>
              <p className="mb-10 text-sm leading-relaxed text-white/90">
                Prefer WhatsApp? Use the form and we&apos;ll open a thread with your details prefilled.
              </p>
              <ul className="space-y-8">
                <li className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <MapPin className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Visit</p>
                    <p className="text-sm font-semibold">VRKH Building, Marathahalli, Bengaluru</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Email</p>
                    <p className="text-sm font-semibold">HR@yugamcloud.online</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">WhatsApp</p>
                    <p className="text-sm font-semibold">Tap send on the form →</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-8 lg:col-span-8 lg:p-10">
            <form onSubmit={handleWhatsApp} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">First name</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/15"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Last name</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/15"
                    placeholder="Last name"
                  />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Email</label>
                  <input
                    type="email"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/15"
                    placeholder="you@company.com"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/15"
                    placeholder="+91"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Program</label>
                <select className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/15">
                  <option>Snowflake Data Warehousing</option>
                  <option>Agentic AI &amp; LLMs</option>
                  <option>SAP ABAP on HANA</option>
                  <option>Java Full Stack</option>
                  <option>DevOps &amp; AWS</option>
                  <option>Python &amp; Data Science</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Message</label>
                <textarea
                  rows={4}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/15"
                  placeholder="Your goals, timeline, or questions…"
                />
              </div>
              <button type="submit" className="btn-primary w-full sm:w-auto">
                <Send className="h-4 w-4" />
                Send via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
