import type { Metadata } from 'next';
import { Suspense } from 'react';

import { CompareTool } from '@/components/product/CompareTool';
import { PageHeader } from '@/components/ui/PageHeader';
import { listProducts } from '@/lib/repository';

export const metadata: Metadata = {
  title: 'Compare Machines',
  description:
    'Compare Mastana textile machines side by side — specifications, applications and technical differences, taken directly from our published data sheets.',
  alternates: { canonical: '/compare' },
};

export default async function ComparePage() {
  const products = await listProducts();

  return (
    <>
      <PageHeader
        eyebrow="Machine Comparison"
        title="Compare machines side by side."
        intro="Put two Mastana machines next to each other and see exactly how their published specifications differ."
        crumbs={[{ label: 'Compare' }]}
      />

      <div className="container-x">
        <Suspense
          fallback={
            <div className="py-20 text-center text-sm text-steel-500">Loading comparison…</div>
          }
        >
          <CompareTool products={products} />
        </Suspense>
      </div>
    </>
  );
}
