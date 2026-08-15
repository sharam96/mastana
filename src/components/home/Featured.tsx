import Image from 'next/image';

import { ArrowRight, ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeader } from '@/components/ui/Section';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/catalog';

/** Alternating cinematic showcases for the machines highlighted on the old homepage. */
export function Featured({ products }: { products: Product[] }) {
  return (
    <Section className="hairline-t relative overflow-hidden bg-ink-900">
      <div className="blueprint pointer-events-none absolute inset-0 opacity-40" aria-hidden />

      <div className="container-x relative">
        <SectionHeader
          eyebrow="Featured Machines"
          title="Built for the production floor."
          intro="A selection from the Mastana catalogue, with the specifications exactly as they appear on our machine data sheets."
        />

        <div className="mt-16 space-y-20 md:mt-24 md:space-y-28">
          {products.slice(0, 4).map((product, i) => {
            const flipped = i % 2 === 1;
            const specs = product.specifications.slice(0, 4);

            return (
              <Reveal key={product.slug}>
                <article className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
                  <div className={cn('lg:col-span-7', flipped && 'lg:order-2')}>
                    <div className="plate group relative aspect-[16/11] overflow-hidden">
                      <Image
                        src={product.image}
                        alt={`${product.model ?? ''} ${product.name}`.trim()}
                        fill
                        sizes="(max-width: 1024px) 92vw, 55vw"
                        className="object-contain p-8 transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                      />
                      <span className="absolute left-4 top-4 border border-ink-950/15 bg-white/70 px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-widest text-ink-800 backdrop-blur">
                        {product.categoryName}
                      </span>
                    </div>
                  </div>

                  <div className={cn('lg:col-span-5', flipped && 'lg:order-1')}>
                    <p className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-amber-400">
                      {product.model ?? product.series ?? 'Machine'}
                    </p>
                    <h3 className="mt-3 font-display text-[clamp(1.45rem,3vw,2.2rem)] leading-tight font-bold text-mist">
                      {product.name}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-steel-400">{product.description}</p>

                    {specs.length > 0 && (
                      <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-white/8 pt-6">
                        {specs.map((s) => (
                          <div key={s.label} className="min-w-0">
                            <dt className="font-mono text-[0.5625rem] uppercase tracking-widest text-steel-600">
                              {s.label}
                            </dt>
                            <dd className="mt-1 line-clamp-2 text-xs leading-snug break-words text-steel-300">
                              {s.value}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}

                    <div className="mt-8">
                      <ButtonLink href={`/machines/${product.slug}`} variant="outline">
                        Explore Machine
                        <ArrowRight />
                      </ButtonLink>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
