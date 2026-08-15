import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { CatalogueBrowser } from '@/components/product/CatalogueBrowser';
import { PageHeader } from '@/components/ui/PageHeader';
import { getCategories } from '@/lib/catalog';
import { findCategory, listCategories, listProducts } from '@/lib/repository';
import { truncate } from '@/lib/utils';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const category = await findCategory(slug);
  if (!category) return { title: 'Category not found' };

  return {
    title: category.name,
    description: truncate(category.description, 155),
    alternates: { canonical: `/machines/category/${category.slug}` },
    openGraph: {
      title: `${category.name} | ${category.tagline}`,
      description: truncate(category.description, 155),
      ...(category.image ? { images: [{ url: category.image }] } : {}),
    },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const [category, products, categories] = await Promise.all([
    findCategory(slug),
    listProducts(),
    listCategories(),
  ]);
  if (!category) notFound();

  const inCategory = products.filter((p) => p.categorySlug === slug);

  return (
    <>
      <PageHeader
        eyebrow={category.tagline}
        title={category.name}
        intro={category.description}
        crumbs={[{ label: 'Machines', href: '/machines' }, { label: category.name }]}
      >
        <p className="mt-7 font-mono text-[0.6875rem] uppercase tracking-widest text-amber-400">
          {inCategory.length} {inCategory.length === 1 ? 'machine' : 'machines'} in this category
        </p>
      </PageHeader>

      <div className="container-x">
        <CatalogueBrowser products={products} categories={categories} initialCategory={slug} />
      </div>
    </>
  );
}
