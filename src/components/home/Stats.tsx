'use client';

import { animate, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { stats } from '@/content/company';

/** Count-up that renders its final value on the server, so the real figure is
 *  always in the HTML for search engines and for users without JavaScript. */
function Counter({ value, display }: { value: number; display: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const reduce = useReducedMotion();
  const [text, setText] = useState(display);
  const [armed, setArmed] = useState(false);

  const numeric = /^[\d,]+$/.test(display);

  // Only reset to zero for figures still below the fold — anything already on
  // screen keeps its value rather than flashing back to 0.
  useEffect(() => {
    if (reduce || !numeric) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || rect.top > window.innerHeight * 0.9) {
      setText('0');
      setArmed(true);
    }
  }, [reduce, numeric]);

  useEffect(() => {
    if (!armed || !inView) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setText(Math.round(v).toLocaleString('en-IN')),
      onComplete: () => setText(display),
    });
    return () => controls.stop();
  }, [armed, inView, value, display]);

  return <span ref={ref}>{text}</span>;
}

export function Stats() {
  return (
    <section className="hairline-b relative overflow-hidden bg-ink-900" aria-label="Company facts">
      <div className="blueprint-fine pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <div className="container-x relative">
        <dl className="grid grid-cols-2 divide-white/8 lg:grid-cols-4 lg:divide-x">
          {stats.map((s, i) => (
            <div
              key={s.label}
              className={`px-2 py-10 md:py-14 ${i % 2 === 0 ? 'lg:pl-0' : ''} ${
                i < 2 ? 'border-b border-white/8 lg:border-b-0' : ''
              } ${i % 2 === 1 ? 'border-l border-white/8 lg:border-l-0' : ''} lg:px-8`}
            >
              <dd className="font-display text-[clamp(1.9rem,4.4vw,3rem)] leading-none font-extrabold text-white">
                <Counter value={s.value} display={s.display} />
                {'suffix' in s && s.suffix ? (
                  <span className="text-[0.45em] font-bold text-amber-500">{s.suffix}</span>
                ) : null}
              </dd>
              <dt className="mt-3 text-[0.8125rem] font-semibold text-mist">{s.label}</dt>
              <p className="mt-2 max-w-[16rem] text-xs leading-relaxed text-steel-500">{s.note}</p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
