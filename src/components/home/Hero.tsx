'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';

import { ArrowRight, ButtonLink } from '@/components/ui/Button';
import { Marquee } from '@/components/ui/Marquee';
import { cn } from '@/lib/utils';
import type { Product } from '@/types/catalog';

const HEADLINE = 'ENGINEERING THE FUTURE OF TEXTILE MANUFACTURING.';
/** Words rendered in the accent colour — the last two of the headline. */
const ACCENT_FROM = HEADLINE.split(' ').length - 1;

export function Hero({ machine, categoryNames }: { machine: Product; categoryNames: string[] }) {
  const reduce = useReducedMotion();
  const words = HEADLINE.split(' ');

  const headlineSpecs = machine.specifications
    .filter((s) => /gauge|knitting width|knitting speed/i.test(s.label))
    .slice(0, 3);

  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-ink-950 pt-24 md:pt-28">
      {/* backdrop */}
      <div className="blueprint pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute left-1/2 top-1/4 h-[32rem] w-[64rem] max-w-[140vw] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[110px]"
        aria-hidden
      />

      <div className="container-x relative flex flex-1 flex-col justify-center py-6">
        {/* badge */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 inline-flex w-fit max-w-full items-center gap-2.5 border border-white/12 px-3 py-1.5 sm:gap-3 sm:px-3.5"
        >
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" aria-hidden />
          <span className="font-mono text-[0.5625rem] uppercase tracking-[0.18em] text-steel-400 sm:text-[0.625rem] sm:tracking-[0.2em]">
            Established 1957 · ISO 9001:2008
          </span>
        </motion.div>

        {/*
          Full-container width and natural wrapping: the headline can never be
          clipped, at any viewport. Each word rises out of its own clipping box,
          so the reveal survives whatever line breaks the browser chooses.
        */}
        <h1 className="max-w-[20ch] font-display text-[clamp(1.9rem,7.4vw,4.5rem)] leading-[0.98] font-extrabold tracking-[-0.03em] text-white">
          <span className="sr-only">{HEADLINE}</span>
          <span aria-hidden className="block">
            {words.map((word, i) => (
              <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
                <motion.span
                  className={cn('inline-block', i >= ACCENT_FROM && 'text-amber-500')}
                  initial={{ y: reduce ? 0 : '110%' }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.9,
                    delay: reduce ? 0 : 0.06 * i,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {word}
                  {i < words.length - 1 ? ' ' : ''}
                </motion.span>
              </span>
            ))}
          </span>
        </h1>

        {/*
          The archive photography is square. Giving the image a square box means
          object-contain paints edge to edge instead of leaving dead margins
          either side, and centring the columns removes the void that
          bottom-alignment left above the copy.
        */}
        <div className="mt-8 grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-8"
          >
            <p className="max-w-lg text-[0.9375rem] leading-relaxed text-steel-400 sm:text-base">
              Manufacturer, exporter and repairer of all kinds of hosiery knitting machines since
              1957 — built in Ludhiana, engineered to international standards.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <ButtonLink href="/machines" size="lg" className="w-full sm:w-auto">
                Explore Machines
                <ArrowRight />
              </ButtonLink>
              <ButtonLink
                href="/request-quote"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                Request a Quote
              </ButtonLink>
            </div>

            {/* readout sits under the copy so the left column carries real
                content instead of empty space */}
            <div className="mt-8 flex flex-wrap items-start gap-x-8 gap-y-4 border-t border-white/8 pt-5">
              <div className="min-w-0">
                <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-amber-400">
                  {machine.model ?? machine.categoryName}
                </p>
                <p className="mt-1 max-w-[15rem] text-xs leading-snug text-steel-400">
                  {machine.name}
                </p>
              </div>

              {headlineSpecs.length > 0 && (
                <dl className="hidden gap-8 sm:flex">
                  {headlineSpecs.map((s) => (
                    <div key={s.label} className="max-w-[9rem]">
                      <dt className="font-mono text-[0.5625rem] uppercase tracking-widest text-steel-600">
                        {s.label}
                      </dt>
                      <dd className="mt-1 truncate text-[0.6875rem] text-steel-300" title={s.value}>
                        {s.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: reduce ? 1 : 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-4"
          >
            <div className="relative mx-auto aspect-square w-full max-w-[19rem] sm:max-w-[22rem] lg:max-w-none">
              <div
                className="absolute inset-[6%] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.82)_0%,rgba(255,255,255,0.34)_46%,transparent_72%)]"
                aria-hidden
              />
              <Image
                src={machine.image}
                alt={`${machine.model ?? ''} ${machine.name}`.trim()}
                fill
                priority
                sizes="(max-width: 1024px) 80vw, 32vw"
                className="object-contain [mask-image:radial-gradient(circle_at_center,#000_62%,transparent_86%)]"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/*
        Ticker sits in normal flow at the end of the hero, so nothing can
        overlap it as the page scrolls. Right padding clears the floating
        assistant launcher.
      */}
      <div className="relative border-t border-white/8 bg-ink-950/60 py-3.5 md:py-4">
        <div className="container-x pr-16 md:pr-24">
          <Marquee items={categoryNames} label="Catalogue" durationSeconds={38} />
        </div>
      </div>
    </section>
  );
}
