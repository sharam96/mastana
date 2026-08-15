'use client';

import { useEffect } from 'react';

import { useAI } from '@/components/ai/ai-context';
import { ArrowRight } from '@/components/ui/Button';

/**
 * Registers the machine being viewed as AI context, then exposes prompts that
 * open the assistant already primed with that machine.
 */
export function AskAI({
  slug,
  label,
  categorySlug,
}: {
  slug: string;
  label: string;
  categorySlug: string;
}) {
  const { openAssistant, setProduct } = useAI();

  useEffect(() => {
    setProduct({ slug, label, categorySlug });
    return () => setProduct(null);
  }, [slug, label, categorySlug, setProduct]);

  const prompts = [
    `What are the main features of the ${label}?`,
    `Who is the ${label} suitable for?`,
    `Tell me the technical specifications of the ${label}.`,
    `Compare the ${label} with another Mastana machine.`,
  ];

  return (
    <section className="border border-white/10 bg-ink-880 p-6 md:p-8">
      <div className="flex items-center gap-3">
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
        <div>
          <h2 className="text-sm font-bold text-mist">Ask Mastana AI about this machine</h2>
          <p className="text-[0.6875rem] text-steel-500">Answers come from Mastana&apos;s data sheets only.</p>
        </div>
      </div>

      <ul className="mt-5 space-y-2">
        {prompts.map((p) => (
          <li key={p}>
            <button
              onClick={() => openAssistant({ prompt: p })}
              className="group flex w-full items-center justify-between gap-3 border border-white/8 bg-white/[0.02] px-4 py-2.5 text-left text-[0.8125rem] text-steel-300 transition-all hover:border-amber-500/40 hover:text-amber-300"
            >
              <span>{p}</span>
              <ArrowRight className="shrink-0 text-steel-600 group-hover:text-amber-400" />
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => openAssistant()}
        className="mt-4 w-full bg-amber-500 py-2.5 text-[0.8125rem] font-semibold text-ink-950 transition-colors hover:bg-amber-400"
      >
        Open Mastana AI
      </button>
    </section>
  );
}
