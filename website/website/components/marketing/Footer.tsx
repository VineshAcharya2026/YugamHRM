'use client';

import React from 'react';
import { Linkedin, Facebook, Globe, MapPin, Mail, Phone, ArrowRight } from 'lucide-react';
import { TRAINING_NAV_ITEMS, DASHBOARD_NAV_ITEM, getWhatsAppLink, marketingNavHref } from '@/constants';
import { SiteBrandMark } from '@/components/SiteBrandMark';

const Footer: React.FC = () => {
  const handleWhatsApp = () => {
    window.open(getWhatsAppLink("Hello! I'd like to talk to your admission desk."), '_blank');
  };

  return (
    <footer className="border-t border-slate-200 bg-slate-50/80 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="mb-6">
              <SiteBrandMark className="h-14 w-auto max-w-[280px] sm:h-16 sm:max-w-[320px]" />
            </div>
            <p className="mb-8 max-w-sm text-sm leading-relaxed text-slate-600">
              Training and placement support for cloud, data, AI, and enterprise stacks — plus optional HRM tooling for
              growing teams.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <Facebook className="h-4 w-4" />, href: '#' },
                { icon: <Linkedin className="h-4 w-4" />, href: '#' },
                { icon: <Globe className="h-4 w-4" />, href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-brand/30 hover:text-brand"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h5 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Navigate</h5>
            <ul className="space-y-3">
              {TRAINING_NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a
                    href={marketingNavHref(item.href)}
                    className="text-sm font-semibold text-slate-600 transition hover:text-brand"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="pt-2">
                <a
                  href={DASHBOARD_NAV_ITEM.href}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-white shadow-lift transition hover:bg-brand-600"
                >
                  {DASHBOARD_NAV_ITEM.label}
                </a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h5 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Contact</h5>
            <ul className="space-y-5 text-sm">
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <button type="button" onClick={handleWhatsApp} className="text-left font-semibold text-slate-800 hover:text-brand">
                  WhatsApp admissions
                </button>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span className="font-semibold text-slate-800">HR@yugamcloud.online</span>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                <span className="text-slate-600">Marathahalli, Bengaluru</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-card">
              <h6 className="mb-2 text-lg font-bold text-slate-900">Next cohort</h6>
              <p className="mb-6 text-sm text-slate-600">Share your profile — we&apos;ll suggest the fastest path to your target role.</p>
              <button
                type="button"
                onClick={handleWhatsApp}
                className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-brand py-3 text-sm font-semibold text-white transition hover:bg-brand-600"
              >
                Apply now
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = DASHBOARD_NAV_ITEM.href;
                }}
                className="w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-800 transition hover:border-brand/30 hover:bg-brand-50"
              >
                Open {DASHBOARD_NAV_ITEM.label}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 text-xs text-slate-500 sm:flex-row">
          <p className="font-semibold uppercase tracking-wider">&copy; {new Date().getFullYear()} YugamCloud.ai Academy</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="#" className="font-semibold uppercase tracking-wider hover:text-brand">
              Privacy
            </a>
            <a href="#" className="font-semibold uppercase tracking-wider hover:text-brand">
              Terms
            </a>
            <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              Admissions open
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
