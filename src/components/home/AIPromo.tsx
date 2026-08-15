'use client';

import { motion } from 'motion/react';

import { useAI } from '@/components/ai/ai-context';
import { ArrowRight } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { Section } from '@/components/ui/Section';

const EXAMPLES = [
  'Which machine should I use for flyknit shoe uppers?',
  'What gauges does the FX-72S3 support?',
  'Compare the KM-1122 sweater and collar machines.',
  'Show me machines for glove production.',
];

export function AIPromo() {
  const { openAssistant } = useAI();

  return (
    <Section className="relative overflow-hidden">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden border border-white/10 bg-ink-880 p-8 md:p-14">
            <div className="blueprint pointer-events-none absolute inset-0 opacity-50" aria-hidden />
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-500/15 blur-[90px]"
              aria-hidden
            />

            <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500">
                    <svg viewBox="0 0 20 20" className="h-4 w-4 text-ink-950" fill="none" aria-hidden>
                      <circle cx="10" cy="10" r="2.4" fill="currentColor" />
                      <circle cx="10" cy="10" r="6.4" stroke="currentColor" strokeWidth="1.3" opacity="0.55" />
                      <path
                        d="M10 1.4v2.2M10 16.4v2.2M1.4 10h2.2M16.4 10h2.2"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <span className="eyebrow">Mastana AI</span>
                </div>

                <h2 className="font-display text-[clamp(1.7rem,3.8vw,2.75rem)] leading-[1.05] font-extrabold">
                  Not sure which machine you need?
                </h2>
                <p className="mt-5 max-w-xl text-[0.975rem] leading-relaxed text-steel-400">
                  Mastana AI answers from our machine catalogue only — real gauges, widths, speeds and
                  applications. If a specification isn&apos;t on our data sheets, it says so and puts you in
                  touch with our team rather than guessing.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    onClick={() => openAssistant({ mode: 'finder' })}
                    className="group inline-flex h-11 items-center gap-2.5 bg-amber-500 px-6 text-sm font-semibold text-ink-950 transition-colors hover:bg-amber-400"
                  >
                    Find my machine
                    <ArrowRight />
                  </button>
                  <button
                    onClick={() => openAssistant()}
                    className="inline-flex h-11 items-center gap-2.5 border border-white/15 px-6 text-sm font-medium text-mist transition-colors hover:border-amber-500/60"
                  >
                    Ask Mastana AI
                  </button>
                </div>
              </div>

              <div className="lg:col-span-5">
                <p className="eyebrow mb-4">Try asking</p>
                <ul className="space-y-2">
                  {EXAMPLES.map((q, i) => (
                    <motion.li
                      key={q}
                      initial={{ opacity: 0, x: 12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <button
                        onClick={() => openAssistant({ prompt: q })}
                        className="group flex w-full items-center justify-between gap-3 border border-white/8 bg-white/[0.02] px-4 py-3 text-left text-[0.8125rem] text-steel-300 transition-all hover:border-amber-500/40 hover:text-amber-300"
                      >
                        <span>{q}</span>
                        <ArrowRight className="shrink-0 text-steel-600 group-hover:text-amber-400" />
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
