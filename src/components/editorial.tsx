'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
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
  const sectionRef = useRef<HTMLElement>(null);
  const [reduce, setReduce] = useState(true);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduce(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const portraitY = useTransform(scrollYProgress, [0, 1], ['5%', '-5%']);
  const detailY = useTransform(scrollYProgress, [0, 1], ['-7%', '7%']);
  const ease = [.22, 1, .36, 1] as const;

  return (
    <section ref={sectionRef} className="perspective" id="our-craft" aria-labelledby="perspective-heading" data-perspective-motion={reduce ? 'static' : 'scroll'}>
      <div className="perspective-stage">
        <div className="perspective-heading">
          <span className="eyebrow">The Kritarra perspective</span>
          <h2 id="perspective-heading">
            <span className="perspective-title-line"><motion.span initial={false} whileInView={reduce ? {} : { y: ['105%', '0%'] }} viewport={{ once: true, amount: .6 }} transition={{ duration: 1.15, ease }}>An art.</motion.span></span>{' '}
            <span className="perspective-title-line"><motion.em initial={false} whileInView={reduce ? {} : { y: ['105%', '0%'] }} viewport={{ once: true, amount: .6 }} transition={{ duration: 1.15, delay: .14, ease }}>An intention.</motion.em></span>
          </h2>
        </div>
        <motion.div className="perspective-portrait" style={{ y: reduce ? 0 : portraitY }}>
          <motion.div className="perspective-image-reveal" initial={false} whileInView={reduce ? {} : { clipPath: ['inset(14% 0 0 0)', 'inset(0% 0 0 0)'] }} viewport={{ once: true, amount: .2 }} transition={{ duration: 1.3, ease }}>
            <Asset photo={campaign.DXJI2FVjFC_} position="50% 26%" sizes="(max-width: 767px) 82vw, 60vw" />
          </motion.div>
        </motion.div>
        <motion.div className="perspective-detail" style={{ y: reduce ? 0 : detailY }}>
          <motion.div className="perspective-image-reveal" initial={false} whileInView={reduce ? {} : { clipPath: ['inset(0 100% 0 0)', 'inset(0 0% 0 0)'] }} viewport={{ once: true, amount: .2 }} transition={{ duration: 1.2, delay: .16, ease }}>
            <Asset photo={campaign.DdgV82YseoM} position="45% 25%" sizes="(max-width: 767px) 44vw, 34vw" />
          </motion.div>
        </motion.div>
      </div>
      <div className="perspective-note">
        <p>A personal approach to diamonds, gemstones and bespoke jewellery.</p>
        <Link className="perspective-link" href="/about/">About Kritarra</Link>
      </div>
    </section>
  );
}
