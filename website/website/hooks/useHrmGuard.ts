'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useHrmAuthStore } from '@/store/hrmAuthStore';

export function useHrmGuard() {
  const { token, hydrated } = useHrmAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    if (!token) router.replace('/hrm/login');
  }, [hydrated, token, router]);

  return { ready: hydrated && !!token };
}
