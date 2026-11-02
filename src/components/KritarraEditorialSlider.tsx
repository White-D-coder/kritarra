'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { Asset, TextLink } from './editorial';
import type { EditorialSlide } from '@/lib/signature-editorial';

type Props = {
  slides: readonly EditorialSlide[];
  id?: string;
  heading?: string;
  headingEmphasis?: string;
  eyebrow?: string;
  collectionHref?: string;
};

export function KritarraEditorialSlider({
  slides,
  id = 'signature',
  heading = 'The signature',
  headingEmphasis = 'edit.',
  eyebrow = 'CONSIDERED. COLLECTED. CHERISHED.',
  collectionHref = '/collections/',
}: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = windowRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track || slides.length < 2) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    // GSAP stays in a separate client chunk; server output remains a readable grid.
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const media = gsap.matchMedia();
      cleanup = () => media.revert();

      media.add({
        desktop: '(min-width: 1100px)',
        tablet: '(min-width: 768px) and (max-width: 1099px)',
        reduced: '(prefers-reduced-motion: reduce)',
      }, context => {
        const { desktop, tablet, reduced } = context.conditions as Record<string, boolean>;
        if (reduced || (!desktop && !tablet)) return;

        section.dataset.editorialMotion = 'diagonal';
        const staggerDepth = Math.max(...slides.map(slide => slide.offsetY));

        const animation = gsap.fromTo(track, { x: 0, y: 0 }, {
          x: () => -Math.max(0, track.scrollWidth - viewport.clientWidth),
          y: () => -Math.min(staggerDepth * (tablet ? 0.16 : 0.32), window.innerHeight * 0.05),
          ease: 'none',
          scrollTrigger: {
            id: `${id}-editorial`,
            trigger: viewport,
            start: 'top 50%',
            end: () => `+=${Math.round(window.innerHeight * (tablet ? 0.48 : 0.62))}`,
            scrub: 0.65,
            invalidateOnRefresh: true,
          },
        });

        // Only the parent track moves. Panel offsets and layering stay fixed.
        return () => {
          animation.scrollTrigger?.kill();
          animation.revert();
          track.style.removeProperty('transform');
          delete section.dataset.editorialMotion;
        };
      }, section);

      document.fonts.ready.then(() => {
        if (!cancelled && section.isConnected) ScrollTrigger.refresh();
      });
    }).catch(() => {
      // Static content remains available if the animation chunk cannot load.
      cleanup?.();
      track.style.removeProperty('transform');
      delete section.dataset.editorialMotion;
    });

    return () => {
      cancelled = true;
      cleanup?.();
      track.style.removeProperty('transform');
      delete section.dataset.editorialMotion;
    };
  }, [id, slides]);

  return (
    <section id={id} ref={sectionRef} className="kritarra-editorial" aria-labelledby={`${id}-heading`}>
      <div className="section-heading kritarra-editorial-heading">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2 id={`${id}-heading`}>{heading} <em>{headingEmphasis}</em></h2>
        </div>
        <TextLink href={collectionHref}>EXPLORE THE COLLECTION</TextLink>
      </div>

      <div ref={windowRef} className="kritarra-editorial-window">
        <div ref={trackRef} className="kritarra-editorial-track">
          {slides.map(slide => (
            <div
              key={slide.id}
              className={`kritarra-editorial-panel kritarra-editorial-panel--${slide.kind}`}
              data-panel={slide.id}
              style={{ '--editorial-offset': `${slide.offsetY}px`, zIndex: slide.depth } as CSSProperties}
            >
              {slide.kind === 'image' ? (
                <figure className="kritarra-editorial-image">
                  <Asset photo={slide.photo} fit="contain" sizes="(max-width: 767px) 100vw, (max-width: 1099px) 28vw, 32vw" />
                  <figcaption>{slide.caption}</figcaption>
                </figure>
              ) : (
                <div className="kritarra-editorial-copy">
                  <span className="kritarra-editorial-label">{slide.label}</span>
                  <p>{slide.passages.map((passage, index) => passage.italic
                    ? <em key={index}>{passage.text}</em>
                    : <span key={index}>{passage.text}</span>)}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
