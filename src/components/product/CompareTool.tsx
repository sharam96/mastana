'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import { ArrowRight } from '@/components/ui/Button';
import { cn, productLabel } from '@/lib/utils';
import type { Product } from '@/types/catalog';

type Slot = 'a' | 'b';

export function CompareTool({ products }: { products: Product[] }) {
  const router = useRouter();
  const params = useSearchParams();

  const [a, setA] = useState<string | null>(params.get('a'));
  const [b, setB] = useState<string | null>(params.get('b'));

  const left = products.find((p) => p.slug === a) ?? null;
  const right = products.find((p) => p.slug === b) ?? null;

  function pick(slot: Slot, slug: string) {
    const next = new URLSearchParams(params.toString());
    if (slug) next.set(slot, slug);
    else next.delete(slot);
    if (slot === 'a') setA(slug || null);
    else setB(slug || null);
    router.replace(`/compare?${next.toString()}`, { scroll: false });
  }

  /** Union of spec labels, ordered by the left machine then the right. */
  const rows = useMemo(() => {
    if (!left || !right) return [];
    const labels: string[] = [];
    for (const s of left.specifications) if (!labels.includes(s.label)) labels.push(s.label);
    for (const s of right.specifications) if (!labels.includes(s.label)) labels.push(s.label);

    return labels.map((label) => {
      const lv = left.specifications.find((s) => s.label.toLowerCase() === label.toLowerCase())?.value;
      const rv = right.specifications.find((s) => s.label.toLowerCase() === label.toLowerCase())?.value;
      return { label, left: lv ?? null, right: rv ?? null, differs: (lv ?? '') !== (rv ?? '') };
    });
  }, [left, right]);

  return (
    <div className="py-10 md:py-14">
      {/* selectors */}
      <div className="grid gap-4 md:grid-cols-2">
        {(['a', 'b'] as Slot[]).map((slot) => {
          const value = slot === 'a' ? a : b;
          const other = slot === 'a' ? b : a;
          return (
            <div key={slot}>
              <label
                htmlFor={`compare-${slot}`}
                className="eyebrow mb-2 block"
              >
                Machine {slot.toUpperCase()}
              </label>
              <select
                id={`compare-${slot}`}
                value={value ?? ''}
                onChange={(e) => pick(slot, e.target.value)}
                className="h-12 w-full border border-white/12 bg-ink-900 px-4 text-sm text-mist focus:border-amber-500/60 focus:outline-none"
              >
                <option value="">Select a machine…</option>
                {products
                  .filter((p) => p.slug !== other)
                  .map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {productLabel(p)}
                    </option>
                  ))}
              </select>
            </div>
          );
        })}
      </div>

      {/* empty state */}
      {(!left || !right) && (
        <div className="mt-10 border border-white/8 bg-ink-900 px-6 py-16 text-center">
          <p className="font-display text-lg font-bold text-mist">
            Select two machines to compare them side by side.
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm text-steel-400">
            Only specifications published on Mastana&apos;s data sheets are shown. Where a value
            isn&apos;t listed for a machine, the row is marked as not specified rather than filled in.
          </p>
        </div>
      )}

      {/* comparison */}
      {left && right && (
        <>
          <div className="mt-10 grid grid-cols-2 gap-4 md:gap-8">
            {[left, right].map((p) => (
              <article key={p.slug}>
                <div className="plate relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={productLabel(p)}
                    fill
                    sizes="(max-width: 768px) 46vw, 40vw"
                    className="object-contain p-4"
                  />
                </div>
                <p className="mt-4 font-mono text-[0.625rem] uppercase tracking-widest text-amber-400">
                  {p.model ?? p.categoryName}
                </p>
                <h2 className="mt-1.5 text-base leading-snug font-bold text-mist md:text-lg">{p.name}</h2>
                <p className="mt-1 text-xs text-steel-500">{p.categoryName}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/machines/${p.slug}`}
                    className="border border-white/15 px-3 py-1.5 text-[0.6875rem] text-mist transition-colors hover:border-amber-500/60"
                  >
                    View machine
                  </Link>
                  <Link
                    href={`/request-quote?product=${encodeURIComponent(productLabel(p))}`}
                    className="bg-amber-500 px-3 py-1.5 text-[0.6875rem] font-semibold text-ink-950 transition-colors hover:bg-amber-400"
                  >
                    Request quote
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* description row */}
          <section className="mt-12">
            <h3 className="eyebrow mb-4">Overview</h3>
            <div className="grid grid-cols-2 gap-4 border-t border-white/8 pt-5 md:gap-8">
              {[left, right].map((p) => (
                <p key={p.slug} className="text-[0.8125rem] leading-relaxed text-steel-400">
                  {p.description}
                </p>
              ))}
            </div>
          </section>

          {/* applications */}
          {(left.applications.length > 0 || right.applications.length > 0) && (
            <section className="mt-12">
              <h3 className="eyebrow mb-4">Applications</h3>
              <div className="grid grid-cols-2 gap-4 border-t border-white/8 pt-5 md:gap-8">
                {[left, right].map((p) => (
                  <ul key={p.slug} className="space-y-1.5">
                    {p.applications.length ? (
                      p.applications.map((x) => (
                        <li key={x} className="text-[0.8125rem] text-steel-300">
                          {x}
                        </li>
                      ))
                    ) : (
                      <li className="text-[0.8125rem] text-steel-600">Not specified</li>
                    )}
                  </ul>
                ))}
              </div>
            </section>
          )}

          {/* specifications */}
          {rows.length > 0 ? (
            <section className="mt-12">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="eyebrow">Technical specifications</h3>
                <span className="flex items-center gap-2 text-[0.625rem] text-steel-500">
                  <span className="h-2 w-2 bg-amber-500/60" aria-hidden />
                  Differs
                </span>
              </div>

              <div className="border-t border-white/8">
                {rows.map((row) => (
                  <div
                    key={row.label}
                    className={cn(
                      'grid grid-cols-2 gap-4 border-b border-white/8 py-4 md:grid-cols-[minmax(0,10rem)_1fr_1fr] md:gap-8',
                      row.differs && 'bg-amber-500/[0.035]'
                    )}
                  >
                    <p className="col-span-2 font-mono text-[0.625rem] uppercase tracking-wider text-steel-500 md:col-span-1">
                      {row.label}
                    </p>
                    <p
                      className={cn(
                        'text-[0.8125rem] break-words',
                        row.left ? 'text-steel-200' : 'text-steel-600'
                      )}
                    >
                      {row.left ?? 'Not specified'}
                    </p>
                    <p
                      className={cn(
                        'text-[0.8125rem] break-words',
                        row.right ? 'text-steel-200' : 'text-steel-600'
                      )}
                    >
                      {row.right ?? 'Not specified'}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="mt-12 border border-white/8 bg-ink-900 p-6">
              <p className="text-sm text-steel-400">
                Neither machine has a published key/value specification table. Open each machine to see its
                full published data, or ask our team for the complete specification sheets.
              </p>
              <Link
                href="/request-quote"
                className="group mt-4 inline-flex items-center gap-2 text-[0.8125rem] font-medium text-amber-400"
              >
                Request specification sheets
                <ArrowRight />
              </Link>
            </section>
          )}
        </>
      )}
    </div>
  );
}
