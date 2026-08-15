import { NextResponse } from 'next/server';
import { z } from 'zod';

import { clientKey, rateLimit } from '@/lib/rate-limit';
import { createChatLead, createEnquiry } from '@/lib/repository';

export const runtime = 'nodejs';

/** Strip control characters and clamp length before anything is persisted. */
const clean = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((s) => s.replace(/[\u0000-\u001F\u007F]/g, ''));

const enquirySchema = z.object({
  name: clean(120).pipe(z.string().min(2, 'Please enter your name')),
  company: clean(160).optional(),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address').max(200),
  phone: clean(40).optional(),
  product: clean(200).optional(),
  message: clean(4000).pipe(z.string().min(5, 'Please describe your requirement')),
  source: z.enum(['contact', 'quote', 'product', 'ai']).default('contact'),
  /** Honeypot — must stay empty. */
  website: z.string().max(0).optional(),
});

const leadSchema = z.object({
  kind: z.literal('chat-lead'),
  name: clean(120).pipe(z.string().min(2, 'Please enter your name')),
  company: clean(160).optional(),
  email: z.string().trim().toLowerCase().email('Please enter a valid email address').max(200),
  phone: clean(40).optional(),
  requirement: clean(2000).optional(),
  recommendedProduct: clean(200).optional(),
  conversationSummary: clean(4000).optional(),
});

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request.headers, 'enquiry'), { limit: 6, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many submissions. Please wait a moment before trying again.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  try {
    if ((json as { kind?: string })?.kind === 'chat-lead') {
      const parsed = leadSchema.safeParse(json);
      if (!parsed.success) {
        return NextResponse.json(
          { error: parsed.error.issues[0]?.message ?? 'Invalid submission.' },
          { status: 400 }
        );
      }
      await createChatLead(parsed.data);
      return NextResponse.json({
        ok: true,
        message: 'Thank you. Your enquiry has been recorded. The Mastana team can contact you regarding your requirement.',
      });
    }

    const parsed = enquirySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid submission.' },
        { status: 400 }
      );
    }

    // Silently accept honeypot hits so bots get no signal.
    if (parsed.data.website) return NextResponse.json({ ok: true, message: 'Your enquiry has been submitted successfully.' });

    const { website, ...enquiry } = parsed.data;
    void website;
    await createEnquiry(enquiry);

    return NextResponse.json({
      ok: true,
      message: 'Your enquiry has been submitted successfully. The Mastana team will get back to you.',
    });
  } catch (error) {
    console.error('[api/enquiry] failed:', error);
    return NextResponse.json(
      { error: 'We could not submit your enquiry right now. Please call or email us instead.' },
      { status: 500 }
    );
  }
}
