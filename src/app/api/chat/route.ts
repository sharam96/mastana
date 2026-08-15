import { NextResponse } from 'next/server';
import { z } from 'zod';

import { answerQuestion } from '@/lib/ai';
import { clientKey, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const bodySchema = z.object({
  message: z.string().trim().min(1, 'Message is required').max(1000, 'Message is too long'),
  productSlug: z.string().trim().max(120).nullish(),
  categorySlug: z.string().trim().max(120).nullish(),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(4000),
      })
    )
    .max(20)
    .optional(),
});

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request.headers, 'chat'), { limit: 20, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many messages. Please wait a moment before trying again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
      { status: 400 }
    );
  }

  const { message, productSlug, categorySlug, history } = parsed.data;

  try {
    const result = await answerQuestion(message, {
      productSlug: productSlug ?? null,
      categorySlug: categorySlug ?? null,
      history,
    });

    // Never leak retrieval internals or environment details to the client.
    return NextResponse.json({
      answer: result.answer,
      sources: result.sources,
      grounded: result.grounded,
    });
  } catch (error) {
    console.error('[api/chat] failed:', error);
    return NextResponse.json(
      { error: 'Mastana AI is unavailable right now. Please try again shortly.' },
      { status: 500 }
    );
  }
}
