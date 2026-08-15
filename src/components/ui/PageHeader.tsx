import Link from 'next/link';

import { Reveal, RevealText } from '@/components/ui/Reveal';

export type Crumb = { label: string; href?: string };

export function PageHeader({
  eyebrow,
  title,
  intro,
  crumbs = [],
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  crumbs?: Crumb[];
  children?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-white/8 bg-ink-900 pt-32 pb-14 md:pt-40 md:pb-20">
      <div className="blueprint pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div
        className="pointer-events-none absolute -top-24 left-1/4 h-72 w-[40rem] rounded-full bg-amber-500/8 blur-[110px]"
        aria-hidden
      />

      <div className="container-x relative">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-2 font-mono text-[0.625rem] uppercase tracking-widest text-steel-500">
              <li>
                <Link href="/" className="transition-colors hover:text-amber-400">
                  Home
                </Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.label} className="flex items-center gap-2">
                  <span aria-hidden>/</span>
                  {c.href ? (
                    <Link href={c.href} className="transition-colors hover:text-amber-400">
                      {c.label}
                    </Link>
                  ) : (
                    <span className="text-steel-300">{c.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {eyebrow && (
          <Reveal>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-amber-500" aria-hidden />
              <span className="eyebrow">{eyebrow}</span>
            </div>
          </Reveal>
        )}

        <RevealText
          text={title}
          as="h1"
          className="max-w-4xl font-display text-[clamp(2rem,5.2vw,3.75rem)] leading-[1.02] font-extrabold"
        />

        {intro && (
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-2xl text-[0.975rem] leading-relaxed text-steel-400 md:text-base">
              {intro}
            </p>
          </Reveal>
        )}

        {children && <Reveal delay={0.2}>{children}</Reveal>}
      </div>
    </header>
  );
}
