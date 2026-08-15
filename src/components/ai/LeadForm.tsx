'use client';

import { useState, type FormEvent } from 'react';

import { contact } from '@/content/company';
import { whatsappLink } from '@/lib/utils';

const WHATSAPP_MESSAGE =
  'Hello Mastana Mechanical Works, I am interested in your textile machinery. I would like to discuss my requirement.';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * In-assistant lead capture. Saves to the ChatLead store and then offers the
 * direct call / WhatsApp routes.
 */
export function LeadForm({
  product,
  conversationSummary,
  onCancel,
}: {
  product: string;
  conversationSummary?: string;
  onCancel: () => void;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;

    const form = new FormData(e.currentTarget);
    setStatus('sending');
    setError(null);

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'chat-lead',
          name: form.get('name'),
          company: form.get('company'),
          email: form.get('email'),
          phone: form.get('phone'),
          requirement: form.get('requirement'),
          recommendedProduct: product || undefined,
          conversationSummary,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Submission failed');
      setStatus('sent');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/15">
          <svg viewBox="0 0 20 20" className="h-5 w-5 text-emerald-400" fill="none" aria-hidden>
            <path d="M4 10.5l4 4 8-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-sm text-mist">
          Thank you. Your enquiry has been recorded. The Mastana team can contact you regarding your requirement.
        </p>

        <div className="grid gap-2 pt-1">
          <a
            href={`tel:${contact.phones[2].tel}`}
            className="flex h-10 items-center justify-center border border-white/15 text-xs font-semibold text-mist transition-colors hover:border-amber-500/60"
          >
            Call Mastana — {contact.phones[2].number}
          </a>
          <a
            href={whatsappLink(contact.whatsapp.e164, WHATSAPP_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-10 items-center justify-center bg-[#25D366] text-xs font-semibold text-white"
          >
            WhatsApp
          </a>
        </div>

        <button onClick={onCancel} className="text-[0.6875rem] text-steel-500 hover:text-amber-400">
          Back to chat
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <h3 className="text-sm font-bold text-mist">Request a quote</h3>
        <p className="mt-1 text-[0.6875rem] text-steel-400">
          Would you like our team to contact you regarding this machine?
        </p>
      </div>

      {product && (
        <div className="border border-amber-500/25 bg-amber-500/[0.06] px-3 py-2">
          <p className="font-mono text-[0.5625rem] uppercase tracking-widest text-amber-400">Machine</p>
          <p className="mt-0.5 text-xs text-steel-200">{product}</p>
        </div>
      )}

      <Field name="name" label="Name" required autoComplete="name" />
      <Field name="company" label="Company" autoComplete="organization" />
      <Field name="email" label="Email" type="email" required autoComplete="email" />
      <Field name="phone" label="Phone" type="tel" autoComplete="tel" />

      <div>
        <label htmlFor="lead-requirement" className="mb-1 block text-[0.6875rem] text-steel-400">
          Requirement
        </label>
        <textarea
          id="lead-requirement"
          name="requirement"
          rows={3}
          className="w-full resize-none border border-white/12 bg-white/[0.03] px-3 py-2 text-xs text-mist placeholder:text-steel-600 focus:border-amber-500/60 focus:outline-none"
          placeholder="Gauge, width, production volume…"
        />
      </div>

      {error && <p className="text-[0.6875rem] text-red-300">{error}</p>}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="h-10 flex-1 bg-amber-500 text-xs font-semibold text-ink-950 transition-colors hover:bg-amber-400 disabled:opacity-50"
        >
          {status === 'sending' ? 'Submitting…' : 'Submit enquiry'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="h-10 border border-white/12 px-4 text-xs text-steel-400 transition-colors hover:text-white"
        >
          Cancel
        </button>
      </div>
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
  const id = `lead-${name}`;
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-[0.6875rem] text-steel-400">
        {label}
        {required && <span className="text-amber-400"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="h-9 w-full border border-white/12 bg-white/[0.03] px-3 text-xs text-mist focus:border-amber-500/60 focus:outline-none"
      />
    </div>
  );
}
