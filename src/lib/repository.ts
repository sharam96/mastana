import 'server-only';

import { promises as fs } from 'node:fs';
import path from 'node:path';

import { databaseEnabled, prisma } from '@/lib/db';
import * as content from '@/lib/catalog';
import type { Category, Product } from '@/types/catalog';

/* ------------------------------------------------------------------ reads */
/**
 * Catalogue reads prefer PostgreSQL and fall back to the versioned content
 * module. The fallback keeps the site renderable in environments without a
 * database (including CI builds) while production can serve from Postgres.
 */

function rowToProduct(row: Record<string, unknown>, categoryName: string): Product {
  return {
    legacyId: (row.legacyId as number) ?? 0,
    legacyUrl: `/product_description.php?id=${row.legacyId}`,
    slug: row.slug as string,
    name: row.name as string,
    model: (row.model as string) ?? null,
    series: (row.series as string) ?? null,
    categorySlug: (row.categorySlug as string) ?? '',
    categoryName,
    description: row.description as string,
    features: (row.features as string[]) ?? [],
    applications: (row.applications as string[]) ?? [],
    specifications: (row.specifications as Product['specifications']) ?? [],
    specTable: (row.specTable as Product['specTable']) ?? null,
    image: (row.image as string) ?? '',
    gallery: (row.gallery as string[]) ?? [],
  };
}

export async function listCategories(): Promise<Category[]> {
  if (databaseEnabled && prisma) {
    try {
      const rows = await prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
      if (rows.length) {
        return rows.map((r) => ({
          legacyId: r.legacyId ?? 0,
          legacyName: r.name,
          name: r.name,
          slug: r.slug,
          tagline: r.tagline ?? '',
          description: r.description ?? '',
          image: r.image,
          legacyUrl: `/catagory.php?id=${r.legacyId}`,
        }));
      }
    } catch {
      /* fall through to content */
    }
  }
  return content.getCategories();
}

export async function listProducts(): Promise<Product[]> {
  if (databaseEnabled && prisma) {
    try {
      const rows = await prisma.product.findMany({
        orderBy: { sortOrder: 'asc' },
        include: { category: true },
      });
      if (rows.length) {
        return rows.map((r) =>
          rowToProduct({ ...r, categorySlug: r.category.slug }, r.category.name)
        );
      }
    } catch {
      /* fall through to content */
    }
  }
  return content.getProducts();
}

export async function findProduct(slug: string): Promise<Product | undefined> {
  const all = await listProducts();
  return all.find((p) => p.slug === slug);
}

export async function findCategory(slug: string): Promise<Category | undefined> {
  const all = await listCategories();
  return all.find((c) => c.slug === slug);
}

/* ----------------------------------------------------------------- writes */

export type EnquiryInput = {
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  product?: string | null;
  message: string;
  source?: string;
};

export type ChatLeadInput = {
  name: string;
  company?: string | null;
  email: string;
  phone?: string | null;
  requirement?: string | null;
  recommendedProduct?: string | null;
  conversationSummary?: string | null;
};

const FALLBACK_DIR = path.join(process.cwd(), '.data');

/**
 * When no database is configured, submissions are appended to a local JSONL
 * file rather than silently dropped — the forms are never fake.
 */
async function appendFallback(file: string, record: unknown) {
  await fs.mkdir(FALLBACK_DIR, { recursive: true });
  await fs.appendFile(
    path.join(FALLBACK_DIR, file),
    JSON.stringify({ ...(record as object), receivedAt: new Date().toISOString() }) + '\n',
    'utf8'
  );
}

export async function createEnquiry(input: EnquiryInput): Promise<{ stored: 'db' | 'file' }> {
  if (databaseEnabled && prisma) {
    try {
      await prisma.enquiry.create({
        data: {
          name: input.name,
          company: input.company ?? null,
          email: input.email,
          phone: input.phone ?? null,
          product: input.product ?? null,
          message: input.message,
          source: input.source ?? 'contact',
        },
      });
      return { stored: 'db' };
    } catch {
      /* fall through so a DB outage never loses a lead */
    }
  }
  await appendFallback('enquiries.jsonl', input);
  return { stored: 'file' };
}

export async function createChatLead(input: ChatLeadInput): Promise<{ stored: 'db' | 'file' }> {
  if (databaseEnabled && prisma) {
    try {
      await prisma.chatLead.create({
        data: {
          name: input.name,
          company: input.company ?? null,
          email: input.email,
          phone: input.phone ?? null,
          requirement: input.requirement ?? null,
          recommendedProduct: input.recommendedProduct ?? null,
          conversationSummary: input.conversationSummary ?? null,
        },
      });
      return { stored: 'db' };
    } catch {
      /* fall through */
    }
  }
  await appendFallback('chat-leads.jsonl', input);
  return { stored: 'file' };
}
