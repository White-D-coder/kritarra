'use client';

import { motion, useTransform } from 'motion/react';
import { campaign } from '@/lib/imagery';
import { Asset, TextLink } from './editorial';
import { LineReveal, sectionEase, useSectionMotion } from './section-motion';

export function CraftStory() {
  const { ref, reduce, progress } = useSectionMotion();
  const photographY = useTransform(progress, [0, 1], [-18, 18]);

  return <section ref={ref} className="craft-story craft-editorial" id="details" aria-labelledby="details-heading" data-section-motion={reduce ? 'static' : 'scroll'}>
    <div className="craft-copy">
      <span className="eyebrow">A closer look</span>
      <h2 id="details-heading"><LineReveal reduce={reduce}>Beauty lies</LineReveal><span className="craft-title-tail"><LineReveal reduce={reduce} delay={.12}>in the <em>details.</em></LineReveal></span></h2>
      <motion.div className="craft-description" initial={false} whileInView={reduce ? {} : { opacity: [0, 1], y: [16, 0] }} viewport={{ once: true, amount: .5 }} transition={{ duration: .8, delay: .2, ease: sectionEase }}>
        <p>The setting. The stone. The way it catches the light.</p>
        <TextLink href="/about/">Explore the craft</TextLink>
      </motion.div>
    </div>
    <motion.div className="craft-visual" initial={false} whileInView={reduce ? {} : { clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'] }} viewport={{ once: true, amount: .2 }} transition={{ duration: 1.25, ease: sectionEase }}>
      <motion.div className="craft-photograph" style={{ y: reduce ? 0 : photographY }}><Asset photo={campaign.DW_HenXDHeO} label="Kritarra campaign portrait" position="50% 32%" sizes="(max-width: 767px) 100vw, 72vw" /></motion.div>
    </motion.div>
  </section>;
}
