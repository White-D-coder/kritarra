import {notFound} from 'next/navigation';
import {products} from '@/lib/catalog';
import {ProductDetail} from '@/components/catalog';
export function generateStaticParams(){return products.map(p=>({slug:p.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=products.find(p=>p.slug===slug);return {title:p?.name||'Creation',description:p?.description};}
export default async function ProductPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const product=products.find(p=>p.slug===slug);if(!product)notFound();return <ProductDetail product={product}/>;}
