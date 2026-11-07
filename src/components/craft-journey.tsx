'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useIsPresent, useMotionValueEvent, useScroll } from 'motion/react';
import { craftJourneyBackground, craftJourneyChapters, type JourneyChapter, type JourneyImage } from '@/lib/craft-journey';
import { sectionEase, useQuietMotion } from './section-motion';
import './craft-journey.css';

function Chapter({ chapter, total, animated }: {
  chapter: JourneyChapter;
  total: number;
  animated: boolean;
}) {
  const present = useIsPresent();

  return <motion.div
    className="journey-chapter"
    data-chapter={chapter.id}
    aria-hidden={animated && !present ? true : undefined}
    inert={animated && !present ? true : undefined}
    initial={animated ? { opacity: 0 } : false}
    animate={{ opacity: 1 }}
    exit={animated ? { opacity: 0, transition: { duration: .2, ease: [.4, 0, 1, 1] } } : undefined}
    transition={{ duration: .48, ease: sectionEase }}
  >
    <div className="journey-image-frame">
      <motion.div className="journey-image"
        initial={animated ? { y: 14 } : false}
        animate={{ y: 0 }}
        exit={animated ? { y: -8, transition: { duration: .2, ease: sectionEase } } : undefined}
        transition={{ duration: .78, ease: sectionEase }}
      >
        <img src={chapter.image.src} srcSet={chapter.image.srcSet} sizes="(max-width: 767px) 90vw, 49vw" width={chapter.image.width} height={chapter.image.height} alt={chapter.image.alt} style={{ objectPosition: chapter.imagePosition }} loading={animated ? 'eager' : 'lazy'} decoding="async" />
      </motion.div>
    </div>
    <div className="journey-text-window">
      <motion.article className="journey-copy"
        initial={animated ? { y: 18 } : false}
        animate={{ y: 0 }}
        exit={animated ? { y: -18, transition: { duration: .2, ease: sectionEase } } : undefined}
        transition={{ duration: .65, delay: animated ? .04 : 0, ease: sectionEase }}
      >
        <div className="journey-chapter-meta"><span>The art of making</span><span className="journey-number">{chapter.number} / {String(total).padStart(2, '0')}</span></div>
        <h3><span className="journey-title-mask"><motion.span
          initial={animated ? { y: '105%' } : false}
          animate={{ y: '0%' }}
          transition={{ duration: .7, delay: animated ? .04 : 0, ease: sectionEase }}
        >{chapter.title}</motion.span></span></h3>
        <motion.p initial={animated ? { opacity: 0, y: 6 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: animated ? .14 : 0, ease: sectionEase }}>{chapter.description}</motion.p>
        {chapter.ctaLabel && chapter.ctaHref && <Link href={chapter.ctaHref} className="text-link light">{chapter.ctaLabel}<span aria-hidden="true">↗</span></Link>}
      </motion.article>
    </div>
  </motion.div>;
}

export function CraftJourney({ chapters = craftJourneyChapters, backgroundImage }: {
  chapters?: readonly JourneyChapter[];
  backgroundImage?: JourneyImage;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useQuietMotion();
  const animated = !reduce && chapters.length > 1;
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const activeRef = useRef(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 60px', 'end end'] });

  useEffect(() => {
    if (!animated || !ref.current) return;
    const preloads: HTMLImageElement[] = [];
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      // Warm the local image cache before a chapter is first shown.
      for (const chapter of chapters) {
        const image = new Image();
        image.sizes = '(max-width: 767px) 90vw, 49vw';
        image.srcset = chapter.image.srcSet;
        image.src = chapter.image.src;
        image.decode().catch(() => {});
        preloads.push(image);
      }
      observer.disconnect();
    }, { rootMargin: '100% 0px' });
    observer.observe(ref.current);
    return () => { observer.disconnect(); preloads.length = 0; };
  }, [animated, chapters]);

  useMotionValueEvent(scrollYProgress, 'change', progress => {
    if (!animated) return;
    const step = progress * Math.max(0, chapters.length - 1);
    const previous = activeRef.current;
    const next = Math.min(chapters.length - 1, Math.max(0, Math.round(step)));
    // A small dead band stops trackpad jitter from repeatedly changing chapters.
    if (next !== previous && Math.abs(step - previous) > .58) {
      activeRef.current = next;
      setActiveIndex(next);
    }
  });

  if (!chapters.length) return null;
  const selected = chapters[Math.min(activeIndex, chapters.length - 1)];
  const backdrop = backgroundImage ?? chapters.find(chapter => chapter.backgroundImage)?.backgroundImage ?? craftJourneyBackground;

  return <section ref={ref} id="making-of-a-jewel" className="craft-journey" aria-labelledby="journey-heading" data-journey-motion={animated ? 'scroll' : 'static'} style={{ '--journey-chapters': chapters.length } as CSSProperties}>
    <div className="journey-stage">
      <div className="journey-backdrop" aria-hidden="true"><img src={backdrop.src} srcSet={backdrop.srcSet} sizes="100vw" width={backdrop.width} height={backdrop.height} alt="" loading="lazy" decoding="async" /></div>
      <h2 id="journey-heading" className="sr-only">The making of a jewel, from design to polish</h2>
      <div className="journey-composition">
        {animated ? <AnimatePresence initial={false} mode="wait" onExitComplete={() => setDisplayedIndex(activeRef.current)}>
          <Chapter key={selected.id} chapter={selected} total={chapters.length} animated />
        </AnimatePresence> : chapters.map(chapter => <Chapter key={chapter.id} chapter={chapter} total={chapters.length} animated={false} />)}
      </div>
      {animated && <ol className="journey-progress" aria-label="Journey chapters">
        {chapters.map((chapter, index) => <li key={chapter.id} aria-current={index === displayedIndex ? 'step' : undefined}><span className="sr-only">{chapter.number}: {chapter.title}</span></li>)}
      </ol>}
    </div>
  </section>;
}
