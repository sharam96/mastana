import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight } from '@/components/ui/Button';
import type { Product } from '@/types/catalog';

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const specs = product.specifications.slice(0, 2);

  return (
    <Link
      href={`/machines/${product.slug}`}
      className="group flex h-full flex-col border border-white/8 bg-ink-900 transition-all duration-300 hover:border-amber-500/40 hover:bg-ink-880"
    >
      <div className="plate relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.image}
          alt={`${product.model ?? ''} ${product.name}`.trim()}
          fill
          priority={priority}
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
          className="object-contain p-5 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[0.625rem] uppercase tracking-widest text-amber-400">
          {product.model ?? product.categoryName}
        </p>
        <h3 className="mt-2 text-[0.9375rem] leading-snug font-semibold text-mist transition-colors group-hover:text-amber-300">
          {product.name}
        </h3>

        {specs.length > 0 && (
          <dl className="mt-4 space-y-1.5 border-t border-white/8 pt-4">
            {specs.map((s) => (
              <div key={s.label} className="flex gap-3 text-[0.6875rem]">
                <dt className="w-24 shrink-0 truncate text-steel-600">{s.label}</dt>
                <dd className="min-w-0 flex-1 truncate text-steel-400" title={s.value}>
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

        <span className="mt-auto flex items-center gap-2 pt-5 text-[0.6875rem] font-medium text-steel-500 transition-colors group-hover:text-amber-400">
          View machine
          <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
