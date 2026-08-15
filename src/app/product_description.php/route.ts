import { NextResponse } from 'next/server';

import { getProducts } from '@/lib/catalog';

/**
 * Legacy deep links used query strings (product_description.php?id=358), which
 * Next's static redirects cannot match on. Every old machine URL is mapped to
 * its new page here so inbound links and search rankings survive.
 */
export function GET(request: Request) {
  const id = Number(new URL(request.url).searchParams.get('id'));
  const product = getProducts().find((p) => p.legacyId === id);
  const target = product ? `/machines/${product.slug}` : '/machines';
  return NextResponse.redirect(new URL(target, request.url), 301);
}
