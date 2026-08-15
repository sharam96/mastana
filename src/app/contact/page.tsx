import type { Metadata } from 'next';
import { Suspense } from 'react';

import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { company, contact, siteUrl } from '@/content/company';
import { listProducts } from '@/lib/repository';
import { whatsappLink } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Contact Mastana Mechanical Works, Ludhiana — phone, email, head office and factory addresses, branches and opening hours.',
  alternates: { canonical: '/contact' },
};

export default async function ContactPage() {
  const products = await listProducts();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: company.legalName,
    url: siteUrl,
    telephone: contact.phones[0].number,
    email: contact.emails[0].address,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'E-2/36/5, Street Number 1, Guru Vihar, Jodhewal',
      addressLocality: 'Ludhiana',
      postalCode: '141007',
      addressRegion: 'Punjab',
      addressCountry: 'IN',
    },
    openingHours: ['Mo-Sa 09:30-20:30', 'Su 09:30-13:00'],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        eyebrow="Contact"
        title="Talk to Mastana."
        intro="Head office and works in Ludhiana, Punjab, with branches across India."
        crumbs={[{ label: 'Contact' }]}
      />

      <div className="container-x py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* details */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="space-y-10">
                <section>
                  <h2 className="eyebrow mb-4">Phone</h2>
                  <ul className="space-y-2">
                    {contact.phones.map((p) => (
                      <li key={p.tel}>
                        <a
                          href={`tel:${p.tel}`}
                          className="text-base text-steel-200 transition-colors hover:text-amber-400"
                        >
                          {p.number}
                        </a>
                        <span className="ml-2 text-xs text-steel-600">{p.label}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="eyebrow mb-4">Email</h2>
                  <ul className="space-y-2">
                    {contact.emails.map((e) => (
                      <li key={e.address}>
                        <a
                          href={`mailto:${e.address}`}
                          className="text-base break-all text-steel-200 transition-colors hover:text-amber-400"
                        >
                          {e.address}
                        </a>
                        <span className="ml-2 text-xs text-steel-600">{e.label}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="eyebrow mb-4">Addresses</h2>
                  <div className="space-y-6">
                    {contact.addresses.map((a) => (
                      <address key={a.label} className="not-italic">
                        <p className="font-mono text-[0.625rem] uppercase tracking-widest text-amber-400">
                          {a.label}
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-steel-300">
                          {a.lines.join(', ')}
                        </p>
                      </address>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="eyebrow mb-4">Branches</h2>
                  <ul className="flex flex-wrap gap-2">
                    {contact.branches.map((b) => (
                      <li
                        key={b}
                        className="border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-steel-300"
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h2 className="eyebrow mb-4">Opening hours</h2>
                  <dl className="space-y-1.5">
                    {contact.hours.map((h) => (
                      <div key={h.days} className="flex flex-wrap gap-x-3 text-sm">
                        <dt className="text-steel-400">{h.days}</dt>
                        <dd className="text-steel-200">{h.time}</dd>
                      </div>
                    ))}
                  </dl>
                </section>

                <section>
                  <h2 className="eyebrow mb-4">Websites</h2>
                  <ul className="space-y-1.5">
                    {contact.websites.map((w) => (
                      <li key={w} className="text-sm text-steel-400">
                        {w}
                      </li>
                    ))}
                  </ul>
                </section>

                <a
                  href={whatsappLink(
                    contact.whatsapp.e164,
                    'Hello Mastana Mechanical Works, I am interested in your textile machinery. I would like to discuss my requirement.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-full items-center justify-center bg-[#25D366] text-sm font-semibold text-white sm:w-auto sm:px-8"
                >
                  Message on WhatsApp
                </a>
              </div>
            </Reveal>
          </div>

          {/* form */}
          <div className="lg:col-span-7">
            <h2 className="font-display text-2xl font-bold">Send an enquiry</h2>
            <p className="mt-3 mb-8 text-sm text-steel-400">
              Tell us about your requirement and we will get back to you.
            </p>
            <Suspense fallback={<div className="text-sm text-steel-500">Loading form…</div>}>
              <EnquiryForm
                products={products.map((p) => ({ slug: p.slug, name: p.name, model: p.model }))}
                source="contact"
              />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
}
