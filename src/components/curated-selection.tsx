'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Asset } from './editorial';
import { useStore } from './store';
import { LineReveal, sectionEase, useQuietMotion } from './section-motion';
import { products, priceLabel } from '@/lib/catalog';

export function CuratedSelection() {
  const [active, setActive] = useState(0);
  const reduce = useQuietMotion();
  const { wishlist, toggleWish } = useStore();
  const selected = products[active];
  const saved = wishlist.includes(selected.id);
  const position = selected.slug === 'bracelets' ? '54% 24%' : selected.slug === 'rings' ? '44% 40%' : '50% 40%';

  return (
    <section className="curated-selection" id="curated-selection" aria-labelledby="curated-heading" data-section-motion={reduce ? 'static' : 'select'}>
      <div className="curated-selection-heading">
        <div>
          <span className="eyebrow">The collection</span>
          <h2 id="curated-heading"><LineReveal reduce={reduce}>Yours to <em>discover.</em></LineReveal></h2>
        </div>
        <Link className="curated-all-link" href="/collections/">View all creations</Link>
      </div>

      <div className="selection-viewer">
        <div className="selection-preview" id="selection-preview" aria-label={`${selected.name} preview`}>
          <Link className="selection-image-link" href={`/products/${selected.slug}/`} aria-label={`Explore ${selected.name}`}>
            <AnimatePresence initial={false}>
              <motion.div key={selected.id} className="selection-photograph" initial={reduce ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? { opacity: 0 } : { opacity: 0, x: -16 }} transition={{ duration: reduce ? 0 : .45, ease: sectionEase }}>
                <Asset src={selected.images[0]} label={`${selected.category} campaign photograph`} position={position} />
              </motion.div>
            </AnimatePresence>
          </Link>
          <button className={`selection-save ${saved ? 'saved' : ''}`} type="button" aria-label={`${saved ? 'Remove' : 'Save'} ${selected.name} ${saved ? 'from' : 'to'} wishlist`} aria-pressed={saved} onClick={() => toggleWish(selected.id)}><Heart size={18} fill={saved ? 'currentColor' : 'none'} /></button>
        </div>
        <div className="selection-menu">
          <div className="selection-options" role="group" aria-label="Choose a jewellery category">
            {products.map((product, index) => <button type="button" key={product.id} className={`selection-option ${index === active ? 'is-active' : ''}`} aria-pressed={index === active} aria-controls="selection-preview" onClick={() => setActive(index)}>{product.name}</button>)}
          </div>
          <noscript><style>{'.selection-options{display:none}'}</style><nav className="selection-fallback" aria-label="Explore jewellery categories">{products.map(product => <Link key={product.id} href={`/products/${product.slug}/`}>{product.name}</Link>)}</nav></noscript>
          <div className="selection-actions">
            <Link className="text-link" href={`/products/${selected.slug}/`}>Explore {selected.name.toLowerCase()}</Link>
            <p>{priceLabel(selected.price)}</p>
          </div>
          <p className="selection-disclosure">Category previews. Individual creations and prices on request.</p>
          <span className="sr-only" role="status">{selected.name} selected</span>
        </div>
      </div>
    </section>
  );
}
