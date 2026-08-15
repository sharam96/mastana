import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AskAI } from '@/components/product/AskAI';
import { ProductCard } from '@/components/product/ProductCard';
import { SpecList, SpecMatrix } from '@/components/product/SpecTable';
import { ArrowRight, ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { company, contact, siteUrl } from '@/content/company';
import { getProducts, getRelatedProducts } from '@/lib/catalog';
import { findProduct } from '@/lib/repository';
import { productLabel, truncate, whatsappLink } from '@/lib/utils';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await findProduct(slug);
  if (!product) return { title: 'Machine not found' };

  const title = productLabel(product);
  // Trim to a whole sentence/word inside the ~155-char snippet window.
  const description = truncate(product.description, 155);

  return {
    title,
    description,
    alternates: { canonical: `/machines/${product.slug}` },
    openGraph: {
      title: `${title} | ${company.legalName}`,
      description,
      images: [{ url: product.image }],
      type: 'website',
    },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = await findProduct(slug);
  if (!product) notFound();

  const related = getRelatedProducts(product, 3);
  const label = productLabel(product);
  const gallery = [product.image, ...product.gallery].filter(
    (src, i, arr) => src && arr.indexOf(src) === i
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: label,
    description: product.description,
    image: `${siteUrl}${product.image}`,
    category: product.categoryName,
    ...(product.model ? { model: product.model, sku: product.model } : {}),
    brand: { '@type': 'Brand', name: company.legalName },
    manufacturer: { '@type': 'Organization', name: company.legalName, url: siteUrl },
    ...(product.specifications.length
      ? {
          additionalProperty: product.specifications.map((s) => ({
            '@type': 'PropertyValue',
            name: s.label,
            value: s.value,
          })),
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="border-b border-white/8 bg-ink-900 pt-28 md:pt-32">
        <div className="container-x">
          <nav aria-label="Breadcrumb" className="py-6">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-[0.625rem] uppercase tracking-widest text-steel-500">
              <li>
                <Link href="/" className="transition-colors hover:text-amber-400">
                  Home
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden>/</span>
                <Link href="/machines" className="transition-colors hover:text-amber-400">
                  Machines
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden>/</span>
                <Link
                  href={`/machines/category/${product.categorySlug}`}
                  className="transition-colors hover:text-amber-400"
                >
                  {product.categoryName}
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span aria-hidden>/</span>
                <span className="text-steel-300">{product.model ?? product.name}</span>
              </li>
            </ol>
          </nav>

          {/* ------------------------------------------------------- hero */}
          <div className="grid gap-10 pb-14 lg:grid-cols-2 lg:gap-14 lg:pb-20">
            <Reveal>
              <div className="plate relative aspect-[4/3] overflow-hidden">
                <Image
                  src={product.image}
                  alt={label}
                  fill
                  priority
                  sizes="(max-width: 1024px) 92vw, 46vw"
                  className="object-contain p-8"
                />
                <span className="absolute left-4 top-4 border border-ink-950/15 bg-white/70 px-2.5 py-1 font-mono text-[0.5625rem] uppercase tracking-widest text-ink-800 backdrop-blur">
                  {product.categoryName}
                </span>
              </div>

              {gallery.length > 1 && (
                <div className="mt-3 grid grid-cols-4 gap-3">
                  {gallery.slice(0, 4).map((src) => (
                    <div key={src} className="plate relative aspect-square overflow-hidden">
                      <Image src={src} alt="" fill sizes="12vw" className="object-contain p-2" />
                    </div>
                  ))}
                </div>
              )}
            </Reveal>

            <Reveal delay={0.1}>
              <div className="flex h-full flex-col">
                {product.series && <p className="eyebrow">{product.series} series</p>}
                {product.model && (
                  <p className="font-mono text-sm uppercase tracking-[0.18em] text-amber-400">
                    {product.model}
                  </p>
                )}

                <h1 className="mt-3 font-display text-[clamp(1.7rem,4vw,2.9rem)] leading-[1.05] font-extrabold">
                  {product.name}
                </h1>

                <p className="mt-6 text-[0.975rem] leading-relaxed text-steel-400">{product.description}</p>

                {product.applications.length > 0 && (
                  <div className="mt-8">
                    <h2 className="eyebrow mb-3">Applications</h2>
                    <ul className="flex flex-wrap gap-2">
                      {product.applications.map((a) => (
                        <li
                          key={a}
                          className="border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-steel-300"
                        >
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-auto flex flex-wrap gap-3 pt-9">
                  <ButtonLink href={`/request-quote?product=${encodeURIComponent(label)}`} size="lg">
                    Request a Quote
                    <ArrowRight />
                  </ButtonLink>
                  <ButtonLink href={`/compare?a=${product.slug}`} variant="outline" size="lg">
                    Compare
                  </ButtonLink>
                  <a
                    href={whatsappLink(
                      contact.whatsapp.e164,
                      `Hello Mastana Mechanical Works, I am interested in the ${label}. I would like to discuss my requirement.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-13 items-center px-6 text-[0.9375rem] font-medium text-steel-300 transition-colors hover:text-white"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------- details */}
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-8">
            {product.specifications.length > 0 && (
              <section>
                <h2 className="mb-6 font-display text-2xl font-bold">Technical specifications</h2>
                <SpecList specs={product.specifications} />
              </section>
            )}

            {product.specTable && (
              <section className={product.specifications.length ? 'mt-14' : ''}>
                <h2 className="mb-6 font-display text-2xl font-bold">Model variants</h2>
                <SpecMatrix table={product.specTable} />
              </section>
            )}

            {product.features.length > 0 && (
              <section className="mt-14">
                <h2 className="mb-6 font-display text-2xl font-bold">Features</h2>
                <ul className="space-y-4">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex gap-4">
                      <span className="mt-1 font-mono text-[0.625rem] text-amber-500 tabular-nums">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="flex-1 text-sm leading-relaxed text-steel-300">{f}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {product.specifications.length === 0 &&
              !product.specTable &&
              product.features.length === 0 && (
                <section className="border border-white/10 bg-ink-900 p-8">
                  <h2 className="font-display text-xl font-bold">Detailed specifications</h2>
                  <p className="mt-3 text-sm leading-relaxed text-steel-400">
                    Full technical data for this machine is available from the Mastana team. Send us your
                    requirement and we will share the complete specification sheet.
                  </p>
                  <ButtonLink
                    href={`/request-quote?product=${encodeURIComponent(label)}`}
                    variant="outline"
                    className="mt-6"
                  >
                    Request specifications
                    <ArrowRight />
                  </ButtonLink>
                </section>
              )}
          </div>

          <aside className="space-y-6 lg:col-span-4">
            <AskAI slug={product.slug} label={label} categorySlug={product.categorySlug} />

            <section className="border border-white/10 bg-ink-900 p-6">
              <h2 className="eyebrow mb-4">Speak to our team</h2>
              <ul className="space-y-2.5">
                {contact.phones.slice(0, 3).map((p) => (
                  <li key={p.tel}>
                    <a
                      href={`tel:${p.tel}`}
                      className="text-sm text-steel-300 transition-colors hover:text-amber-400"
                    >
                      {p.number}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={`mailto:${contact.emails[1].address}`}
                    className="text-sm break-all text-steel-300 transition-colors hover:text-amber-400"
                  >
                    {contact.emails[1].address}
                  </a>
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </div>

      {/* ------------------------------------------------------- related */}
      {related.length > 0 && (
        <section className="hairline-t bg-ink-900 py-16 md:py-20">
          <div className="container-x">
            <div className="mb-9 flex items-end justify-between gap-6">
              <h2 className="font-display text-2xl font-bold md:text-3xl">Related machines</h2>
              <Link
                href={`/machines/category/${product.categorySlug}`}
                className="group inline-flex shrink-0 items-center gap-2 text-[0.8125rem] text-amber-400"
              >
                All {product.categoryName}
                <ArrowRight />
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
