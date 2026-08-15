import 'server-only';

import { about, company, contact, infrastructure, stats, strengths, timeline } from '@/content/company';
import { getCategories, getProducts } from '@/lib/catalog';

export type ChunkType = 'company' | 'contact' | 'category' | 'product' | 'spec' | 'faq';

export type Chunk = {
  id: string;
  type: ChunkType;
  title: string;
  /** Text the retriever scores and the model is allowed to cite. */
  text: string;
  productSlug?: string;
  categorySlug?: string;
  url?: string;
};

let cached: Chunk[] | null = null;

/**
 * The Mastana knowledge base. Every chunk is derived from audited website
 * content — company pages and the product catalogue. Nothing else is added,
 * so the assistant can only ground answers in verified Mastana information.
 */
export function buildKnowledgeBase(): Chunk[] {
  if (cached) return cached;

  const chunks: Chunk[] = [];

  /* ------------------------------------------------------------- company */
  chunks.push({
    id: 'company-overview',
    type: 'company',
    title: 'About Mastana Mechanical Works',
    url: '/company',
    text: [
      `${company.legalName} (${company.registered}) — ${company.descriptor}.`,
      about.lead,
      `Established in ${company.established}.`,
      `The firm holds ${company.certification} registration.`,
      `Company motto: "${company.motto}".`,
      about.paragraphs.join(' '),
    ].join(' '),
  });

  chunks.push({
    id: 'company-stats',
    type: 'company',
    title: 'Mastana key facts and statistics',
    url: '/company',
    text: stats.map((s) => `${s.display} ${s.label}: ${s.note}`).join(' '),
  });

  chunks.push({
    id: 'company-history',
    type: 'company',
    title: 'Mastana company history and timeline',
    url: '/company',
    text: timeline.map((t) => `${t.year} — ${t.title}: ${t.body}`).join(' '),
  });

  chunks.push({
    id: 'company-strengths',
    type: 'company',
    title: 'Why choose Mastana — strengths',
    url: '/why-mastana',
    text: strengths.map((s) => `${s.title}: ${s.body}`).join(' '),
  });

  chunks.push({
    id: 'company-infrastructure',
    type: 'company',
    title: 'Mastana infrastructure, manufacturing, R&D and quality',
    url: '/infrastructure',
    text: infrastructure.map((i) => `${i.title}: ${i.body}`).join(' '),
  });

  /* ------------------------------------------------------------- contact */
  chunks.push({
    id: 'contact-details',
    type: 'contact',
    title: 'Mastana contact details, address and working hours',
    url: '/contact',
    text: [
      `Phone numbers: ${contact.phones.map((p) => `${p.number} (${p.label})`).join(', ')}.`,
      `Email: ${contact.emails.map((e) => e.address).join(', ')}.`,
      contact.addresses.map((a) => `${a.label}: ${a.lines.join(', ')}.`).join(' '),
      `Branches: ${contact.branches.join(', ')}.`,
      `Working hours: ${contact.hours.map((h) => `${h.days} ${h.time}`).join('; ')}.`,
      `Websites: ${contact.websites.join(', ')}.`,
    ].join(' '),
  });

  /* ---------------------------------------------------------- categories */
  for (const c of getCategories()) {
    const inCat = getProducts().filter((p) => p.categorySlug === c.slug);
    chunks.push({
      id: `category-${c.slug}`,
      type: 'category',
      title: `${c.name} — category`,
      categorySlug: c.slug,
      url: `/machines/category/${c.slug}`,
      text: [
        `${c.name}. ${c.tagline}. ${c.description}`,
        `Mastana lists ${inCat.length} machine${inCat.length === 1 ? '' : 's'} in this category:`,
        inCat.map((p) => (p.model ? `${p.model} ${p.name}` : p.name)).join('; '),
      ].join(' '),
    });
  }

  /* ------------------------------------------------------------ products */
  for (const p of getProducts()) {
    const label = p.model ? `${p.name} (model ${p.model})` : p.name;

    chunks.push({
      id: `product-${p.slug}`,
      type: 'product',
      title: label,
      productSlug: p.slug,
      categorySlug: p.categorySlug,
      url: `/machines/${p.slug}`,
      text: [
        `${label} is in the ${p.categoryName} category${p.series ? ` (${p.series} series)` : ''}.`,
        p.description,
        p.applications.length ? `Applications: ${p.applications.join(', ')}.` : '',
        p.features.length ? `Features: ${p.features.slice(0, 8).join(' ')}` : '',
      ]
        .filter(Boolean)
        .join(' '),
    });

    if (p.specifications.length) {
      chunks.push({
        id: `spec-${p.slug}`,
        type: 'spec',
        title: `${label} — technical specifications`,
        productSlug: p.slug,
        categorySlug: p.categorySlug,
        url: `/machines/${p.slug}`,
        text: `Technical specifications for ${label}: ${p.specifications
          .map((s) => `${s.label}: ${s.value}`)
          .join('; ')}.`,
      });
    }

    if (p.specTable) {
      chunks.push({
        id: `spectable-${p.slug}`,
        type: 'spec',
        title: `${label} — model variants`,
        productSlug: p.slug,
        categorySlug: p.categorySlug,
        url: `/machines/${p.slug}`,
        text: `Model variants for ${label}. Columns: ${p.specTable.header.join(', ')}. ${p.specTable.rows
          .map((r) => r.join(' / '))
          .join('; ')}.`,
      });
    }
  }

  cached = chunks;
  return chunks;
}
