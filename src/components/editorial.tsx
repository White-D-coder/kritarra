'use client';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
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
export function Triptych(){
 const ref=useRef<HTMLElement>(null),reduce=useReducedMotion();const {scrollYProgress}=useScroll({target:ref,offset:['start end','end start']});const y=useTransform(scrollYProgress,[0,1],[35,-35]),scale=useTransform(scrollYProgress,[0,.6,1],[.94,1,1]);
 return <section className="triptych" ref={ref} id="our-craft"><div className="triptych-heading"><span className="eyebrow">THE KRITARRA PERSPECTIVE</span><h2>An art. <em>An intention.</em></h2></div><div className="triptych-grid"><Reveal className="triptych-copy"><span className="chapter">01 — THE IDEA</span><h3>It begins with<br/>a feeling.</h3><p>Beyond adornment, jewellery becomes a reflection of the moments, memories and individuality we carry.</p><TextLink href="/about/">THE WORLD OF KRITARRA</TextLink></Reveal><motion.div className="triptych-visual" style={reduce?{}:{y,scale}}><Asset photo={campaign.DXJI2FVjFC_} label="The art of adornment" position="50% 32%"/></motion.div><Reveal className="triptych-copy right" delay={.15}><span className="chapter">02 — THE EXPRESSION</span><h3>It becomes<br/><em>your story.</em></h3><p>A personal perspective on beauty. An invitation to explore the possibilities of bespoke diamonds and rare gemstones.</p><TextLink href="/contact/">BEGIN A CONVERSATION</TextLink></Reveal></div><span className="section-footnote">AN EXPRESSION OF INDIVIDUALITY</span></section>;
}
