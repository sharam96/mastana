import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight, ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeader } from '@/components/ui/Section';
import type { Category } from '@/types/catalog';

/**
 * Editorial category rows — each is a full-width band with a large machine
 * plate, an index number and a real machine count.
 */
export function Categories({
  categories,
  counts,
}: {
  categories: Category[];
  counts: Record<string, number>;
}) {
  return (
    <Section id="categories" className="relative overflow-hidden">
      <div className="container-x">
        <SectionHeader
          eyebrow="Machine Catalogue"
          title="Seven categories. Forty-one machines."
          intro="From computerized flat knitting to laser cutting, embroidery, warping and weaving — the complete Mastana range, organised by what it produces."
          action={
            <ButtonLink href="/machines" variant="outline">
              View all machines
              <ArrowRight />
            </ButtonLink>
          }
        />
      </div>

      <div className="mt-14 md:mt-20">
        {categories.map((category, i) => (
          <Reveal key={category.slug} index={i % 3}>
            <Link
              href={`/machines/category/${category.slug}`}
              className="group block border-t border-white/8 transition-colors last:border-b hover:bg-white/[0.015]"
            >
              <div className="container-x">
                <div className="grid items-center gap-6 py-8 md:grid-cols-12 md:gap-8 md:py-10">
                  {/* index */}
                  <div className="flex items-center gap-4 md:col-span-1">
                    <span className="font-mono text-xs text-steel-600 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  {/* image plate */}
                  <div className="md:col-span-3">
                    <div className="plate relative aspect-[4/3] w-full overflow-hidden">
                      {category.image && (
                        <Image
                          src={category.image}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 90vw, 22vw"
                          className="object-contain p-4 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                        />
                      )}
                    </div>
                  </div>

                  {/* text */}
                  <div className="md:col-span-6">
                    <h3 className="font-display text-[clamp(1.35rem,2.8vw,2.15rem)] leading-tight font-bold text-mist transition-colors group-hover:text-amber-400">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-sm text-steel-500">{category.tagline}</p>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-steel-400">
                      {category.description}
                    </p>
                  </div>

                  {/* meta */}
                  <div className="flex items-center justify-between md:col-span-2 md:flex-col md:items-end md:gap-5">
                    <span className="font-mono text-[0.625rem] uppercase tracking-widest text-steel-500">
                      {counts[category.slug] ?? 0} {counts[category.slug] === 1 ? 'machine' : 'machines'}
                    </span>
                    <span className="inline-flex items-center gap-2 text-[0.8125rem] font-medium text-amber-400">
                      Explore
                      <ArrowRight />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
