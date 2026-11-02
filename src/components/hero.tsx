'use client';

import { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useReducedMotion } from 'motion/react';

const photographs = [
  {
    id: 'DdgV82YseoM', width: 1403, height: 1753,
    widths: [640, 1280, 1403],
    alt: 'A circular green-stone earring worn with a sheer green scarf',
    desktop: '50% 30%', mobile: '46% 45%',
  },
  {
    id: 'De1ch5_P4xb', width: 1136, height: 1408,
    widths: [640, 1136],
    alt: 'Three necklaces with green heart-shaped stones, framed by torn ivory paper',
    desktop: '50% 74%', mobile: '50% 60%',
  },
  {
    id: 'DdDpJ8EMryv', width: 3298, height: 4096,
    widths: [640, 1280, 1920],
    alt: 'Kritarra campaign portrait with a green-stone necklace and sculptural earrings',
    desktop: '50% 90%', mobile: '60% 60%',
  },
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
            className={`hero-slide ${active === index ? 'is-active' : ''}`}
            aria-hidden={active !== index}
            style={{ '--focal-desktop': photo.desktop, '--focal-mobile': photo.mobile } as React.CSSProperties}
          >
            <img
              src={`/images/hero/${photo.id}-${photo.widths.at(-1)}.webp`}
              srcSet={photo.widths.map(width => `/images/hero/${photo.id}-${width}.webp ${width}w`).join(', ')}
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

      <div className={`hero-slideshow-controls ${active === 1 ? 'on-light-image' : ''}`} role="group" aria-label="Campaign slideshow controls">
        {photographs.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            className={`hero-slide-selector ${active === index ? 'is-active' : ''}`}
            onClick={() => select(index)}
            aria-label={`Show campaign photograph ${index + 1}`}
            aria-pressed={active === index}
          ><span aria-hidden="true" /></button>
        ))}
        <button
          type="button"
          className="hero-playback"
          onClick={() => setPaused(value => !value)}
          aria-label={paused ? 'Play campaign slideshow' : 'Pause campaign slideshow'}
        >{paused ? <Play size={13} aria-hidden="true" /> : <Pause size={13} aria-hidden="true" />}</button>
      </div>
      <span className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</span>
    </section>
  );
}
