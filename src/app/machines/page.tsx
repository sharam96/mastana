import type { Metadata } from 'next';

import { CatalogueBrowser } from '@/components/product/CatalogueBrowser';
import { PageHeader } from '@/components/ui/PageHeader';
import { listCategories, listProducts } from '@/lib/repository';

export const metadata: Metadata = {
  title: 'Machine Catalogue — All Textile Machinery',
  description:
    'The complete Mastana machine catalogue — flat knitting, embroidery, laser, mesh, socks, weaving and warping machines. Search by model, gauge or application.',
  alternates: { canonical: '/machines' },
};

export default async function MachinesPage() {
  const [products, categories] = await Promise.all([listProducts(), listCategories()]);

  return (
    <>
      <PageHeader
        eyebrow="Catalogue"
        title="Every machine Mastana builds."
        intro={`${products.length} machines across ${categories.length} categories — with the technical specifications exactly as they appear on our data sheets.`}
        crumbs={[{ label: 'Machines' }]}
      />

      <div className="container-x">
        <CatalogueBrowser products={products} categories={categories} />
      </div>
    </>
  );
}
