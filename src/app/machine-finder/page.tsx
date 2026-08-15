import type { Metadata } from 'next';

import { MachineFinderPanel } from '@/components/ai/MachineFinderPanel';
import { PageHeader } from '@/components/ui/PageHeader';

export const metadata: Metadata = {
  title: 'Find My Machine',
  description:
    'Answer four questions and Mastana AI will recommend machines from the Mastana catalogue that match what you produce, your process and your preferred machine type.',
  alternates: { canonical: '/machine-finder' },
};

export default function MachineFinderPage() {
  return (
    <>
      <PageHeader
        eyebrow="Machine Finder"
        title="Find the right machine."
        intro="Four questions about what you produce, and we will point you to machines from the Mastana catalogue that fit. Recommendations only ever include machines we actually build."
        crumbs={[{ label: 'Machine Finder' }]}
      />

      <div className="container-x py-14 md:py-20">
        <div className="mx-auto max-w-3xl border border-white/10 bg-ink-900 p-6 md:p-10">
          <MachineFinderPanel />
        </div>
      </div>
    </>
  );
}
