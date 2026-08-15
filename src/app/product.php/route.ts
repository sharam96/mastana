import { NextResponse } from 'next/server';

import catalogRaw from '@/content/catalog.raw.json';
import { getCategories, getProducts } from '@/lib/catalog';

type RawCategory = {
  legacyId: number;
  groups: { legacyId: number; models: { legacyId: number }[] }[];
};

/**
 * Legacy sub-product listing URLs (product.php?id=190). The old site nested
 * category → sub-product → model, so each id maps to the set of models beneath
 * it. We redirect to the model when there is only one, otherwise to the parent
 * category listing.
 */
export function GET(request: Request) {
  const id = Number(new URL(request.url).searchParams.get('id'));
  const raw = catalogRaw as unknown as RawCategory[];

  for (const category of raw) {
    const group = category.groups.find((g) => g.legacyId === id);
    if (!group) continue;

    if (group.models.length === 1) {
      const product = getProducts().find((p) => p.legacyId === group.models[0].legacyId);
      if (product) return NextResponse.redirect(new URL(`/machines/${product.slug}`, request.url), 301);
    }

    const cat = getCategories().find((c) => c.legacyId === category.legacyId);
    if (cat) return NextResponse.redirect(new URL(`/machines/category/${cat.slug}`, request.url), 301);
  }

  return NextResponse.redirect(new URL('/machines', request.url), 301);
}
