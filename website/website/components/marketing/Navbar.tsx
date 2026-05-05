'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { DASHBOARD_NAV_ITEM, TRAINING_NAV_ITEMS, marketingNavHref } from '@/constants';
import { SiteBrandMark } from '@/components/SiteBrandMark';

type Props = { isHrmContext?: boolean };

const Navbar: React.FC<Props> = ({ isHrmContext = false }) => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const showMarketingNav = !isHrmContext && !pathname?.startsWith('/hrm');

  return (
    <header className="sticky top-0 z-50 border-b border-[#2A3547] bg-[#1A2230]/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-3 rounded-xl bg-[#1A2230] px-2 py-1"
          aria-label="YugamCloud.ai home"
        >
          <SiteBrandMark className="h-12 w-auto max-w-[min(280px,72vw)] sm:h-14 md:h-16 md:max-w-[320px]" priority />
          {isHrmContext ? (
            <span className="hidden shrink-0 rounded-md bg-brand-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-700 sm:inline">
              HRM
            </span>
          ) : null}
        </Link>

        {showMarketingNav && !isHrmContext ? (
          <div className="hidden flex-1 flex-wrap items-center justify-center gap-1 lg:flex">
            {TRAINING_NAV_ITEMS.map((item) => (
              <a
                key={item.label + item.href}
                href={marketingNavHref(item.href)}
                className="rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>
        ) : null}

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {showMarketingNav && !isHrmContext ? (
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-lg border border-white/20 p-2.5 text-white lg:hidden"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          ) : null}
          <Link
            href={DASHBOARD_NAV_ITEM.href}
            className={`rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition sm:px-5 sm:text-sm ${
              isHrmContext
                ? 'border border-brand/30 bg-brand-50 text-brand-800 hover:bg-brand-100'
                : 'bg-brand text-white shadow-lift hover:bg-brand-600'
            }`}
          >
            {DASHBOARD_NAV_ITEM.label}
          </Link>
        </div>
      </nav>

      {showMarketingNav && !isHrmContext && menuOpen ? (
        <div className="border-t border-white/10 bg-[#1A2230] px-4 py-3 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-0.5">
            {TRAINING_NAV_ITEMS.map((item) => (
              <a
                key={item.label + item.href}
                href={marketingNavHref(item.href)}
                className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-100 hover:bg-white/10"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
