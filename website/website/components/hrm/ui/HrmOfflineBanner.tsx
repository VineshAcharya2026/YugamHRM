'use client';

import { shouldShowOfflineBanner } from '@/lib/hrmConstants';

type Props = { token: string | null | undefined };

export default function HrmOfflineBanner({ token }: Props) {
  if (!shouldShowOfflineBanner(token)) return null;
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm font-medium text-amber-950">
      <span className="font-black">Offline demo</span> — start the HRM API on port{' '}
      <code className="rounded bg-amber-100/90 px-1.5 py-0.5 text-xs font-bold">8787</code> and sign in with email,
      password, or Google to load live data. This banner only appears when{' '}
      <code className="rounded bg-amber-100/90 px-1 text-xs">NEXT_PUBLIC_HRM_OFFLINE_DEMO=true</code>.
    </div>
  );
}
