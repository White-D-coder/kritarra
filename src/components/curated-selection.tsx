import Link from 'next/link';
import { ProductCard } from './catalog';
import { Reveal } from './editorial';
import { products } from '@/lib/catalog';

export function CuratedSelection() {
  return (
    <section className="curated-selection" id="curated-selection" aria-labelledby="curated-heading">
      <Reveal className="curated-selection-heading">
        <div>
          <span className="eyebrow">THE CONSIDERED SELECTION</span>
          <h2 id="curated-heading">Yours to <em>discover.</em></h2>
        </div>
        <Link className="curated-all-link" href="/collections/">VIEW ALL CREATIONS</Link>
      </Reveal>

      <div className="selection-grid" role="group" aria-label="Selected jewellery categories">
        {products.map((product, index) => (
          <Reveal key={product.id} className={`selection-item selection-item--${product.slug}`} delay={index * 0.05}>
            <ProductCard product={product} index={index} imagePosition={product.slug === 'bracelets' ? '50% 24%' : '50% 40%'} />
          </Reveal>
        ))}
      </div>

      <div className="selection-footnote">
        <p>Category previews · Individual creations and prices on request.</p>
        <span>SCROLL TO EXPLORE</span>
      </div>
    </section>
  );
}
