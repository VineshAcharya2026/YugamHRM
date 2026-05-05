'use client';

import { useEffect, useLayoutEffect } from 'react';
import { hrmGetMe } from '@/api/hrmAuth';
import { HRM_OFFLINE_DEMO_TOKEN, isHrmOfflineDemoEnabled } from '@/lib/hrmConstants';
import { useHrmAuthStore } from '@/store/hrmAuthStore';

/**
 * After mount: restore user from `/api/auth/me` when a real JWT exists, then mark hydrated.
 * Avoids infinite "Restoring session" and empty topbar after refresh.
 */
export default function HrmAuthHydrate() {
  useLayoutEffect(() => {
    const { token, logoutLocal } = useHrmAuthStore.getState();
    if (token === HRM_OFFLINE_DEMO_TOKEN && !isHrmOfflineDemoEnabled()) {
      logoutLocal();
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const { token, user, markHydrated, setSessionUser, logoutLocal } = useHrmAuthStore.getState();

      if (!token) {
        markHydrated();
        return;
      }

      if (token === HRM_OFFLINE_DEMO_TOKEN) {
        if (!isHrmOfflineDemoEnabled()) {
          logoutLocal();
        }
        markHydrated();
        return;
      }

      if (user) {
        markHydrated();
        return;
      }

      try {
        const me = await hrmGetMe(token);
        if (cancelled) return;
        const id = Number(me.sub);
        setSessionUser({
          id: Number.isFinite(id) ? id : 0,
          name: me.name,
          email: me.email,
          role: me.role,
        });
      } catch {
        if (!cancelled) {
          logoutLocal();
        }
      } finally {
        if (!cancelled) {
          useHrmAuthStore.getState().markHydrated();
        }
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
