'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HRM_NAV_ENTRIES } from '@/components/hrm/layout/hrmNavConfig';

export default function HrmMobileNav() {
  const pathname = usePathname();
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-md lg:hidden"
      aria-label="HRM quick navigation"
    >
      <div className="flex max-w-full snap-x snap-mandatory gap-0 overflow-x-auto overflow-y-hidden px-1 pb-[env(safe-area-inset-bottom)]">
        {HRM_NAV_ENTRIES.map(({ label, href, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-w-[4.25rem] shrink-0 snap-start flex-col items-center gap-1 px-2 py-2.5 text-[9px] font-black uppercase tracking-wide transition-colors ${
                active ? 'text-brand' : 'text-slate-500'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="line-clamp-2 text-center leading-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
