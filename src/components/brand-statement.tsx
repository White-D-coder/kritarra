'use client';

import { motion, useTransform } from 'motion/react';
import { LineReveal, sectionEase, useSectionMotion } from './section-motion';

export function BrandStatement() {
  const { ref, reduce, progress } = useSectionMotion();
  const textureY = useTransform(progress, [0, 1], [-24, 24]);
  const secondX = useTransform(progress, [0, 1], ['1.8%', '-1.8%']);

  return <section ref={ref} className="intro-statement statement-editorial" id="world-of-kritarra" aria-labelledby="statement-heading" data-section-motion={reduce ? 'static' : 'scroll'}>
    <motion.div className="intro-statement-texture" aria-hidden="true" style={{ y: reduce ? 0 : textureY }}>
      <img src="/images/textures/ivory-texture-2400.webp" srcSet="/images/textures/ivory-texture-960.webp 960w, /images/textures/ivory-texture-1600.webp 1600w, /images/textures/ivory-texture-2400.webp 2400w" sizes="100vw" width={6240} height={4160} alt="" loading="lazy" decoding="async" />
    </motion.div>
    <div className="intro-statement-content">
      <span className="eyebrow">A world of Kritarra</span>
      <h2 id="statement-heading">
        <LineReveal reduce={reduce}>Some things are worn.</LineReveal>
        <motion.span className="statement-second" style={{ x: reduce ? 0 : secondX }}><LineReveal reduce={reduce} delay={.12}>Others become <em>part of you.</em></LineReveal></motion.span>
      </h2>
      <motion.p initial={false} whileInView={reduce ? {} : { opacity: [0, 1], y: [14, 0] }} viewport={{ once: true, amount: .5 }} transition={{ duration: .8, delay: .2, ease: sectionEase }}>Bespoke diamonds and rare gemstones,<br />chosen to feel like you.</motion.p>
    </div>
  </section>;
}
