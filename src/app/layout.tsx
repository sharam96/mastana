import type { Metadata, Viewport } from 'next';
import { Archivo, Inter, JetBrains_Mono } from 'next/font/google';

import './globals.css';

import { FloatingActions } from '@/components/layout/FloatingActions';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { MastanaAI } from '@/components/ai/MastanaAI';
import { AIProvider } from '@/components/ai/ai-context';
import { company, siteUrl } from '@/content/company';
import { countByCategory, getCategories } from '@/lib/catalog';

const archivo = Archivo({
  subsets: ['latin'],
  variable: '--font-archivo',
  weight: ['600', '700', '800', '900'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Mastana Mechanical Works — Textile Machinery Since 1957',
    // Short suffix keeps machine titles inside the search-result display width.
    template: '%s | Mastana',
  },
  description:
    'Manufacturer, exporter and repairer of hosiery knitting machines since 1957. Flat knitting, embroidery, laser, mesh, socks, weaving and warping machines. Ludhiana, India.',
  keywords: [
    'flat knitting machines',
    'hosiery knitting machines',
    'computerized flat knitting machine',
    'embroidery machines',
    'laser cutting machine textile',
    'warping machine',
    'textile machinery manufacturer India',
    'Ludhiana textile machinery',
    'Mastana Mechanical Works',
  ],
  authors: [{ name: company.legalName }],
  openGraph: {
    type: 'website',
    siteName: company.legalName,
    locale: 'en_IN',
    url: siteUrl,
    title: 'Mastana Mechanical Works — Textile & Hosiery Knitting Machinery Since 1957',
    description:
      'Manufacturer, exporter and repairer of all kinds of hosiery knitting machines since 1957. ISO 9001:2008 registered.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mastana Mechanical Works — Textile Machinery Since 1957',
    description: 'Flat knitting, embroidery, laser, mesh, socks, weaving and warping machines.',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: '#06080b',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = getCategories();
  const counts = Object.fromEntries(categories.map((c) => [c.slug, countByCategory(c.slug)]));

  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-amber-500 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink-950"
        >
          Skip to content
        </a>

        <AIProvider>
          <SmoothScroll />
          <Navbar categories={categories} counts={counts} />

          <main id="main">{children}</main>

          <Footer categories={categories} />
          <FloatingActions />
          <MastanaAI />
        </AIProvider>
      </body>
    </html>
  );
}
