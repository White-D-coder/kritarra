'use client';

import { useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { craftJourneyBackground, craftJourneyChapters, type JourneyChapter, type JourneyImage } from '@/lib/craft-journey';
import { useQuietMotion } from './section-motion';
import './craft-journey.css';

function transitionAt(step: number, index: number) {
  const distance = step - index;
  const amount = Math.min(1, Math.max(0, (Math.abs(distance) - .1) / .8));
  const eased = amount * amount * (3 - 2 * amount);
  return { opacity: 1 - eased, offset: -Math.sign(distance) * eased };
}

function Chapter({ chapter, index, total, timeline, animated, active }: {
  chapter: JourneyChapter;
  index: number;
  total: number;
  timeline: MotionValue<number>;
  animated: boolean;
  active: boolean;
}) {
  // Both sides follow the same smoothed phase, including when scrolling reverses.
  const opacity = useTransform(timeline, step => transitionAt(step, index).opacity);
  const imageY = useTransform(timeline, step => transitionAt(step, index).offset * 14);
  const textY = useTransform(timeline, step => transitionAt(step, index).offset * 52);

  return <div className="journey-chapter" data-chapter={chapter.id} aria-hidden={animated && !active ? true : undefined} inert={animated && !active ? true : undefined}>
    <div className="journey-image-frame">
      <motion.div className="journey-image" style={{ opacity: animated ? opacity : 1, y: animated ? imageY : 0 }}>
        <img src={chapter.image.src} srcSet={chapter.image.srcSet} sizes="(max-width: 767px) 90vw, 49vw" width={chapter.image.width} height={chapter.image.height} alt={chapter.image.alt} style={{ objectPosition: chapter.imagePosition }} loading="lazy" decoding="async" />
      </motion.div>
    </div>
    <div className="journey-text-window">
      <motion.article className="journey-copy" style={{ opacity: animated ? opacity : 1, y: animated ? textY : 0 }}>
        <span className="journey-number">{chapter.number} / {String(total).padStart(2, '0')}</span>
        <h3>{chapter.title}</h3>
        <p>{chapter.description}</p>
        {chapter.ctaLabel && chapter.ctaHref && <Link href={chapter.ctaHref} className="text-link light">{chapter.ctaLabel}<span aria-hidden="true">↗</span></Link>}
      </motion.article>
    </div>
  </div>;
}

export function CraftJourney({ chapters = craftJourneyChapters, backgroundImage }: {
  chapters?: readonly JourneyChapter[];
  backgroundImage?: JourneyImage;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useQuietMotion();
  const animated = !reduce && chapters.length > 1;
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRef = useRef(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 60px', 'end end'] });
  // Damping is above critical: wheel steps ease out without bounce or overshoot.
  // Native document scrolling remains untouched.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: .8,
    restDelta: .00005,
    restSpeed: .00005,
  });
  const timeline = useTransform(smoothProgress, value => value * Math.max(0, chapters.length - 1));

  useMotionValueEvent(timeline, 'change', step => {
    if (animated) {
      const next = Math.min(chapters.length - 1, Math.max(0, Math.round(step)));
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActiveIndex(next);
      }
    }
  });

  if (!chapters.length) return null;
  const backdrop = backgroundImage ?? chapters.find(chapter => chapter.backgroundImage)?.backgroundImage ?? craftJourneyBackground;

  return <section ref={ref} id="making-of-a-jewel" className="craft-journey" aria-labelledby="journey-heading" data-journey-motion={animated ? 'scroll' : 'static'} style={{ '--journey-chapters': chapters.length } as CSSProperties}>
    <div className="journey-stage">
      <div className="journey-backdrop" aria-hidden="true"><img src={backdrop.src} srcSet={backdrop.srcSet} sizes="100vw" width={backdrop.width} height={backdrop.height} alt="" loading="lazy" decoding="async" /></div>
      <h2 id="journey-heading" className="sr-only">The making of a jewel, from design to polish</h2>
      <div className="journey-composition">
        {chapters.map((chapter, index) => <Chapter key={chapter.id} chapter={chapter} index={index} total={chapters.length} timeline={timeline} animated={animated} active={index === activeIndex} />)}
      </div>
      {animated && <ol className="journey-progress" aria-label="Journey chapters">
        {chapters.map((chapter, index) => <li key={chapter.id} aria-current={index === activeIndex ? 'step' : undefined}><span className="sr-only">{chapter.number}: {chapter.title}</span></li>)}
      </ol>}
    </div>
  </section>;
}
