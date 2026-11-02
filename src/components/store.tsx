'use client';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { products } from '@/lib/catalog';
import type { BagItem } from '@/lib/commerce';
export type Panel = 'menu'|'search'|'wishlist'|'bag'|'account'|null;
type Store = { wishlist:string[]; bag:BagItem[]; panel:Panel; setPanel:(p:Panel)=>void; toggleWish:(id:string)=>void; addToBag:(id:string,variant:string)=>void; updateQuantity:(id:string,variant:string,quantity:number)=>void; notice:string; announce:(s:string)=>void; };
const Context = createContext<Store|null>(null);
export function StoreProvider({children}:{children:ReactNode}) {
  const [wishlist,setWishlist]=useState<string[]>([]),[bag,setBag]=useState<BagItem[]>([]),[panel,setPanel]=useState<Panel>(null),[notice,setNotice]=useState(''),[ready,setReady]=useState(false);
  useEffect(()=>{ try {const w=JSON.parse(localStorage.getItem('kritarra-wishlist')||'[]'),b=JSON.parse(localStorage.getItem('kritarra-bag')||'[]');if(Array.isArray(w))setWishlist(w.filter(id=>products.some(p=>p.id===id)));if(Array.isArray(b))setBag(b.filter(l=>products.some(p=>p.id===l.productId&&p.variants.some(v=>v.id===l.variantId))&&Number.isInteger(l.quantity)&&l.quantity>0&&l.quantity<=99));}catch{}setReady(true);},[]);
  useEffect(()=>{if(ready){try{localStorage.setItem('kritarra-wishlist',JSON.stringify(wishlist));localStorage.setItem('kritarra-bag',JSON.stringify(bag));}catch{}}},[wishlist,bag,ready]);
  useEffect(()=>{if(!notice)return;const t=setTimeout(()=>setNotice(''),4000);return()=>clearTimeout(t);},[notice]);
  const toggleWish=(id:string)=>{setWishlist(w=>w.includes(id)?w.filter(i=>i!==id):[...w,id]);};
  const addToBag=(id:string,variant:string)=>{setBag(b=>{const existing=b.find(l=>l.productId===id&&l.variantId===variant);return existing?b.map(l=>l===existing?{...l,quantity:Math.min(l.quantity+1,99)}:l):[...b,{productId:id,variantId:variant,quantity:1}];});setNotice('Added to your selection');setPanel('bag');};
  const updateQuantity=(id:string,variant:string,quantity:number)=>setBag(b=>quantity<=0?b.filter(l=>!(l.productId===id&&l.variantId===variant)):b.map(l=>l.productId===id&&l.variantId===variant?{...l,quantity:Math.min(quantity,99)}:l));
  return <Context.Provider value={{wishlist,bag,panel,setPanel,toggleWish,addToBag,updateQuantity,notice,announce:setNotice}}>{children}<div role="status" className={`toast ${notice?'visible':''}`}>{notice}</div></Context.Provider>;
}
export const useStore=()=>{const ctx=useContext(Context);if(!ctx)throw new Error('StoreProvider missing');return ctx;};
