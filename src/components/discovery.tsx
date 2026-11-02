'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Asset, Reveal } from './editorial';
import { campaign } from '@/lib/imagery';

const categories = [
  { name: 'Rings', line: 'A world in a small detail.', photo: campaign['Dc-ogQ-vgSm'] },
  { name: 'Necklaces', line: 'A perspective, beautifully expressed.', photo: campaign.DRE3aGHDKCw },
  { name: 'Earrings', line: 'A little closer to individuality.', photo: campaign.DMuceFtvoNP },
  { name: 'Bracelets', line: 'Something to hold close.', photo: campaign.DLK5DXfNPGi },
];

export function Discovery() {
  const [active, setActive] = useState(0);
  const selected = categories[active];

  return (
    <section className="discovery" id="discovery" aria-labelledby="discovery-heading">
      <Reveal className="discovery-heading">
        <div>
          <span className="eyebrow">FIND WHAT SPEAKS TO YOU</span>
          <h2 id="discovery-heading">The art of <em>discovery.</em></h2>
        </div>
        <p>Different expressions.<br />An unmistakably personal choice.</p>
      </Reveal>

      <div className="discovery-gallery">
        <Reveal className="discovery-preview">
          <Link href={`/collections/${selected.name.toLowerCase()}/`} aria-label={`Explore ${selected.name} collection`}>
            <div className="discovery-photographs">
              {categories.map((category, index) => (
                <div key={category.name} className={`discovery-photograph ${active === index ? 'is-active' : ''}`} aria-hidden={active !== index}>
                  <Asset photo={category.photo} fit="contain" sizes="(max-width: 767px) 1px, 48vw" />
                </div>
              ))}
            </div>
            <div className="discovery-preview-caption">
              <span>0{active + 1} / {selected.name.toUpperCase()}</span>
              <span className="discovery-explore">EXPLORE {selected.name.toUpperCase()}</span>
            </div>
          </Link>
        </Reveal>

        <nav className="discovery-categories" aria-label="Discover jewellery categories">
          {categories.map((category, index) => (
            <Reveal key={category.name}>
              <Link
                href={`/collections/${category.name.toLowerCase()}/`}
                className={`discovery-category ${active === index ? 'is-active' : ''}`}
                aria-label={`Explore ${category.name}`}
                onPointerEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
              >
                <div className="discovery-thumbnail"><Asset photo={category.photo} fit="contain" sizes="(max-width: 767px) 50vw, 1px" /></div>
                <span className="discovery-number" aria-hidden="true">0{index + 1}</span>
                <div className="discovery-category-copy"><h3>{category.name}</h3><p>{category.line}</p></div>
                <span className="discovery-category-action" aria-hidden="true">EXPLORE</span>
              </Link>
            </Reveal>
          ))}
        </nav>
      </div>
    </section>
  );
}
