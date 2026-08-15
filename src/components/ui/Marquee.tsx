import { Fragment } from 'react';

import { cn } from '@/lib/utils';

/**
 * Seamless horizontal ticker. The track renders the items twice and slides by
 * exactly -50%, so the loop has no visible seam. Pauses on hover/focus and
 * falls back to a normal scrollable strip under prefers-reduced-motion.
 */
export function Marquee({
  items,
  label,
  durationSeconds = 42,
  className,
}: {
  items: string[];
  label?: string;
  durationSeconds?: number;
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className={cn('relative flex items-center gap-4 sm:gap-6', className)}>
      {label && (
        <span className="eyebrow shrink-0 border-r border-white/10 pr-4 sm:pr-6">{label}</span>
      )}

      <div
        className="marquee no-scrollbar min-w-0 flex-1"
        style={{ '--marquee-duration': `${durationSeconds}s` } as React.CSSProperties}
      >
        <ul className="marquee-track items-center">
          {[0, 1].map((copy) => (
            <Fragment key={copy}>
              {items.map((item) => (
                <li
                  key={`${copy}-${item}`}
                  className="flex shrink-0 items-center gap-5 pr-5 sm:gap-7 sm:pr-7"
                  // the duplicated copy is decorative for assistive tech
                  aria-hidden={copy === 1 || undefined}
                >
                  <span className="text-xs whitespace-nowrap text-steel-400 sm:text-[0.8125rem]">
                    {item}
                  </span>
                  <span className="h-1 w-1 shrink-0 rounded-full bg-amber-500/60" aria-hidden />
                </li>
              ))}
            </Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
}
