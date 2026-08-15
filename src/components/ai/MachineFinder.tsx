'use client';

import Image from 'next/image';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

import { FINDER_STEPS, type Answers } from '@/lib/machine-finder';
import { cn } from '@/lib/utils';

type Recommendation = {
  slug: string;
  name: string;
  model: string | null;
  category: string;
  image: string;
  reason: string;
  specs: { label: string; value: string }[];
};

type Status = 'idle' | 'loading' | 'done' | 'error';

export function MachineFinder({
  onRequestQuote,
  onCompare,
  compact = false,
}: {
  onRequestQuote?: (product: string) => void;
  onCompare?: (slugs: string[]) => void;
  compact?: boolean;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [status, setStatus] = useState<Status>('idle');
  const [results, setResults] = useState<Recommendation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const current = FINDER_STEPS[step];
  const isLast = step === FINDER_STEPS.length - 1;

  async function submit(finalAnswers: Answers) {
    setStatus('loading');
    setError(null);
    try {
      const res = await fetch('/api/machine-finder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalAnswers),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Request failed');
      setResults(data.recommendations ?? []);
      setStatus('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      setStatus('error');
    }
  }

  function choose(value: string) {
    const next = { ...answers, [current.id]: value };
    setAnswers(next);
    if (isLast) void submit(next);
    else setStep((s) => s + 1);
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setResults([]);
    setStatus('idle');
    setError(null);
  }

  /* ------------------------------------------------------------- results */
  if (status === 'done') {
    return (
      <div className="space-y-4">
        {results.length === 0 ? (
          <div className="border border-white/10 bg-white/[0.02] p-6 text-center">
            <p className="text-sm text-steel-300">
              No machines in the Mastana catalogue matched that combination.
            </p>
            <p className="mt-2 text-xs text-steel-500">
              Try a different production type, or ask the Mastana team directly.
            </p>
            <button
              onClick={restart}
              className="mt-4 text-xs font-semibold text-amber-400 underline-offset-4 hover:underline"
            >
              Start again
            </button>
          </div>
        ) : (
          <>
            <p className="eyebrow">
              {results.length} recommended {results.length === 1 ? 'machine' : 'machines'}
            </p>
            {results.map((r, i) => (
              <motion.article
                key={r.slug}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="border border-white/10 bg-white/[0.02] p-4"
              >
                <div className="flex gap-4">
                  <div className="plate relative h-16 w-20 shrink-0 overflow-hidden">
                    <Image src={r.image} alt="" fill sizes="80px" className="object-contain p-1.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[0.625rem] uppercase tracking-widest text-amber-400">
                      {r.model ?? r.category}
                    </p>
                    <h4 className="mt-1 text-sm leading-snug font-semibold text-mist">{r.name}</h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-steel-400">{r.reason}</p>
                  </div>
                </div>

                {r.specs.length > 0 && (
                  <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 border-t border-white/8 pt-3">
                    {r.specs.map((s) => (
                      <div key={s.label} className="min-w-0">
                        <dt className="truncate font-mono text-[0.5625rem] uppercase tracking-wider text-steel-500">
                          {s.label}
                        </dt>
                        <dd className="truncate text-[0.6875rem] text-steel-300" title={s.value}>
                          {s.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={`/machines/${r.slug}`}
                    className="border border-white/15 px-3 py-1.5 text-[0.6875rem] font-medium text-mist transition-colors hover:border-amber-500/60"
                  >
                    View machine
                  </Link>
                  {onCompare && results.length > 1 && (
                    <button
                      onClick={() => onCompare(results.slice(0, 2).map((x) => x.slug))}
                      className="border border-white/15 px-3 py-1.5 text-[0.6875rem] font-medium text-mist transition-colors hover:border-amber-500/60"
                    >
                      Compare
                    </button>
                  )}
                  <button
                    onClick={() => onRequestQuote?.(r.model ? `${r.model} — ${r.name}` : r.name)}
                    className="bg-amber-500 px-3 py-1.5 text-[0.6875rem] font-semibold text-ink-950 transition-colors hover:bg-amber-400"
                  >
                    Request quote
                  </button>
                </div>
              </motion.article>
            ))}
            <button
              onClick={restart}
              className="text-xs font-semibold text-steel-400 underline-offset-4 hover:text-amber-400 hover:underline"
            >
              Start again
            </button>
          </>
        )}
      </div>
    );
  }

  /* ------------------------------------------------------------ loading */
  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-12">
        <div className="flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-amber-500"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
        <p className="text-xs text-steel-400">Mastana AI is checking the machinery catalogue…</p>
      </div>
    );
  }

  /* -------------------------------------------------------------- error */
  if (status === 'error') {
    return (
      <div className="border border-red-500/25 bg-red-500/5 p-5 text-center">
        <p className="text-sm text-red-300">{error}</p>
        <button
          onClick={restart}
          className="mt-3 text-xs font-semibold text-amber-400 underline-offset-4 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  /* ------------------------------------------------------------ question */
  return (
    <div>
      <div className="mb-5 flex items-center gap-2" aria-hidden>
        {FINDER_STEPS.map((s, i) => (
          <span
            key={s.id}
            className={cn(
              'h-0.5 flex-1 transition-colors duration-300',
              i <= step ? 'bg-amber-500' : 'bg-white/12'
            )}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="font-mono text-[0.625rem] uppercase tracking-widest text-steel-500">
            Step {step + 1} of {FINDER_STEPS.length}
          </p>
          <h3 className="mt-2 text-lg leading-snug font-bold text-mist">{current.question}</h3>

          <div className={cn('mt-5 grid gap-2', compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2')}>
            {current.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => choose(opt.value)}
                className="group border border-white/10 bg-white/[0.02] px-4 py-3 text-left transition-all duration-200 hover:border-amber-500/50 hover:bg-amber-500/[0.06]"
              >
                <span className="block text-sm font-medium text-mist group-hover:text-amber-300">
                  {opt.label}
                </span>
                {opt.hint && <span className="mt-0.5 block text-[0.6875rem] text-steel-500">{opt.hint}</span>}
              </button>
            ))}
          </div>

          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="mt-4 text-xs text-steel-500 transition-colors hover:text-amber-400"
            >
              ← Back
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
