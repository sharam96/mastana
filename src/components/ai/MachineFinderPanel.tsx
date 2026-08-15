'use client';

import { useRouter } from 'next/navigation';

import { MachineFinder } from '@/components/ai/MachineFinder';

/** Standalone page wrapper for the finder — routes its actions to real pages. */
export function MachineFinderPanel() {
  const router = useRouter();

  return (
    <MachineFinder
      onRequestQuote={(product) => router.push(`/request-quote?product=${encodeURIComponent(product)}`)}
      onCompare={(slugs) => router.push(`/compare?a=${slugs[0]}&b=${slugs[1]}`)}
    />
  );
}
