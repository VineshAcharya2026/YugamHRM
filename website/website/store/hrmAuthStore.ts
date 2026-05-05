'use client';

import { create } from 'zustand';
import { HRM_OFFLINE_DEMO_TOKEN, isHrmOfflineDemoEnabled } from '@/lib/hrmConstants';
import type { HrmUser } from '@/types';

const OFFLINE_TOKEN = HRM_OFFLINE_DEMO_TOKEN;

const offlineDemoUser: HrmUser = {
  id: 1,
  name: 'Offline Demo Admin',
  email: 'admin@example.com',
  role: 'admin',
};

/** Drop stale offline-demo sessions when that mode is disabled (default for production). */
function getInitialAuthState(): { token: string | null; user: HrmUser | null } {
  if (typeof window === 'undefined') {
    return { token: null, user: null };
  }
  const raw = localStorage.getItem('hrm_auth_token');
  if (raw === OFFLINE_TOKEN && !isHrmOfflineDemoEnabled()) {
    localStorage.removeItem('hrm_auth_token');
    return { token: null, user: null };
  }
  if (raw === OFFLINE_TOKEN) {
    return { token: OFFLINE_TOKEN, user: offlineDemoUser };
  }
  return { token: raw, user: null };
}

type HrmAuthState = {
  token: string | null;
  user: HrmUser | null;
  hydrated: boolean;
  setAuth: (token: string, user: HrmUser) => void;
  setOfflineDemoAuth: () => void;
  setSessionUser: (user: HrmUser) => void;
  markHydrated: () => void;
  logoutLocal: () => void;
};

const initialAuth = getInitialAuthState();

export const useHrmAuthStore = create<HrmAuthState>((set) => ({
  token: initialAuth.token,
  user: initialAuth.user,
  hydrated: false,
  setAuth: (token, user) => {
    localStorage.setItem('hrm_auth_token', token);
    set({ token, user, hydrated: true });
  },
  setOfflineDemoAuth: () => {
    if (!isHrmOfflineDemoEnabled()) return;
    localStorage.setItem('hrm_auth_token', OFFLINE_TOKEN);
    set({ token: OFFLINE_TOKEN, user: offlineDemoUser, hydrated: true });
  },
  setSessionUser: (user) =>
    set((state) => ({
      user,
      token: state.token,
      hydrated: true,
    })),
  markHydrated: () => set({ hydrated: true }),
  logoutLocal: () => {
    localStorage.removeItem('hrm_auth_token');
    set({ token: null, user: null, hydrated: true });
  },
}));
