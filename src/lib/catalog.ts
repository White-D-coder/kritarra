import {campaign} from './imagery';
export type Category = 'Rings' | 'Necklaces' | 'Earrings' | 'Bracelets';
export type Product = {
  id: string; slug: string; name: string; category: Category; description: string;
  price: number | null; images: string[]; variants: { id: string; label: string; checkoutVariantId?: string }[];
  specifications: { label: string; value: string }[]; preview: boolean;
};

// Reference entries establish the catalogue experience. They are not products offered for sale.
// Replace with approved catalogue data before enabling purchases. Never infer materials or prices.
export const products: Product[] = [
  { id: 'reference-ring', slug: 'rings', name: 'Rings', category: 'Rings', description: 'A personal expression, held in the smallest of details.', price: null, images: [], variants: [{id: 'enquire', label: 'Discuss your preferences'}], specifications: [], preview: true },
  { id: 'reference-necklace', slug: 'necklaces', name: 'Necklaces', category: 'Necklaces', description: 'Discover a different perspective on adornment.', price: null, images: [campaign.DRE3aGHDKCw.src,campaign.DNCz7r3vGng.src,campaign.DdDpJ8EMryv.src], variants: [{id: 'enquire', label: 'Discuss your preferences'}], specifications: [], preview: true },
  { id: 'reference-earrings', slug: 'earrings', name: 'Earrings', category: 'Earrings', description: 'An accent of individuality. An expression all your own.', price: null, images: [campaign.DQRYf7QDNzm.src,campaign.DPGjXdTjAn_.src,campaign.DLM9X0OMU3M.src], variants: [{id: 'enquire', label: 'Discuss your preferences'}], specifications: [], preview: true },
  { id: 'reference-bracelet', slug: 'bracelets', name: 'Bracelets', category: 'Bracelets', description: 'Thoughtful details, worn close.', price: null, images: [], variants: [{id: 'enquire', label: 'Discuss your preferences'}], specifications: [], preview: true },
];
export const categories: Category[] = ['Rings', 'Necklaces', 'Earrings', 'Bracelets'];
export const instagram = 'https://www.instagram.com/kritarraofficial/';
export const contactEmail = 'info@kritarra.in';
export const priceLabel = (price: number | null) => price === null ? 'Details on request' : new Intl.NumberFormat('en-IN', {style:'currency', currency:'INR', maximumFractionDigits:0}).format(price);
