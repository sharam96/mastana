'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { useDeferredValue, useMemo, useState } from 'react';

import { ProductCard } from '@/components/product/ProductCard';
import { cn } from '@/lib/utils';
import type { Category, Product } from '@/types/catalog';

type Sort = 'default' | 'name' | 'model' | 'category';

const SORTS: { value: Sort; label: string }[] = [
  { value: 'default', label: 'Catalogue order' },
  { value: 'name', label: 'Machine name' },
  { value: 'model', label: 'Model code' },
  { value: 'category', label: 'Category' },
];

function haystack(p: Product): string {
  return [
    p.name,
    p.model ?? '',
    p.series ?? '',
    p.categoryName,
    p.description,
    p.applications.join(' '),
    p.specifications.map((s) => `${s.label} ${s.value}`).join(' '),
  ]
    .join(' ')
    .toLowerCase();
}

export function CatalogueBrowser({
  products,
  categories,
  initialCategory = null,
}: {
  products: Product[];
  categories: Category[];
  initialCategory?: string | null;
}) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(initialCategory);
  const [series, setSeries] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>('default');

  const deferredQuery = useDeferredValue(query);

  const searchIndex = useMemo(
    () => new Map(products.map((p) => [p.slug, haystack(p)])),
    [products]
  );

  const seriesOptions = useMemo(() => {
    const pool = category ? products.filter((p) => p.categorySlug === category) : products;
    return [...new Set(pool.map((p) => p.series).filter((s): s is string => Boolean(s)))];
  }, [products, category]);

  const results = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    const terms = q.split(/\s+/).filter(Boolean);

    let list = products.filter((p) => {
      if (category && p.categorySlug !== category) return false;
      if (series && p.series !== series) return false;
      if (!terms.length) return true;
      const text = searchIndex.get(p.slug) ?? '';
      return terms.every((t) => text.includes(t));
    });

    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'model')
      list = [...list].sort((a, b) => (a.model ?? 'zzz').localeCompare(b.model ?? 'zzz'));
    else if (sort === 'category')
      list = [...list].sort(
        (a, b) => a.categoryName.localeCompare(b.categoryName) || a.name.localeCompare(b.name)
      );

    return list;
  }, [products, deferredQuery, category, series, sort, searchIndex]);

  const activeFilters = Boolean(query || category || series || sort !== 'default');

  function reset() {
    setQuery('');
    setCategory(null);
    setSeries(null);
    setSort('default');
  }

  return (
    <>
      {/* ------------------------------------------------------- controls */}
      <div className="sticky top-16 z-20 -mx-5 border-y border-white/8 bg-ink-950/92 px-5 py-4 backdrop-blur-xl md:-mx-8 md:px-8 xl:-mx-12 xl:px-12">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <label htmlFor="machine-search" className="sr-only">
                Search machines
              </label>
              <svg
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-500"
              >
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
                <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <input
                id="machine-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, model, gauge or application…"
                className="h-11 w-full border border-white/12 bg-white/[0.03] pl-10 pr-4 text-sm text-mist placeholder:text-steel-600 focus:border-amber-500/60 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <label htmlFor="machine-sort" className="sr-only">
                Sort machines
              </label>
              <select
                id="machine-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="h-11 border border-white/12 bg-ink-900 px-3 text-[0.8125rem] text-steel-300 focus:border-amber-500/60 focus:outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>

              {activeFilters && (
                <button
                  onClick={reset}
                  className="h-11 shrink-0 px-3 text-[0.8125rem] text-steel-400 transition-colors hover:text-amber-400"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* category chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <FilterChip active={category === null} onClick={() => { setCategory(null); setSeries(null); }}>
              All ({products.length})
            </FilterChip>
            {categories.map((c) => {
              const n = products.filter((p) => p.categorySlug === c.slug).length;
              return (
                <FilterChip
                  key={c.slug}
                  active={category === c.slug}
                  onClick={() => {
                    setCategory(category === c.slug ? null : c.slug);
                    setSeries(null);
                  }}
                >
                  {c.name} ({n})
                </FilterChip>
              );
            })}
          </div>

          {seriesOptions.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="eyebrow shrink-0 self-center pr-1">Series</span>
              {seriesOptions.map((s) => (
                <FilterChip key={s} active={series === s} onClick={() => setSeries(series === s ? null : s)}>
                  {s}
                </FilterChip>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --------------------------------------------------------- results */}
      <div className="py-10">
        <p className="mb-6 font-mono text-[0.6875rem] uppercase tracking-widest text-steel-500" role="status">
          {results.length} {results.length === 1 ? 'machine' : 'machines'}
          {category && ` in ${categories.find((c) => c.slug === category)?.name}`}
        </p>

        {results.length === 0 ? (
          <div className="border border-white/8 bg-ink-900 px-6 py-20 text-center">
            <p className="font-display text-lg font-bold text-mist">No machines found matching your search.</p>
            <p className="mx-auto mt-3 max-w-md text-sm text-steel-400">
              Try a different model code or application — or ask Mastana AI to help you find the right
              machine for your production.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={reset}
                className="border border-white/15 px-5 py-2.5 text-[0.8125rem] text-mist transition-colors hover:border-amber-500/60"
              >
                Clear filters
              </button>
              <Link
                href="/request-quote"
                className="bg-amber-500 px-5 py-2.5 text-[0.8125rem] font-semibold text-ink-950 transition-colors hover:bg-amber-400"
              >
                Ask our team
              </Link>
            </div>
          </div>
        ) : (
          // No `layout` projection here: Motion caches measured pixel widths and
          // re-applies them after a viewport change, which collapsed the grid to
          // a single oversized column on mobile. A keyed fade-in gives the same
          // sense of response without touching layout.
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((product, i) => (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.03, ease: [0.16, 1, 0.3, 1] }}
              >
                <ProductCard product={product} priority={i < 3} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        // min-h keeps chips a comfortable touch target on mobile
        'min-h-9 shrink-0 whitespace-nowrap border px-3.5 py-2 text-[0.75rem] transition-all duration-200',
        active
          ? 'border-amber-500 bg-amber-500 font-semibold text-ink-950'
          : 'border-white/12 text-steel-400 hover:border-amber-500/50 hover:text-amber-300'
      )}
    >
      {children}
    </button>
  );
}
