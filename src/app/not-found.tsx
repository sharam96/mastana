import Link from 'next/link';

import { ArrowRight, ButtonLink } from '@/components/ui/Button';
import { getCategories } from '@/lib/catalog';

export default function NotFound() {
  const categories = getCategories();

  return (
    <div className="relative flex min-h-[80vh] items-center overflow-hidden py-32">
      <div className="blueprint pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-amber-500/8 blur-[110px]"
        aria-hidden
      />

      <div className="container-x relative">
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.25em] text-amber-400">Error 404</p>
        <h1 className="mt-5 max-w-2xl font-display text-[clamp(2rem,5.5vw,3.75rem)] leading-[1.02] font-extrabold">
          This page is not in the catalogue.
        </h1>
        <p className="mt-6 max-w-lg text-[0.975rem] leading-relaxed text-steel-400">
          The page you are looking for has moved or no longer exists. Browse the machine catalogue or get
          in touch and we will point you to the right machine.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href="/machines" size="lg">
            Browse machines
            <ArrowRight />
          </ButtonLink>
          <ButtonLink href="/" variant="outline" size="lg">
            Back to home
          </ButtonLink>
        </div>

        <nav aria-label="Machine categories" className="mt-16">
          <p className="eyebrow mb-4">Machine categories</p>
          <ul className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/machines/category/${c.slug}`}
                  className="block border border-white/10 px-3.5 py-2 text-[0.8125rem] text-steel-400 transition-colors hover:border-amber-500/50 hover:text-amber-300"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
