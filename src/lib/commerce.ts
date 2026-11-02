import type { Product } from './catalog';
export type BagItem = { productId: string; variantId: string; quantity: number };
export const commerceConfig = {
  // The approved Shopify storefront origin, e.g. https://your-store.myshopify.com.
  shopOrigin: process.env.NEXT_PUBLIC_SHOPIFY_STORE_ORIGIN || '',
  accountUrl: process.env.NEXT_PUBLIC_CUSTOMER_ACCOUNT_URL || '',
  newsletterUrl: process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT || '',
};
export function checkoutUrl(items: BagItem[], catalog: Product[]): string | null {
  let origin: URL;
  try { origin = new URL(commerceConfig.shopOrigin); } catch { return null; }
  if (origin.protocol !== 'https:' || !/^[a-z0-9-]+\.myshopify\.com$/.test(origin.hostname) || !items.length) return null;
  const lines: string[] = [];
  for (const line of items) {
    const product = catalog.find(p => p.id === line.productId);
    const variant = product?.variants.find(v => v.id === line.variantId);
    if (!product || product.preview || product.price === null || !variant?.checkoutVariantId || !/^\d+$/.test(variant.checkoutVariantId) || !Number.isInteger(line.quantity) || line.quantity < 1) return null;
    lines.push(`${variant.checkoutVariantId}:${line.quantity}`);
  }
  return `${origin.origin}/cart/${lines.join(',')}`;
}
