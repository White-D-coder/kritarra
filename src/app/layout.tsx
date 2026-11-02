import type { Metadata } from 'next';
import { StoreProvider } from '@/components/store';
import { Header, Footer, Overlays } from '@/components/shell';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://kritarra-maison.keyursatra.chatgpt.site'),
  title: { default: 'KRITARRA — The Art of Adornment', template: '%s | KRITARRA' },
  description: 'Discover the world of Kritarra. A private jeweller exploring individuality through bespoke diamonds and rare gemstones.',
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600&display=swap" rel="stylesheet"/></head><body><StoreProvider><a href="#main" className="skip-link">Skip to content</a><Header/>{children}<Footer/><Overlays/></StoreProvider></body></html>;
}
