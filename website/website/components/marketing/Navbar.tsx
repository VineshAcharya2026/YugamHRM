'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Phone, X } from 'lucide-react';
import {
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_TEL,
  DASHBOARD_NAV_ITEM,
  TRAINING_NAV_ITEMS,
  getWhatsAppLink,
  marketingNavHref,
} from '@/constants';
import { SiteBrandMark } from '@/components/SiteBrandMark';

type Props = { isHrmContext?: boolean };

const NAV_ORDER = ['/programs', '/placements', '/internship', '/about', '/faq', '/contact'];

const Navbar: React.FC<Props> = ({ isHrmContext = false }) => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const showMarketingNav = !isHrmContext && !pathname?.startsWith('/hrm');
  const navItems = NAV_ORDER.map((href) => TRAINING_NAV_ITEMS.find((item) => item.href === href)).filter(
    (item): item is (typeof TRAINING_NAV_ITEMS)[number] => Boolean(item),
  );

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

  return (
    <header className="sticky top-0 z-50">
      {showMarketingNav ? (
        <div className="bg-ink text-paper">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-2 text-xs font-semibold sm:px-6 lg:px-8">
            <a href={`tel:${CONTACT_PHONE_TEL}`} className="inline-flex items-center gap-1.5 hover:text-brand">
              <Phone className="h-3.5 w-3.5" />
              {CONTACT_PHONE_DISPLAY}
            </a>
            <a
              href={getWhatsAppLink('Hi Softivox Tech, I would like course details.')}
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand"
            >
              WhatsApp
            </a>
          </div>
        </div>
      ) : null}

      <nav className="border-b border-ink/10 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 shrink-0 items-center" aria-label="Softivox Tech home">
            <SiteBrandMark />
            {isHrmContext ? (
              <span className="ml-3 hidden shrink-0 rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-paper sm:inline">
                HRM
              </span>
            ) : null}
          </Link>

          {showMarketingNav ? (
            <div className="hidden flex-1 flex-wrap items-center justify-center gap-1 lg:flex">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <a
                    key={item.href}
                    href={marketingNavHref(item.href)}
                    className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                      active ? 'bg-ink text-paper' : 'text-ink/70 hover:bg-paper hover:text-ink'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
          ) : null}

          <div className="flex shrink-0 items-center gap-2">
            {showMarketingNav ? (
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-ink/15 p-2.5 text-ink lg:hidden"
                aria-expanded={menuOpen}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMenuOpen((o) => !o)}
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            ) : null}
            <Link
              href={DASHBOARD_NAV_ITEM.href}
              className={`rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition sm:px-5 sm:text-sm ${
                isHrmContext
                  ? 'border border-brand/30 bg-brand-50 text-brand-800 hover:bg-brand-100'
                  : 'bg-brand text-white hover:bg-brand-600'
              }`}
            >
              {DASHBOARD_NAV_ITEM.label}
            </Link>
          </div>
        </div>

        {showMarketingNav && menuOpen ? (
          <div className="border-t border-ink/10 bg-white px-4 py-3 lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={marketingNavHref(item.href)}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-ink hover:bg-paper"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
};

export default Navbar;
