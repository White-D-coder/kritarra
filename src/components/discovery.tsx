import Link from 'next/link';
import { Asset, Reveal } from './editorial';
import { campaign } from '@/lib/imagery';

const categories = [
  { name: 'Rings', photo: campaign['Dc-ogQ-vgSm'], position: '44% 40%' },
  { name: 'Necklaces', photo: campaign.DRE3aGHDKCw, position: '50% 45%' },
  { name: 'Earrings', photo: campaign.DMuceFtvoNP, position: '70% 40%' },
  { name: 'Bracelets', photo: campaign.DLK5DXfNPGi, position: '52% 32%' },
];

export function Discovery() {
  return (
    <section className="discovery" id="discovery" aria-labelledby="discovery-heading">
      <Reveal className="discovery-heading">
        <div>
          <span className="eyebrow">Find what speaks to you</span>
          <h2 id="discovery-heading">The art of <em>discovery.</em></h2>
        </div>
        <p>Rings, necklaces, earrings and bracelets.<br />Find a piece to make your own.</p>
      </Reveal>

      <nav className="discovery-grid" aria-label="Discover jewellery categories">
        {categories.map((category, index) => (
          <Reveal key={category.name} className="discovery-tile" delay={index * 0.05}>
            <Link
              className="discovery-category-card"
              href={`/collections/${category.name.toLowerCase()}/`}
              aria-label={`Explore ${category.name}`}
            >
              <Asset photo={category.photo} position={category.position} sizes="(max-width: 767px) 50vw, 25vw" />
              <div className="discovery-card-caption">
                <h3>{category.name}</h3>
                <span className="discovery-card-action" aria-hidden="true">Explore the collection</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </nav>
    </section>
  );
}
