import type { Metadata } from 'next';
import { Suspense } from 'react';

import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { contact } from '@/content/company';
import { listProducts } from '@/lib/repository';
import { whatsappLink } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Request a Quote',
  description:
    'Tell Mastana Mechanical Works what you need to produce and our team will recommend the right textile machine and send you a quotation.',
  alternates: { canonical: '/request-quote' },
};

export default async function RequestQuotePage() {
  const products = await listProducts();

  return (
    <>
      <PageHeader
        eyebrow="Request a Quote"
        title="Tell us what you need to produce."
        intro="Share your gauge, knitting width and production requirement. Our team will come back with the right machine from the Mastana range."
        crumbs={[{ label: 'Request a Quote' }]}
      />

      <div className="container-x py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Suspense fallback={<div className="text-sm text-steel-500">Loading form…</div>}>
              <EnquiryForm
                products={products.map((p) => ({ slug: p.slug, name: p.name, model: p.model }))}
                source="quote"
              />
            </Suspense>
          </div>

          <aside className="lg:col-span-5">
            <div className="border border-white/10 bg-ink-900 p-7 md:p-8">
              <h2 className="font-display text-lg font-bold">Prefer to talk?</h2>
              <p className="mt-3 text-sm leading-relaxed text-steel-400">
                Our office is open Monday to Saturday. Call or message us and we will help you identify
                the right machine.
              </p>

              <dl className="mt-7 space-y-6">
                <div>
                  <dt className="eyebrow">Phone</dt>
                  <dd className="mt-2 space-y-1">
                    {contact.phones.map((p) => (
                      <a
                        key={p.tel}
                        href={`tel:${p.tel}`}
                        className="block text-sm text-steel-300 transition-colors hover:text-amber-400"
                      >
                        {p.number} <span className="text-steel-600">({p.label})</span>
                      </a>
                    ))}
                  </dd>
                </div>

                <div>
                  <dt className="eyebrow">Email</dt>
                  <dd className="mt-2 space-y-1">
                    {contact.emails.map((e) => (
                      <a
                        key={e.address}
                        href={`mailto:${e.address}`}
                        className="block text-sm break-all text-steel-300 transition-colors hover:text-amber-400"
                      >
                        {e.address}
                      </a>
                    ))}
                  </dd>
                </div>

                <div>
                  <dt className="eyebrow">Opening hours</dt>
                  <dd className="mt-2 space-y-1">
                    {contact.hours.map((h) => (
                      <p key={h.days} className="text-sm text-steel-300">
                        {h.days}: {h.time}
                      </p>
                    ))}
                  </dd>
                </div>
              </dl>

              <a
                href={whatsappLink(
                  contact.whatsapp.e164,
                  'Hello Mastana Mechanical Works, I am interested in your textile machinery. I would like to discuss my requirement.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex h-11 items-center justify-center bg-[#25D366] text-sm font-semibold text-white"
              >
                Message on WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
