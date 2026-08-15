import catalogData from '@/content/catalog.json';
import type { Catalog, Category, Product } from '@/types/catalog';

const catalog = catalogData as unknown as Catalog;

/** Machines highlighted on the homepage — all appear on the existing site's featured strip. */
const FEATURED_SLUGS = [
  'fx-3-72-sj-computerized-sweater-flat-knitting-machine',
  'fs1600-co2-laser-cutting-machine',
  'fx-72s3-computerized-intarsia-flat-knitting-machine',
  'km-1122-semi-computerized-sweater-flat-knitting-machine',
  'km-1122-dj-fully-computerized-dj-collar-flat-knitting-machine',
  'electronic-jacquard-shoe-upper-weaving-machine',
];

export const categories: Category[] = catalog.categories;
export const products: Product[] = catalog.products;

export function getCategories(): Category[] {
  return categories;
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProducts(): Product[] {
  return products;
}

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(slug: string): Product[] {
  return products.filter((p) => p.categorySlug === slug);
}

export function getFeaturedProducts(): Product[] {
  const picked = FEATURED_SLUGS.map((s) => products.find((p) => p.slug === s)).filter(
    (p): p is Product => Boolean(p)
  );
  if (picked.length >= 4) return picked;
  // fall back to one machine per category so the section is never thin
  return categories
    .map((c) => products.find((p) => p.categorySlug === c.slug))
    .filter((p): p is Product => Boolean(p));
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  const sameCategory = products.filter(
    (p) => p.categorySlug === product.categorySlug && p.slug !== product.slug
  );
  if (sameCategory.length >= limit) {
    const sameSeries = sameCategory.filter((p) => p.series && p.series === product.series);
    return [...sameSeries, ...sameCategory.filter((p) => !sameSeries.includes(p))].slice(0, limit);
  }
  const others = products.filter(
    (p) => p.categorySlug !== product.categorySlug && p.slug !== product.slug
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function countByCategory(slug: string): number {
  return products.filter((p) => p.categorySlug === slug).length;
}

/** Legacy → new URL map, used by next.config redirects and by the audit trail. */
export function legacyRedirects(): { source: string; destination: string }[] {
  return [
    ...categories.map((c) => ({
      source: c.legacyUrl,
      destination: `/machines/category/${c.slug}`,
    })),
    ...products.map((p) => ({ source: p.legacyUrl, destination: `/machines/${p.slug}` })),
  ];
}
