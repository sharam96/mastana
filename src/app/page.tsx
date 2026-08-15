import type { Metadata } from 'next';

import { AIPromo } from '@/components/home/AIPromo';
import { Categories } from '@/components/home/Categories';
import { ContactCta } from '@/components/home/ContactCta';
import { Engineering } from '@/components/home/Engineering';
import { Featured } from '@/components/home/Featured';
import { Hero } from '@/components/home/Hero';
import { Stats } from '@/components/home/Stats';
import { Story } from '@/components/home/Story';
import { WhyMastana } from '@/components/home/WhyMastana';
import { company, contact, siteUrl } from '@/content/company';
import { countByCategory, getCategories, getFeaturedProducts, getProduct } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Textile & Hosiery Knitting Machinery Since 1957',
  description:
    'Manufacturer, exporter and repairer of hosiery knitting machines since 1957. Flat knitting, embroidery, laser, mesh, socks, weaving and warping machines.',
  alternates: { canonical: '/' },
};

export default function HomePage() {
  const categories = getCategories();
  const counts = Object.fromEntries(categories.map((c) => [c.slug, countByCategory(c.slug)]));
  const featured = getFeaturedProducts();
  const heroMachine =
    getProduct('fx-72s3-computerized-intarsia-flat-knitting-machine') ?? featured[0];

  const organisationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.legalName,
    url: siteUrl,
    logo: `${siteUrl}/media/assets__images__logo.png`,
    foundingDate: String(company.established),
    description: company.positioning,
    email: contact.emails[0].address,
    telephone: contact.phones[0].number,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'E-2/36/5, Street Number 1, Guru Vihar, Jodhewal',
      addressLocality: 'Ludhiana',
      postalCode: '141007',
      addressRegion: 'Punjab',
      addressCountry: 'IN',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organisationJsonLd) }}
      />

      <Hero machine={heroMachine} categoryNames={categories.map((c) => c.name)} />
      <Stats />
      <Categories categories={categories} counts={counts} />
      <Featured products={featured} />
      <Story />
      <Engineering />
      <AIPromo />
      <WhyMastana />
      <ContactCta />
    </>
  );
}
