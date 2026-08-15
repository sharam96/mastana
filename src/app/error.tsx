'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[mastana] page error:', error);
  }, [error]);

  return (
    <div className="relative flex min-h-[80vh] items-center overflow-hidden py-32">
      <div className="blueprint pointer-events-none absolute inset-0 opacity-40" aria-hidden />

      <div className="container-x relative">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.25em] text-amber-400">
          Something went wrong
        </p>
        <h1 className="mt-5 max-w-2xl font-display text-[clamp(1.8rem,4.5vw,3rem)] leading-[1.05] font-extrabold">
          We could not load this page.
        </h1>
        <p className="mt-6 max-w-lg text-[0.975rem] leading-relaxed text-steel-400">
          Please try again. If the problem continues, call us on{' '}
          <a href="tel:+919814011130" className="text-amber-400 hover:underline">
            +91 98 1401 1130
          </a>{' '}
          and our team will help you directly.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <button
            onClick={reset}
            className="inline-flex h-12 items-center bg-amber-500 px-7 text-sm font-semibold text-ink-950 transition-colors hover:bg-amber-400"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex h-12 items-center border border-white/15 px-7 text-sm font-medium text-mist transition-colors hover:border-amber-500/60"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
