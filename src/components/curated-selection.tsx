'use client';

import Link from 'next/link';
import { motion, useTransform } from 'motion/react';
import { ProductCard } from './catalog';
import { LineReveal, sectionEase, useSectionMotion } from './section-motion';
import { products } from '@/lib/catalog';

export function CuratedSelection() {
  const { ref, reduce, progress } = useSectionMotion();
  const leadY = useTransform(progress, [0, 1], [20, -20]);
  const companionY = useTransform(progress, [0, 1], [-14, 14]);

  return (
    <section ref={ref} className="curated-selection" id="curated-selection" aria-labelledby="curated-heading" data-section-motion={reduce ? 'static' : 'scroll'}>
      <div className="curated-selection-heading">
        <div>
          <span className="eyebrow">The collection</span>
          <h2 id="curated-heading"><LineReveal reduce={reduce}>Yours to <em>discover.</em></LineReveal></h2>
        </div>
        <Link className="curated-all-link" href="/collections/">View all creations</Link>
      </div>

      <div className="selection-grid" role="group" aria-label="Selected jewellery categories">
        {products.map((product, index) => (
          <motion.div key={product.id} className={`selection-item selection-item--${product.slug}`} style={{ y: reduce ? 0 : index % 2 === 0 ? leadY : companionY }}>
            <motion.div className="selection-card-reveal" initial={false} whileInView={reduce ? {} : { clipPath: ['inset(10% 0 0 0)', 'inset(0% 0 0 0)'], opacity: [.5, 1] }} viewport={{ once: true, amount: .12 }} transition={{ duration: 1.1, delay: index * .07, ease: sectionEase }}>
              <ProductCard product={product} index={index} imagePosition={product.slug === 'bracelets' ? '54% 24%' : product.slug === 'rings' ? '44% 40%' : '50% 40%'} />
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div className="selection-footnote">
        <p>Category previews · Individual creations and prices on request.</p>
      </div>
    </section>
  );
}
