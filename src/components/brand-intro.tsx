'use client';

import { useEffect, useState } from 'react';

export function BrandIntro() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(false);
      return;
    }
    try {
      if (sessionStorage.getItem('kritarra-intro-seen')) {
        setVisible(false);
        return;
      }
      sessionStorage.setItem('kritarra-intro-seen', 'true');
    } catch {
      // The intro still completes when browser storage is unavailable.
    }
    const timer = window.setTimeout(() => setVisible(false), 1800);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return <div className="brand-intro" aria-hidden="true"><span>KRITARRA</span></div>;
}
