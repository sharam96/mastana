import type { MetadataRoute } from 'next';

import { siteUrl } from '@/content/company';
import { getCategories, getProducts } from '@/lib/catalog';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { path: '/', priority: 1 },
    { path: '/machines', priority: 0.9 },
    { path: '/company', priority: 0.8 },
    { path: '/technology', priority: 0.7 },
    { path: '/infrastructure', priority: 0.7 },
    { path: '/why-mastana', priority: 0.7 },
    { path: '/machine-finder', priority: 0.6 },
    { path: '/compare', priority: 0.6 },
    { path: '/contact', priority: 0.8 },
    { path: '/request-quote', priority: 0.8 },
  ].map((r) => ({
    url: `${siteUrl}${r.path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: r.priority,
  }));

  const categoryRoutes = getCategories().map((c) => ({
    url: `${siteUrl}/machines/category/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const productRoutes = getProducts().map((p) => ({
    url: `${siteUrl}/machines/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
