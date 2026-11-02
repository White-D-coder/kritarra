import Link from 'next/link';
import { Asset, Reveal } from './editorial';
import { campaign } from '@/lib/imagery';

export function VisualJournal() {
  return (
    <section className="visual-journal" id="journal" aria-labelledby="journal-heading">
      <Reveal className="journal-arches">
        <figure className="journal-arch journal-arch--back">
          <Asset photo={campaign.Deqr_MGvLQ5} position="52% 50%" sizes="(max-width: 767px) 52vw, 24vw" />
        </figure>
        <figure className="journal-arch journal-arch--front">
          <Asset photo={campaign.DPGjXdTjAn_} position="78% 50%" sizes="(max-width: 767px) 52vw, 24vw" />
        </figure>
      </Reveal>

      <Reveal className="journal-arches-copy" delay={0.1}>
        <span className="eyebrow">A KRITARRA VISUAL JOURNAL</span>
        <h2 id="journal-heading">The personal <em>issue.</em></h2>
        <p>A closer look at individuality, through the details we choose and the stories we carry.</p>
        <Link href="/collections/" className="journal-collection-link">EXPLORE THE COLLECTION</Link>
      </Reveal>
    </section>
  );
}
