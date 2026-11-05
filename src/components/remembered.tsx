'use client';

import { useEffect, useRef, useState } from 'react';

export function Remembered() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [allowMotion, setAllowMotion] = useState(false);
  const [inView, setInView] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [loadVideo, setLoadVideo] = useState(false);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const updatePreference = () => setAllowMotion(!preference.matches && !connection?.saveData);
    const updateVisibility = () => setPageVisible(!document.hidden);
    updatePreference();
    updateVisibility();
    preference.addEventListener('change', updatePreference);
    document.addEventListener('visibilitychange', updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.1 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', updatePreference);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (allowMotion && inView && pageVisible) setLoadVideo(true);
  }, [allowMotion, inView, pageVisible]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (loadVideo && allowMotion && inView && pageVisible && !paused && !failed) {
      video.muted = true;
      video.play().catch(error => {
        // Scrolling away can interrupt an in-flight play request normally.
        if (error.name !== 'AbortError') setFailed(true);
      });
    } else {
      video.pause();
    }
  }, [loadVideo, allowMotion, inView, pageVisible, paused, failed]);

  return (
    <section
      ref={sectionRef}
      id="remembered"
      className="philosophy philosophy-film"
      aria-labelledby="remembered-heading"
      data-video-ready={ready}
      data-motion={allowMotion && !failed ? 'video' : 'still'}
    >
      <div className="philosophy-media" aria-hidden="true">
        <img src="/videos/emerald-ring-poster.webp" alt="" width={1920} height={1080} loading="lazy" />
        <video
          ref={videoRef}
          src={loadVideo ? '/videos/emerald-ring.mp4' : undefined}
          poster="/videos/emerald-ring-poster.webp"
          muted
          loop
          playsInline
          preload="none"
          tabIndex={-1}
          onCanPlay={() => setReady(true)}
          onError={() => setFailed(true)}
        />
      </div>
      <div className="philosophy-film-copy">
        <span className="eyebrow">Beyond adornment</span>
        <h2 id="remembered-heading">Designed to be<br /><em>remembered.</em></h2>
        <p>Emeralds, diamonds and a lasting impression.</p>
        <span className="philosophy-signature">Kritarra</span>
      </div>
      {allowMotion && loadVideo && !failed && (
        <button type="button" className="philosophy-motion-control" aria-pressed={paused} onClick={() => setPaused(value => !value)}>
          {paused ? 'Play video' : 'Pause video'}
        </button>
      )}
    </section>
  );
}
