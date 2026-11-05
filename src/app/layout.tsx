import type { Metadata } from 'next';
import { StoreProvider } from '@/components/store';
import { Header, Footer, Overlays } from '@/components/shell';
import './fonts.css';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://kritarra-maison.keyursatra.chatgpt.site'),
  title: { default: 'KRITARRA — The Art of Adornment', template: '%s | KRITARRA' },
  description: 'Discover the world of Kritarra. A private jeweller exploring individuality through bespoke diamonds and rare gemstones.',
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><head><link rel="preload" href="/fonts/eb-garamond-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/><link rel="preload" href="/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/></head><body><StoreProvider><a href="#main" className="skip-link">Skip to content</a><Header/>{children}<Footer/><Overlays/></StoreProvider></body></html>;
}
