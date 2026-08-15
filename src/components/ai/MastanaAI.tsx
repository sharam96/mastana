'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type FormEvent } from 'react';

import { LeadForm } from '@/components/ai/LeadForm';
import { MachineFinder } from '@/components/ai/MachineFinder';
import { useAI } from '@/components/ai/ai-context';
import { cn } from '@/lib/utils';

type Source = { title: string; url?: string; productSlug?: string };
type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Source[];
  grounded?: boolean;
};

const GREETING =
  "Hello. I'm Mastana AI. I can help you explore Mastana's textile machinery, compare machines and find the right solution for your production requirements.";

const QUICK_ACTIONS = [
  { label: 'Find a Machine', kind: 'finder' as const },
  { label: 'Compare Machines', kind: 'prompt' as const, prompt: 'Which flat knitting machines can I compare?' },
  { label: 'Product Specifications', kind: 'prompt' as const, prompt: 'What are the specifications of the FX-72S3?' },
  { label: 'Request a Quote', kind: 'lead' as const },
];

let idCounter = 0;
const nextId = () => `m${++idCounter}`;

export function AssistantPanel() {
  const { open, mode, product, openAssistant, closeAssistant, setMode, consumePrompt } = useAI();
  const reduce = useReducedMotion();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([
    { id: 'greeting', role: 'assistant', content: GREETING },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leadProduct, setLeadProduct] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* keep the transcript pinned to the newest message */
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: reduce ? 'auto' : 'smooth' });
  }, [messages, busy, mode, leadProduct, reduce]);

  /* lock background scroll on mobile full-screen */
  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    if (window.matchMedia('(max-width: 767px)').matches) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [open]);

  /* escape closes; focus moves into the panel on open */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAssistant();
    };
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => inputRef.current?.focus(), 220);
    return () => {
      window.removeEventListener('keydown', onKey);
      clearTimeout(t);
    };
  }, [open, closeAssistant]);

  /* a prompt handed over from a product page runs as soon as the panel opens */
  useEffect(() => {
    if (!open) return;
    const prompt = consumePrompt();
    if (prompt) void send(prompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    setMode('chat');
    setLeadProduct(null);
    setError(null);
    setInput('');

    const history = messages
      .filter((m) => m.id !== 'greeting')
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, { id: nextId(), role: 'user', content: trimmed }]);
    setBusy(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          productSlug: product?.slug ?? null,
          categorySlug: product?.categorySlug ?? null,
          history,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Mastana AI is unavailable right now.');

      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: 'assistant',
          content: data.answer,
          sources: data.sources,
          grounded: data.grounded,
        },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  const conversationSummary = messages
    .filter((m) => m.id !== 'greeting')
    .slice(-6)
    .map((m) => `${m.role === 'user' ? 'Customer' : 'Mastana AI'}: ${m.content}`)
    .join('\n');

  return (
    <>
      {/* ------------------------------------------------------- launcher */}
      <motion.button
        type="button"
        onClick={() => (open ? closeAssistant() : openAssistant())}
        aria-label={open ? 'Close Mastana AI' : 'Open Mastana AI assistant'}
        aria-expanded={open}
        initial={false}
        animate={{ scale: 1 }}
        whileHover={reduce ? undefined : { scale: 1.03 }}
        whileTap={reduce ? undefined : { scale: 0.97 }}
        className={cn(
          'fixed bottom-24 right-5 z-50 flex items-center gap-2.5 rounded-full border border-amber-500/30 bg-ink-900/95 py-3 pl-3 pr-4 shadow-[0_16px_50px_-12px_rgba(242,113,28,0.5)] backdrop-blur-xl transition-colors hover:border-amber-500/70 md:bottom-6 md:right-6',
          open && 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto'
        )}
      >
        <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-amber-500">
          <AIGlyph />
          {!open && (
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-ink-900" />
          )}
        </span>
        <span className="text-[0.8125rem] font-semibold tracking-tight text-mist">Mastana AI</span>
      </motion.button>

      {/* ---------------------------------------------------------- panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeAssistant}
              className="fixed inset-0 z-50 bg-ink-950/70 backdrop-blur-sm md:hidden"
              aria-hidden
            />

            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label="Mastana AI assistant"
              initial={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: reduce ? 0 : 16, scale: reduce ? 1 : 0.98 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 flex flex-col border-white/10 bg-ink-900/97 backdrop-blur-2xl md:inset-auto md:bottom-24 md:right-6 md:h-[min(38rem,calc(100vh-9rem))] md:w-[26.5rem] md:rounded-2xl md:border md:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.85)]"
            >
              {/* header */}
              <div className="flex shrink-0 items-start justify-between gap-3 border-b border-white/10 p-5">
                <div className="flex gap-3">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-500">
                    <AIGlyph />
                  </span>
                  <div>
                    <h2 className="font-display text-[0.9375rem] font-bold text-mist">Mastana AI</h2>
                    <p className="text-[0.6875rem] text-steel-400">Your Textile Machinery Assistant</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeAssistant}
                  aria-label="Close assistant"
                  className="flex h-8 w-8 items-center justify-center text-steel-400 transition-colors hover:text-white"
                >
                  <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                    <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {product && (
                <div className="shrink-0 border-b border-white/8 bg-amber-500/[0.06] px-5 py-2.5">
                  <p className="font-mono text-[0.5625rem] uppercase tracking-widest text-amber-400">
                    Viewing
                  </p>
                  <p className="truncate text-xs text-steel-300">{product.label}</p>
                </div>
              )}

              {/* body */}
              <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
                {mode === 'finder' ? (
                  <MachineFinder
                    compact
                    onRequestQuote={(name) => {
                      setLeadProduct(name);
                      setMode('chat');
                    }}
                    onCompare={(slugs) => {
                      closeAssistant();
                      router.push(`/compare?a=${slugs[0]}&b=${slugs[1]}`);
                    }}
                  />
                ) : leadProduct !== null ? (
                  <LeadForm
                    product={leadProduct}
                    conversationSummary={conversationSummary}
                    onCancel={() => setLeadProduct(null)}
                  />
                ) : (
                  <div className="space-y-4">
                    {messages.map((m) => (
                      <MessageBubble key={m.id} message={m} />
                    ))}

                    {busy && (
                      <div className="flex items-center gap-2.5">
                        <div className="flex gap-1" aria-hidden>
                          {[0, 1, 2].map((i) => (
                            <motion.span
                              key={i}
                              className="h-1.5 w-1.5 rounded-full bg-amber-500"
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.15 }}
                            />
                          ))}
                        </div>
                        <p className="text-[0.6875rem] text-steel-500" role="status">
                          Mastana AI is checking the machinery catalogue…
                        </p>
                      </div>
                    )}

                    {error && (
                      <div className="border border-red-500/25 bg-red-500/5 px-3.5 py-2.5">
                        <p className="text-xs text-red-300">{error}</p>
                      </div>
                    )}

                    {messages.length === 1 && !busy && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {QUICK_ACTIONS.map((a) => (
                          <button
                            key={a.label}
                            onClick={() => {
                              if (a.kind === 'finder') setMode('finder');
                              else if (a.kind === 'lead') setLeadProduct(product?.label ?? '');
                              else void send(a.prompt);
                            }}
                            className="border border-white/10 bg-white/[0.02] px-3 py-2.5 text-left text-[0.6875rem] font-medium text-steel-300 transition-all hover:border-amber-500/50 hover:text-amber-300"
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* footer */}
              {mode === 'chat' && leadProduct === null && (
                <form onSubmit={onSubmit} className="shrink-0 border-t border-white/10 p-4">
                  <div className="flex items-end gap-2">
                    <label htmlFor="mastana-ai-input" className="sr-only">
                      Ask Mastana AI a question
                    </label>
                    <textarea
                      id="mastana-ai-input"
                      ref={inputRef}
                      rows={1}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          void send(input);
                        }
                      }}
                      placeholder="Ask about a machine, gauge, width or speed…"
                      className="max-h-28 min-h-10 flex-1 resize-none border border-white/12 bg-white/[0.03] px-3 py-2.5 text-[0.8125rem] text-mist placeholder:text-steel-500 focus:border-amber-500/60 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={busy || !input.trim()}
                      aria-label="Send message"
                      className="flex h-10 w-10 shrink-0 items-center justify-center bg-amber-500 text-ink-950 transition-colors hover:bg-amber-400 disabled:opacity-40"
                    >
                      <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                        <path
                          d="M2 8h11M9 4l4 4-4 4"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setMode('finder')}
                      className="text-[0.625rem] text-steel-500 transition-colors hover:text-amber-400"
                    >
                      Find my machine
                    </button>
                    <p className="text-[0.5625rem] text-steel-600">
                      Answers come from Mastana&apos;s catalogue only.
                    </p>
                  </div>
                </form>
              )}

              {mode === 'finder' && (
                <div className="shrink-0 border-t border-white/10 p-4">
                  <button
                    onClick={() => setMode('chat')}
                    className="text-[0.6875rem] text-steel-400 transition-colors hover:text-amber-400"
                  >
                    ← Back to chat
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div className={cn('max-w-[88%]', isUser && 'text-right')}>
        <div
          className={cn(
            'px-3.5 py-2.5 text-[0.8125rem] leading-relaxed whitespace-pre-wrap',
            isUser
              ? 'bg-amber-500 text-ink-950'
              : 'border border-white/8 bg-white/[0.03] text-steel-200'
          )}
        >
          {message.content}
        </div>

        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {message.sources
              .filter((s) => s.url)
              .slice(0, 3)
              .map((s) => (
                <Link
                  key={s.url}
                  href={s.url!}
                  className="border border-white/10 px-2 py-1 text-[0.5625rem] text-steel-400 transition-colors hover:border-amber-500/50 hover:text-amber-400"
                >
                  {s.title.length > 38 ? `${s.title.slice(0, 36)}…` : s.title}
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AIGlyph() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-ink-950" aria-hidden fill="none">
      <circle cx="10" cy="10" r="2.4" fill="currentColor" />
      <circle cx="10" cy="10" r="6.4" stroke="currentColor" strokeWidth="1.3" opacity="0.55" />
      <path d="M10 1.4v2.2M10 16.4v2.2M1.4 10h2.2M16.4 10h2.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

/** Mounted once in the root layout. */
export function MastanaAI() {
  return <AssistantPanel />;
}
