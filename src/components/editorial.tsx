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
      <div className="perspective-stage">
        <div className="perspective-heading">
          <span className="eyebrow">The Kritarra perspective</span>
          <h2 id="perspective-heading">An art. <em>An intention.</em></h2>
        </div>
        <Reveal className="perspective-portrait">
          <Asset photo={campaign.DXJI2FVjFC_} position="50% 26%" sizes="(max-width: 767px) 82vw, 60vw" />
        </Reveal>
        <Reveal className="perspective-detail" delay={0.1}>
          <Asset photo={campaign.DdgV82YseoM} position="45% 25%" sizes="(max-width: 767px) 44vw, 34vw" />
        </Reveal>
      </div>
      <div className="perspective-note">
        <p>A personal approach to diamonds, gemstones and bespoke jewellery.</p>
        <Link className="perspective-link" href="/about/">About Kritarra</Link>
      </div>
    </section>
  );
}
