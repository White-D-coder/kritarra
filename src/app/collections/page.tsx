import type {Metadata} from 'next';
import {Catalog} from '@/components/catalog';
export const metadata:Metadata={title:'The Collections'};
export default function Collections(){return <main id="main" className="collections-main"><div className="page-intro"><span className="eyebrow">The world of Kritarra</span><h1>A personal <em>discovery.</em></h1><p>Find what speaks to you.</p></div><section className="section collection-body"><p className="catalogue-disclosure">Catalogue preview. Approved product photographs, individual creations and prices are awaiting supply from Kritarra. These categories are available for enquiry.</p><Catalog/></section></main>;}
