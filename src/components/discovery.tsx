'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Asset, Reveal } from './editorial';
import { campaign } from '@/lib/imagery';
import { sectionEase, useQuietMotion } from './section-motion';

const categories = [
  { name: 'Rings', photo: campaign['Dc-ogQ-vgSm'], position: '44% 40%' },
  { name: 'Necklaces', photo: campaign.DRE3aGHDKCw, position: '50% 45%' },
  { name: 'Earrings', photo: campaign.DMuceFtvoNP, position: '70% 40%' },
  { name: 'Bracelets', photo: campaign.DLK5DXfNPGi, position: '52% 32%' },
];

export function Discovery() {
  const reduce = useQuietMotion();
  return (
    <section className="discovery" id="discovery" aria-labelledby="discovery-heading" data-card-motion={reduce ? 'static' : 'reveal'}>
      <Reveal className="discovery-heading">
        <div>
          <span className="eyebrow">Find what speaks to you</span>
          <h2 id="discovery-heading">The art of <em>discovery.</em></h2>
        </div>
        <p>Rings, necklaces, earrings and bracelets.<br />Find a piece to make your own.</p>
      </Reveal>

      <nav className="discovery-grid" aria-label="Discover jewellery categories">
        {categories.map((category, index) => (
          <div key={category.name} className="discovery-tile">
            <Link
              className="discovery-category-card"
              href={`/collections/${category.name.toLowerCase()}/`}
              aria-label={`Explore ${category.name}`}
            >
              <motion.div className="discovery-media" initial={false} whileInView={reduce ? {} : { clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'] }} viewport={{ once: true, amount: .12 }} transition={{ duration: 1.1, delay: index * .08, ease: sectionEase }}>
                <Asset photo={category.photo} position={category.position} sizes="(max-width: 767px) 50vw, 25vw" />
              </motion.div>
              <motion.div className="discovery-card-caption" initial={false} whileInView={reduce ? {} : { opacity: [0, 1], y: [14, 0] }} viewport={{ once: true, amount: .15 }} transition={{ duration: .7, delay: .25 + index * .08, ease: sectionEase }}>
                <h3>{category.name}</h3>
                <span className="discovery-card-action" aria-hidden="true">Explore the collection</span>
              </motion.div>
            </Link>
          </div>
        ))}
      </nav>
    </section>
  );
}
