'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, MessageCircle, UserPlus } from 'lucide-react';
import { DASHBOARD_NAV_ITEM, getWhatsAppLink } from '@/constants';

export default function HrmCandidateIntake() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('');

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = [
      "Hi! I'd like to register interest in YugamCloud training / HRM.",
      name && `Name: ${name}`,
      email && `Email: ${email}`,
      phone && `Phone: ${phone}`,
      interest && `Program / goal: ${interest}`,
    ].filter(Boolean);
    window.open(getWhatsAppLink(lines.join('\n')), '_blank');
  };

  return (
    <section className="border-t border-slate-100 bg-[var(--surface-muted)] py-20 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="section-title">Candidate profile</p>
          <h2 className="heading-display mb-3 text-balance">Complete your details in the HRM dashboard</h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Sign in to the HRM portal to save your profile, skills, and placement-related information. Your updates sync
            to the same record your admissions team and mentors see.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
          <div className="flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-8 shadow-card sm:p-10">
            <div>
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white shadow-md">
                <UserPlus className="h-6 w-6" aria-hidden />
              </div>
              <h3 className="mb-2 text-xl font-bold text-slate-900">Already enrolled or have an account?</h3>
              <p className="mb-8 text-sm leading-relaxed text-slate-600">
                Open the dashboard to update your candidate record, upload documents, and track your journey.
              </p>
            </div>
            <Link
              href={DASHBOARD_NAV_ITEM.href}
              className="btn-primary inline-flex w-full items-center justify-center gap-2 sm:w-auto"
            >
              Go to HRM dashboard
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-8 shadow-card sm:p-10">
            <h3 className="mb-2 text-lg font-bold text-slate-900">New to YugamCloud?</h3>
            <p className="mb-6 text-sm text-slate-600">
              Share your details — we&apos;ll open WhatsApp with a prefilled message for our admissions desk (no account
              required on this page).
            </p>
            <form onSubmit={handleWhatsApp} className="space-y-4">
              <div>
                <label htmlFor="intake-name" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Name
                </label>
                <input
                  id="intake-name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/15"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="intake-email" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Email
                  </label>
                  <input
                    id="intake-email"
                    type="email"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/15"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label htmlFor="intake-phone" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Phone
                  </label>
                  <input
                    id="intake-phone"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/15"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91..."
                    autoComplete="tel"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="intake-interest" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Program or goal
                </label>
                <input
                  id="intake-interest"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand/40 focus:bg-white focus:ring-4 focus:ring-brand/15"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  placeholder="e.g. Snowflake, SAP ABAP, placement support"
                />
              </div>
              <button
                type="submit"
                className="btn-secondary inline-flex w-full items-center justify-center gap-2 border-brand/30 bg-brand-50 font-semibold text-brand-800 hover:bg-brand-100"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                Message admissions on WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
