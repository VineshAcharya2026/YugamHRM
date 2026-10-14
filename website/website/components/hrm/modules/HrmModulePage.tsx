'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock3 } from 'lucide-react';

type Props = {
  title: string;
  isLive: boolean;
};

const HrmModulePage: React.FC<Props> = ({ title, isLive }) => {
  const router = useRouter();
  return (
    <section className="rounded-3xl border border-white/40 bg-white/70 p-8 backdrop-blur-xl shadow-[0_10px_35px_rgba(15,23,42,0.08)]">
      <button
        type="button"
        onClick={() => router.push('/hrm/dashboard')}
        className="mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition-all hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </button>
      <h3 className="text-2xl font-black text-slate-900">{title}</h3>
      <p className="mt-2 text-sm font-medium text-slate-500">
        {isLive
          ? 'This module is live. Detailed pages can now be linked from here.'
          : 'This module is planned and listed in the dashboard roadmap.'}
      </p>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <Clock3 className="h-4 w-4 text-brand" />
          {isLive ? 'Live module workspace' : 'Coming soon module placeholder'}
        </div>
      </div>
    </section>
  );
};

export default HrmModulePage;
