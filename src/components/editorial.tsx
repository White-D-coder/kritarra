'use client';
import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { campaign, type CampaignPhoto } from '@/lib/imagery';
export function Reveal({children,className='',delay=0}:{children:React.ReactNode;className?:string;delay?:number}) {
  const reduce=useReducedMotion();return <motion.div className={className} initial={false} whileInView={reduce?{opacity:1,y:0}:{opacity:[0,1],y:[24,0]}} viewport={{once:true,amount:.12}} transition={{duration:.85,delay,ease:[.22,1,.36,1]}}>{children}</motion.div>;
}
export function Asset({label='Campaign photograph',className='',number='01',src,photo,position='center',fit='cover',sizes='(max-width: 600px) 100vw, 50vw',priority=false}:{label?:string;className?:string;number?:string;src?:string;photo?:CampaignPhoto;position?:string;fit?:'cover'|'contain';sizes?:string;priority?:boolean}) {
  const imageSrc=src||photo?.src;
  return <div className={`asset ${className}`}>{imageSrc?<img src={imageSrc} srcSet={photo?.srcSet} sizes={photo?sizes:undefined} width={photo?.width} height={photo?.height} alt={photo?.alt||label} loading={priority?'eager':'lazy'} style={{objectPosition:position,objectFit:fit}}/>:<><span className="asset-number">K / {number}</span><span className="asset-monogram" aria-hidden="true">K</span><span className="asset-caption">{label}<small>Approved brand imagery to follow</small></span><span className="asset-corner" aria-hidden="true"/></>}</div>;
}
export function TextLink({href,children,light=false}:{href:string;children:React.ReactNode;light?:boolean}){return <Link href={href} className={`text-link ${light?'light':''}`}>{children}<span aria-hidden="true">↗</span></Link>;}
export function Perspective() {
  return (
    <section className="perspective" id="our-craft" aria-labelledby="perspective-heading">
      <Reveal className="perspective-heading">
        <span className="eyebrow">THE KRITARRA PERSPECTIVE</span>
        <h2 id="perspective-heading">An art.<em>An intention.</em></h2>
      </Reveal>

      <Reveal className="perspective-portrait">
        <figure>
          <Asset photo={campaign.DXJI2FVjFC_} fit="contain" sizes="(max-width: 767px) 100vw, 46vw" />
        </figure>
      </Reveal>

      <div className="perspective-stories">
        <Reveal className="perspective-story">
          <div>
            <span className="perspective-label">THE IDEA</span>
            <h3>It begins with a feeling.</h3>
            <p>Beyond adornment, jewellery becomes a reflection of the moments, memories and individuality we carry.</p>
            <Link className="perspective-link" href="/about/">THE WORLD OF KRITARRA</Link>
          </div>
        </Reveal>
        <Reveal className="perspective-story" delay={0.1}>
          <div>
            <span className="perspective-label">THE EXPRESSION</span>
            <h3>It becomes <em>your story.</em></h3>
            <p>A personal perspective on beauty. An invitation to explore the possibilities of bespoke diamonds and rare gemstones.</p>
            <Link className="perspective-link" href="/contact/">BEGIN A CONVERSATION</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
