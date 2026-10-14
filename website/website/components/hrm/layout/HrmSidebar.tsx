'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import { SiteBrandMark } from '@/components/SiteBrandMark';
import { HRM_NAV_ENTRIES } from '@/components/hrm/layout/hrmNavConfig';
import { gsap, useGSAP } from '@/lib/gsap';

export default function HrmSidebar() {
  const pathname = usePathname();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from('.sidebar-item', {
        opacity: 0,
        x: -16,
        stagger: 0.04,
        duration: 0.4,
        ease: 'power2.out',
      });
    },
    { scope: ref, dependencies: [] },
  );

  const linkClass = (active: boolean) =>
    [
      'sidebar-item flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors',
      active
        ? 'bg-brand text-white shadow-md shadow-brand/20'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    ].join(' ');

  return (
    <aside
      ref={ref}
      className="hidden h-full w-64 shrink-0 flex-col overflow-y-auto border-r border-slate-200/80 bg-white lg:flex"
    >
      <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-5">
        <SiteBrandMark />
        <p className="text-[10px] font-black uppercase tracking-widest text-brand">HRM</p>
      </div>

      <nav className="flex flex-1 flex-col space-y-1 px-3 py-4" aria-label="HRM modules">
        {HRM_NAV_ENTRIES.map((entry, index) => {
          const Icon = entry.icon;
          const active = entry.match(pathname);
          const showSectionLabel = index === 1;
          return (
            <React.Fragment key={entry.href}>
              {showSectionLabel ? (
                <p className="px-3 pb-1 pt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Modules
                </p>
              ) : null}
              <Link href={entry.href} className={linkClass(active)}>
                <Icon className="h-4 w-4 shrink-0" />
                {entry.label}
              </Link>
            </React.Fragment>
          );
        })}
      </nav>
    </aside>
  );
}
