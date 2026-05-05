'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useRef } from 'react';
import { LogOut, ExternalLink } from 'lucide-react';
import { useHrmAuthStore } from '@/store/hrmAuthStore';
import { hrmLogout } from '@/api/hrmAuth';
import { getHrmModuleMeta, isHrmModuleKey } from '@/lib/hrmModules';
import { gsap, useGSAP } from '@/lib/gsap';

function getPageTitle(pathname: string): string {
  if (pathname.startsWith('/hrm/login')) return 'Sign in';
  if (pathname.startsWith('/hrm/oauth')) return 'Google sign-in';
  const seg = pathname.split('/').pop() ?? '';
  if (!seg || seg === 'dashboard') return 'Overview';
  if (isHrmModuleKey(seg)) return getHrmModuleMeta(seg).title;
  return 'HRM';
}

export default function HrmTopbar() {
  const { token, user, logoutLocal } = useHrmAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (ref.current) {
        gsap.from(ref.current, { opacity: 0, y: -10, duration: 0.4, ease: 'power2.out' });
      }
    },
    { scope: ref, dependencies: [pathname] },
  );

  const handleLogout = async () => {
    if (token && token !== 'offline-demo-token') {
      try {
        await hrmLogout(token);
      } catch {
        // ignore
      }
    }
    logoutLocal();
    router.replace('/hrm/login');
  };

  return (
    <header
      ref={ref}
      className="flex shrink-0 items-center justify-between border-b border-slate-200/80 bg-white px-6 py-4"
    >
      <h1 className="text-xl font-black text-slate-900">{getPageTitle(pathname)}</h1>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 transition-colors hover:bg-slate-50"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Website
        </Link>
        {user ? (
          <div className="hidden text-right sm:block">
            <p className="text-xs font-black text-slate-900">{user.name}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{user.role}</p>
          </div>
        ) : null}
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3 py-2 text-xs font-black uppercase tracking-wider text-white transition-colors hover:bg-brand-600"
        >
          <LogOut className="h-3.5 w-3.5" />
          Logout
        </button>
      </div>
    </header>
  );
}
