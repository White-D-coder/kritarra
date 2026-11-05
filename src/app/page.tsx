import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {Asset,Reveal,TextLink,Perspective} from '@/components/editorial';
import {CuratedSelection} from '@/components/curated-selection';
import {Newsletter} from '@/components/shell';
import {instagram} from '@/lib/catalog';
import {Hero} from '@/components/hero';
import {Discovery} from '@/components/discovery';
import {VisualJournal} from '@/components/visual-journal';
import {Remembered} from '@/components/remembered';
import {BrandIntro} from '@/components/brand-intro';
import {KritarraEditorialSlider} from '@/components/KritarraEditorialSlider';
import {signatureEditorialSlides} from '@/lib/signature-editorial';
import {campaign,socialCampaigns} from '@/lib/imagery';
export default function Home(){return <main id="main">
 <BrandIntro/>
 <Hero/>
 <section className="intro-statement section" id="world-of-kritarra"><div className="intro-statement-texture" aria-hidden="true"><img src="/images/textures/ivory-texture-2400.webp" srcSet="/images/textures/ivory-texture-960.webp 960w, /images/textures/ivory-texture-1600.webp 1600w, /images/textures/ivory-texture-2400.webp 2400w" sizes="100vw" width={6240} height={4160} alt="" loading="lazy" decoding="async"/></div><Reveal className="intro-statement-content"><span className="eyebrow">A world of Kritarra</span><h2>Some things are worn.<br/>Others become <em>part of you.</em></h2><p>Bespoke diamonds and rare gemstones,<br/>chosen to feel like you.</p></Reveal></section>
 <KritarraEditorialSlider slides={signatureEditorialSlides}/>
 <Perspective/>
 <Discovery/>
 <CuratedSelection/>
 <section className="craft-story"><Reveal className="craft-visual"><Asset photo={campaign.DW_HenXDHeO} label="Kritarra campaign portrait" position="50% 30%"/></Reveal><Reveal className="craft-copy"><span className="eyebrow">A closer look</span><h2>Beauty lies<br/>in the <em>details.</em></h2><p>The curve of a setting. The colour of a stone. Details worth a closer look.</p><TextLink href="/about/" light>Discover the Kritarra perspective</TextLink><span className="craft-note">Diamonds and rare gemstones.</span></Reveal></section>
 <VisualJournal/>
 <Remembered/>
 <section className="social-section section"><Reveal className="section-heading"><div><span className="eyebrow">The world, through our lens</span><h2>Keep a little <em>closer.</em></h2></div><a className="text-link" href={instagram} target="_blank" rel="noreferrer">@kritarraofficial <ArrowUpRight size={14}/></a></Reveal><div className="social-grid">{socialCampaigns.map(photo=><a href={photo.source} target="_blank" rel="noreferrer" key={photo.id} aria-label={`View ${photo.alt} on Kritarra’s Instagram`}><Asset photo={photo} sizes="(max-width: 600px) 50vw, 25vw"/><span className="social-hover">View on Instagram <ArrowUpRight size={16}/></span></a>)}</div><div className="social-bottom"><span>Selected moments from @kritarraofficial.</span><a className="text-link" href={instagram} target="_blank" rel="noreferrer">Follow on Instagram <ArrowUpRight size={14}/></a></div></section>
 <Newsletter/>
 </main>;}
