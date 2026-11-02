'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { campaign } from '@/lib/imagery';

const photographs = [
  { ...campaign.Dcn9jVgs_Iv, desktop: '50% 8%', mobile: '40% 40%', framing: 'opening' },
  { ...campaign.DdgV82YseoM, desktop: '50% 30%', mobile: '46% 45%', framing: 'cover' },
  { ...campaign.DdDpJ8EMryv, desktop: '50% 50%', mobile: '60% 60%', framing: 'portrait' },
];

export function Hero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(true);
  const [announcement, setAnnouncement] = useState('');
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    update();
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  useEffect(() => {
    if (paused || hovered || focused || reducedMotion !== false || !visible) return;
    const timer = window.setTimeout(() => setActive(index => (index + 1) % photographs.length), 8000);
    return () => window.clearTimeout(timer);
  }, [active, paused, hovered, focused, reducedMotion, visible]);

  const select = (index: number) => {
    setActive(index);
    setAnnouncement(`Photograph ${index + 1} of ${photographs.length}: ${photographs[index].alt}`);
  };

  return (
    <section
      className="hero hero-campaign"
      role="region"
      aria-roledescription="carousel"
      aria-label="Kritarra campaign photographs"
      data-active={active}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div className="hero-visual">
        {photographs.map((photo, index) => (
          <div
            key={photo.id}
            className={`hero-slide hero-slide--${photo.framing} ${active === index ? 'is-active' : ''}`}
            aria-hidden={active !== index}
            style={{ '--focal-desktop': photo.desktop, '--focal-mobile': photo.mobile, '--campaign-image': `url("${photo.src}")` } as React.CSSProperties}
          >
            <img
              src={photo.src}
              srcSet={photo.variants.filter(variant => variant.width >= 960).map(variant => `${variant.src} ${variant.width}w`).join(', ')}
              sizes="100vw"
              width={photo.width}
              height={photo.height}
              alt={photo.alt}
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'low'}
              decoding="async"
            />
          </div>
        ))}
      </div>

      <h1 className="sr-only">Kritarra — the art of adornment</h1>

      <div className="hero-keyboard-controls" role="group" aria-label="Campaign slideshow controls">
        {photographs.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            className="sr-only hero-keyboard-action"
            onClick={() => select(index)}
            aria-label={`Show campaign photograph ${index + 1}`}
            aria-pressed={active === index}
          >Photograph {index + 1}</button>
        ))}
        <button
          type="button"
          className="sr-only hero-keyboard-action hero-keyboard-playback"
          onClick={() => setPaused(value => !value)}
          aria-label={paused ? 'Play campaign slideshow' : 'Pause campaign slideshow'}
        >{paused ? 'Play slideshow' : 'Pause slideshow'}</button>
      </div>
      <span className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</span>
    </section>
  );
}
