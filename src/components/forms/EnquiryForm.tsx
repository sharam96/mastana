'use client';

import { useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';

import { ArrowRight } from '@/components/ui/Button';
import { cn, productLabel } from '@/lib/utils';
import type { Product } from '@/types/catalog';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function EnquiryForm({
  products,
  source = 'quote',
}: {
  products: Pick<Product, 'slug' | 'name' | 'model'>[];
  source?: 'contact' | 'quote' | 'product';
}) {
  const params = useSearchParams();
  const preselected = params.get('product') ?? '';

  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;

    const form = new FormData(e.currentTarget);
    setStatus('sending');
    setFieldError(null);

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.get('name'),
          company: form.get('company'),
          email: form.get('email'),
          phone: form.get('phone'),
          product: form.get('product'),
          message: form.get('message'),
          website: form.get('website'),
          source,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFieldError(data.error ?? 'Please check the form and try again.');
        setStatus('error');
        return;
      }

      setMessage(data.message);
      setStatus('sent');
    } catch {
      setFieldError('We could not submit your enquiry. Please call or email us instead.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div
        className="border border-emerald-500/25 bg-emerald-500/[0.06] p-8 text-center md:p-12"
        role="status"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15">
          <svg viewBox="0 0 20 20" className="h-6 w-6 text-emerald-400" fill="none" aria-hidden>
            <path
              d="M4 10.5l4 4 8-9"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="mt-5 font-display text-xl font-bold text-mist">Enquiry received</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-steel-300">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate={false} className="space-y-5">
      {/* honeypot */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field name="name" label="Name" required autoComplete="name" />
        <Field name="company" label="Company" autoComplete="organization" />
        <Field name="email" label="Email" type="email" required autoComplete="email" />
        <Field name="phone" label="Phone" type="tel" autoComplete="tel" />
      </div>

      <div>
        <label htmlFor="product" className="mb-2 block text-[0.8125rem] text-steel-400">
          Machine / Product
        </label>
        <input
          id="product"
          name="product"
          list="machine-options"
          defaultValue={preselected}
          placeholder="Select or type a machine"
          className="h-11 w-full border border-white/12 bg-white/[0.03] px-4 text-sm text-mist placeholder:text-steel-600 focus:border-amber-500/60 focus:outline-none"
        />
        <datalist id="machine-options">
          {products.map((p) => (
            <option key={p.slug} value={productLabel(p)} />
          ))}
        </datalist>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-[0.8125rem] text-steel-400">
          Requirement <span className="text-amber-400">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Tell us what you need to produce — gauge, knitting width, production volume, timeline."
          className="w-full resize-y border border-white/12 bg-white/[0.03] px-4 py-3 text-sm text-mist placeholder:text-steel-600 focus:border-amber-500/60 focus:outline-none"
        />
      </div>

      {fieldError && (
        <p className="border border-red-500/25 bg-red-500/5 px-4 py-3 text-sm text-red-300" role="alert">
          {fieldError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className={cn(
          'group inline-flex h-12 items-center justify-center gap-2.5 bg-amber-500 px-8 text-sm font-semibold text-ink-950 transition-all',
          'hover:bg-amber-400 disabled:pointer-events-none disabled:opacity-50'
        )}
      >
        {status === 'sending' ? 'Submitting…' : 'Submit Enquiry'}
        {status !== 'sending' && <ArrowRight />}
      </button>

      <p className="text-xs text-steel-600">
        We use your details only to respond to this enquiry.
      </p>
    </form>
  );
}

function Field({
  name,
  label,
  type = 'text',
  required,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-[0.8125rem] text-steel-400">
        {label}
        {required && <span className="text-amber-400"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="h-11 w-full border border-white/12 bg-white/[0.03] px-4 text-sm text-mist focus:border-amber-500/60 focus:outline-none"
      />
    </div>
  );
}
