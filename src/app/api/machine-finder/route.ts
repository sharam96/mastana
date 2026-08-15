import { NextResponse } from 'next/server';
import { z } from 'zod';

import { recommendMachines } from '@/lib/machine-finder';
import { clientKey, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const schema = z.object({
  product: z.string().trim().max(40).optional(),
  process: z.string().trim().max(40).optional(),
  scale: z.string().trim().max(40).optional(),
  control: z.string().trim().max(40).optional(),
});

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request.headers, 'finder'), { limit: 30, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid selection.' }, { status: 400 });
  }

  const recommendations = recommendMachines(parsed.data).map(({ product, reason }) => ({
    slug: product.slug,
    name: product.name,
    model: product.model,
    category: product.categoryName,
    image: product.image,
    reason,
    specs: product.specifications.slice(0, 4),
  }));

  return NextResponse.json({ recommendations });
}
