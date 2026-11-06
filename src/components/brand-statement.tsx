'use client';

import { motion } from 'motion/react';
import { LineReveal, sectionEase, useQuietMotion } from './section-motion';

export function BrandStatement() {
  const reduce = useQuietMotion();

  return <section className="intro-statement statement-editorial" id="world-of-kritarra" aria-labelledby="statement-heading" data-section-motion={reduce ? 'static' : 'reveal'}>
    <div className="intro-statement-content">
      <span className="eyebrow statement-kicker">A world of Kritarra</span>
      <h2 id="statement-heading">
        <span className="statement-opening"><LineReveal reduce={reduce}>Some things are worn.</LineReveal></span>{' '}
        <span className="statement-second"><LineReveal reduce={reduce} delay={.1}>Others become <em>part of you.</em></LineReveal></span>
      </h2>
      <motion.p className="statement-note" initial={false} whileInView={reduce ? {} : { opacity: [0, 1], y: [6, 0] }} viewport={{ once: true, amount: .5 }} transition={{ duration: .6, delay: .2, ease: sectionEase }}>Bespoke diamonds and rare gemstones, chosen to feel like you.</motion.p>
    </div>
  </section>;
}
