/**
 * Seeds PostgreSQL from the audited Mastana catalogue.
 *   npm run db:push && npm run db:seed
 */
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(readFileSync(path.join(here, '..', 'src', 'content', 'catalog.json'), 'utf8'));

const FEATURED = new Set([
  'fx-3-72-sj-computerized-sweater-flat-knitting-machine',
  'fs1600-co2-laser-cutting-machine',
  'fx-72s3-computerized-intarsia-flat-knitting-machine',
  'km-1122-semi-computerized-sweater-flat-knitting-machine',
  'km-1122-dj-fully-computerized-dj-collar-flat-knitting-machine',
  'electronic-jacquard-shoe-upper-weaving-machine',
]);

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Copy .env.example to .env and set it first.');
  }

  const categoryIds = new Map();

  for (const [i, c] of catalog.categories.entries()) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      create: {
        legacyId: c.legacyId,
        name: c.name,
        slug: c.slug,
        tagline: c.tagline,
        description: c.description,
        image: c.image,
        sortOrder: i,
      },
      update: {
        name: c.name,
        tagline: c.tagline,
        description: c.description,
        image: c.image,
        sortOrder: i,
      },
    });
    categoryIds.set(c.slug, row.id);
  }

  for (const [i, p] of catalog.products.entries()) {
    const categoryId = categoryIds.get(p.categorySlug);
    if (!categoryId) throw new Error(`Unknown category for product ${p.slug}`);

    const data = {
      legacyId: p.legacyId,
      name: p.name,
      model: p.model,
      series: p.series,
      description: p.description,
      specifications: p.specifications,
      specTable: p.specTable ?? undefined,
      features: p.features,
      applications: p.applications,
      image: p.image,
      gallery: p.gallery,
      featured: FEATURED.has(p.slug),
      sortOrder: i,
      categoryId,
    };

    await prisma.product.upsert({
      where: { slug: p.slug },
      create: { ...data, slug: p.slug },
      update: data,
    });
  }

  const [cats, prods] = await Promise.all([prisma.category.count(), prisma.product.count()]);
  console.log(`Seeded ${cats} categories and ${prods} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
