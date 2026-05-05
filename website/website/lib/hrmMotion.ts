'use client';

import gsap from 'gsap';

export function hrmTapFeedback(el: EventTarget | null) {
  const t = el instanceof HTMLElement ? el : null;
  if (!t) return;
  gsap.fromTo(t, { scale: 1 }, { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.out' });
}
