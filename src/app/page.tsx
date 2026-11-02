import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {Asset,Reveal,TextLink,Perspective} from '@/components/editorial';
import {Catalog} from '@/components/catalog';
import {Newsletter} from '@/components/shell';
import {instagram} from '@/lib/catalog';
import {Hero} from '@/components/hero';
import {Discovery} from '@/components/discovery';
import {BrandIntro} from '@/components/brand-intro';
import {KritarraEditorialSlider} from '@/components/KritarraEditorialSlider';
import {signatureEditorialSlides} from '@/lib/signature-editorial';
import {campaign,socialCampaigns} from '@/lib/imagery';
export default function Home(){return <main id="main">
 <BrandIntro/>
 <Hero/>
 <section className="intro-statement section"><Reveal><span className="eyebrow">A WORLD OF KRITARRA</span><h2>Some things are worn.<br/>Others become <em>part of you.</em></h2><p>A quiet celebration of individuality.<br/>Discover jewellery through a more personal lens.</p></Reveal></section>
 <KritarraEditorialSlider slides={signatureEditorialSlides}/>
 <Perspective/>
 <Discovery/>
 <section className="curated section"><Reveal className="section-heading"><div><span className="eyebrow">THE CONSIDERED SELECTION</span><h2>Yours to <em>discover.</em></h2></div><TextLink href="/collections/">VIEW ALL CREATIONS</TextLink></Reveal><p className="catalogue-disclosure">A first look at the collection experience. Individual creations and prices will follow with Kritarra’s approved catalogue.</p><Catalog compact/></section>
 <section className="craft-story"><Reveal className="craft-visual"><Asset photo={campaign.DW_HenXDHeO} label="Kritarra campaign portrait" position="50% 30%"/></Reveal><Reveal className="craft-copy"><span className="eyebrow">A CLOSER LOOK</span><h2>Beauty lies<br/>in the <em>details.</em></h2><p>A curve. A silhouette. The way a creation catches the light. A considered detail can change the way we see everything.</p><TextLink href="/about/" light>DISCOVER THE KRITARRA PERSPECTIVE</TextLink><span className="craft-note">DIAMONDS. RARE GEMSTONES. YOUR POINT OF VIEW.</span></Reveal></section>
 <section className="journal section" id="journal"><Reveal className="section-heading"><div><span className="eyebrow">NOTES ON ADORNMENT</span><h2>The personal <em>issue.</em></h2></div><span className="tiny">A KRITARRA VISUAL JOURNAL</span></Reveal><div className="journal-layout"><Reveal className="journal-left"><Link href="/collections/rings/" className="editorial-image-link"><Asset photo={campaign.DPGjXdTjAn_} label="Kritarra campaign portrait" position="50% 35%"/></Link><span className="editorial-label">01 — A MOMENT, MADE PERSONAL.</span><h3>The things we choose<br/>to keep close.</h3></Reveal><div className="journal-right"><Reveal><Link href="/collections/bracelets/" className="editorial-image-link"><Asset photo={campaign.Deqr_MGvLQ5} label="Kritarra jewellery study" fit="contain"/></Link><span className="editorial-label">02 — A STUDY IN DETAIL.</span></Reveal><Reveal className="journal-quote"><span className="eyebrow">THE ART OF BEING YOU</span><p>“An expression<br/>that is entirely<br/><em>your own.</em>”</p><TextLink href="/contact/">EXPLORE BESPOKE</TextLink></Reveal></div></div></section>
 <section className="philosophy"><Reveal><span className="eyebrow">BEYOND ADORNMENT</span><h2>Designed to be<br/><em>remembered.</em></h2><p>For the moments, memories and individuality we carry.</p><span className="philosophy-signature">Kritarra</span></Reveal></section>
 <section className="social-section section"><Reveal className="section-heading"><div><span className="eyebrow">THE WORLD, THROUGH OUR LENS</span><h2>Keep a little <em>closer.</em></h2></div><a className="text-link" href={instagram} target="_blank" rel="noreferrer">@KRITARRAOFFICIAL <ArrowUpRight size={14}/></a></Reveal><div className="social-grid">{socialCampaigns.map(photo=><a href={photo.source} target="_blank" rel="noreferrer" key={photo.id} aria-label={`View ${photo.alt} on Kritarra’s Instagram`}><Asset photo={photo} sizes="(max-width: 600px) 50vw, 25vw"/><span className="social-hover">EXPLORE ON INSTAGRAM <ArrowUpRight size={16}/></span></a>)}</div><div className="social-bottom"><span>Selected moments from @kritarraofficial.</span><a className="text-link" href={instagram} target="_blank" rel="noreferrer">FOLLOW OUR JOURNEY <ArrowUpRight size={14}/></a></div></section>
 <Newsletter/>
 </main>;}
