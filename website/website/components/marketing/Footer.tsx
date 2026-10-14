'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  DASHBOARD_NAV_ITEM,
  SERVICES,
  TRAINING_NAV_ITEMS,
  getWhatsAppLink,
  marketingNavHref,
} from '@/constants';
import { SiteBrandMark } from '@/components/SiteBrandMark';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-ink/10 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <SiteBrandMark className="mb-4" />
            <p className="max-w-xs text-sm leading-relaxed text-slate-600">
              Instructor-led IT training in Bengaluru, with placement support for data, AI, SAP, and cloud roles.
            </p>
          </div>

          <div>
            <h5 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-brand">Programs</h5>
            <ul className="space-y-2">
              {SERVICES.map((course) => (
                <li key={course.id}>
                  <Link href={`/courses/${course.id}`} className="text-sm text-slate-700 hover:text-brand">
                    {course.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-brand">Company</h5>
            <ul className="space-y-2">
              {TRAINING_NAV_ITEMS.filter((item) => item.href !== '/').map((item) => (
                <li key={item.href}>
                  <a href={marketingNavHref(item.href)} className="text-sm text-slate-700 hover:text-brand">
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <Link href={DASHBOARD_NAV_ITEM.href} className="text-sm text-slate-700 hover:text-brand">
                  {DASHBOARD_NAV_ITEM.label}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-brand">Bengaluru</h5>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <a href={`tel:${CONTACT_PHONE_TEL}`} className="hover:text-brand">
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-brand">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>
                <a
                  href={getWhatsAppLink('Hi Softivox Tech, I would like to enroll.')}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-brand hover:underline"
                >
                  WhatsApp admissions
                </a>
              </li>
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>VRKH Building, Marathahalli</span>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-ink/10 pt-6 text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Softivox Tech. Admissions open in Bengaluru.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
