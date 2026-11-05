'use client';

import { useRef, useSyncExternalStore, type ReactNode } from 'react';
import { motion, useScroll } from 'motion/react';

const preferenceQuery = '(prefers-reduced-motion: reduce)';
function subscribePreference(update: () => void) {
  const preference = window.matchMedia(preferenceQuery);
  preference.addEventListener('change', update);
  return () => preference.removeEventListener('change', update);
}
const clientPreference = () => window.matchMedia(preferenceQuery).matches;
const serverPreference = () => true;

export const sectionEase = [.22, 1, .36, 1] as const;

export function useQuietMotion() {
  return useSyncExternalStore(subscribePreference, clientPreference, serverPreference);
}

export function useSectionMotion() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useQuietMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  return { ref, reduce, progress: scrollYProgress };
}

export function LineReveal({ children, reduce, delay = 0 }: { children: ReactNode; reduce: boolean; delay?: number }) {
  return <span className="motion-line"><motion.span className="motion-line-content" initial={false} whileInView={reduce ? {} : { y: ['105%', '0%'] }} viewport={{ once: true, amount: .5 }} transition={{ duration: 1, delay, ease: sectionEase }}>{children}</motion.span></span>;
}
