import {notFound} from 'next/navigation';
import {categories} from '@/lib/catalog';
import {Catalog} from '@/components/catalog';
export function generateStaticParams(){return categories.map(c=>({category:c.toLowerCase()}));}
export async function generateMetadata({params}:{params:Promise<{category:string}>}){const {category}=await params;return {title:category.charAt(0).toUpperCase()+category.slice(1)};}
export default async function CategoryPage({params}:{params:Promise<{category:string}>}){const {category}=await params;const selected=categories.find(c=>c.toLowerCase()===category);if(!selected)notFound();return <main id="main"><div className="page-intro"><span className="eyebrow">The collections</span><h1>{selected}<em>, by Kritarra.</em></h1><p>A different expression of individuality.</p></div><section className="section collection-body"><p className="catalogue-disclosure">Catalogue preview · individual creations, photography and prices to be confirmed.</p><Catalog initialCategory={selected}/></section></main>;}
