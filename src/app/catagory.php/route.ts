import { NextResponse } from 'next/server';

import { getCategories } from '@/lib/catalog';

/** Legacy category URLs: catagory.php?id=189 → /machines/category/<slug> */
export function GET(request: Request) {
  const id = Number(new URL(request.url).searchParams.get('id'));
  const category = getCategories().find((c) => c.legacyId === id);
  const target = category ? `/machines/category/${category.slug}` : '/machines';
  return NextResponse.redirect(new URL(target, request.url), 301);
}
