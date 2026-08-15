'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type AIProductContext = { slug: string; label: string; categorySlug: string } | null;

type OpenOptions = { prompt?: string; mode?: 'chat' | 'finder' };

type AIContextValue = {
  open: boolean;
  mode: 'chat' | 'finder';
  pendingPrompt: string | null;
  product: AIProductContext;
  openAssistant: (opts?: OpenOptions) => void;
  closeAssistant: () => void;
  setMode: (mode: 'chat' | 'finder') => void;
  consumePrompt: () => string | null;
  setProduct: (product: AIProductContext) => void;
};

const AIContext = createContext<AIContextValue | null>(null);

export function AIProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'chat' | 'finder'>('chat');
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [product, setProduct] = useState<AIProductContext>(null);

  const openAssistant = useCallback((opts?: OpenOptions) => {
    if (opts?.mode) setMode(opts.mode);
    if (opts?.prompt) setPendingPrompt(opts.prompt);
    setOpen(true);
  }, []);

  const closeAssistant = useCallback(() => setOpen(false), []);

  const consumePrompt = useCallback(() => {
    let value: string | null = null;
    setPendingPrompt((current) => {
      value = current;
      return null;
    });
    return value;
  }, []);

  const value = useMemo(
    () => ({
      open,
      mode,
      pendingPrompt,
      product,
      openAssistant,
      closeAssistant,
      setMode,
      consumePrompt,
      setProduct,
    }),
    [open, mode, pendingPrompt, product, openAssistant, closeAssistant, consumePrompt]
  );

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}

export function useAI(): AIContextValue {
  const ctx = useContext(AIContext);
  if (!ctx) throw new Error('useAI must be used inside <AIProvider>');
  return ctx;
}
