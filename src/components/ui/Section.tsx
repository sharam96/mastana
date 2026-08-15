import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { Reveal, RevealText } from './Reveal';

export function SectionHeader({
  eyebrow,
  title,
  intro,
  align = 'left',
  className,
  action,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: 'left' | 'center';
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'md:flex-col md:items-center md:text-center',
        className
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto text-center')}>
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
          as="h2"
          className="text-[clamp(1.85rem,4.2vw,3.25rem)] leading-[1.05] font-extrabold"
        />
        {intro && (
          <Reveal delay={0.15}>
            <p className="mt-5 text-[0.975rem] leading-relaxed text-steel-400 md:text-base">{intro}</p>
          </Reveal>
        )}
      </div>
      {action && (
        <Reveal delay={0.2} className="shrink-0">
          {action}
        </Reveal>
      )}
    </div>
  );
}

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn('py-20 md:py-28 lg:py-32', className)}>
      {children}
    </section>
  );
}
