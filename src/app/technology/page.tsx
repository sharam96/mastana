import type { Metadata } from 'next';
import Image from 'next/image';

import { ContactCta } from '@/components/home/ContactCta';
import { ArrowRight, ButtonLink } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeader } from '@/components/ui/Section';
import { infrastructure } from '@/content/company';
import { getFeaturedProducts } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Technology & R&D',
  description:
    'Mastana runs an in-house Research and Development wing with trained engineers, undertaking new model design development and rigorous quality control on every machine.',
  alternates: { canonical: '/technology' },
};

const CAPABILITIES = [
  {
    title: 'Design development',
    body: 'New design development of models is undertaken regularly with qualified engineers, so the range keeps pace with what the hosiery industry needs.',
  },
  {
    title: 'Testing before dispatch',
    body: 'All products pass through rigorous and stringent quality control tests and workmanship checks in the R&D wing to ensure trouble-free operation.',
  },
  {
    title: 'International standards',
    body: 'Mastana products meet international standards in respect of design, quality and finishing.',
  },
  {
    title: 'Continual upgradation',
    body: 'Quality is upgraded continually — the firm holds ISO 9001:2008 registration and treats total product quality as its stated goal.',
  },
];

export default function TechnologyPage() {
  const machines = getFeaturedProducts().slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow="Technology & R&D"
        title="Engineered in-house, tested before it ships."
        intro="Mastana's Research and Development wing is staffed by a team of highly motivated, dedicated, conscientious and trained engineers."
        crumbs={[{ label: 'Technology' }]}
      />

      {/* capability grid over blueprint */}
      <Section className="relative overflow-hidden">
        <div className="blueprint pointer-events-none absolute inset-0 opacity-45" aria-hidden />
        <div className="container-x relative">
          <SectionHeader
            eyebrow="Capability"
            title="What the R&D wing does."
            intro="Every claim here is how Mastana describes its own engineering process."
          />

          <div className="mt-14 grid gap-px bg-white/8 md:mt-20 md:grid-cols-2">
            {CAPABILITIES.map((c, i) => (
              <Reveal key={c.title} index={i % 2}>
                <div className="bracket h-full bg-ink-950 p-8 md:p-10">
                  <span className="font-mono text-[0.625rem] text-steel-600 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-mist">{c.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-steel-400">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* engineering pillars */}
      <Section className="hairline-t bg-ink-900">
        <div className="container-x">
          <SectionHeader eyebrow="Process" title="From design to dispatch." />
          <ol className="mt-14 grid gap-px bg-white/8 md:mt-20 md:grid-cols-2 xl:grid-cols-4">
            {infrastructure.map((item, i) => (
              <Reveal key={item.title} index={i}>
                <li className="h-full bg-ink-900 p-8">
                  <span className="font-display text-3xl font-extrabold text-amber-500/25">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 text-base font-bold text-mist">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-steel-400">{item.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </Section>

      {/* engineering applied to machines */}
      <Section>
        <div className="container-x">
          <SectionHeader
            eyebrow="Applied engineering"
            title="How it shows up on the machine."
            intro="Control systems, servo racking, protection monitoring and patented sinker technology — the specifications published for each machine."
            action={
              <ButtonLink href="/machines" variant="outline">
                All machines
                <ArrowRight />
              </ButtonLink>
            }
          />

          <div className="mt-14 grid gap-6 md:mt-20 md:grid-cols-3">
            {machines.map((m, i) => (
              <Reveal key={m.slug} index={i}>
                <article className="h-full border border-white/8 bg-ink-900">
                  <div className="plate relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={m.image}
                      alt={`${m.model ?? ''} ${m.name}`.trim()}
                      fill
                      sizes="(max-width: 768px) 90vw, 30vw"
                      className="object-contain p-5"
                    />
                  </div>
                  <div className="p-6">
                    <p className="font-mono text-[0.625rem] uppercase tracking-widest text-amber-400">
                      {m.model ?? m.categoryName}
                    </p>
                    <h3 className="mt-2 text-sm font-semibold text-mist">{m.name}</h3>
                    <dl className="mt-4 space-y-2 border-t border-white/8 pt-4">
                      {m.specifications
                        .filter((s) => /control|protection|racking|motor|sinker/i.test(s.label))
                        .slice(0, 2)
                        .map((s) => (
                          <div key={s.label}>
                            <dt className="font-mono text-[0.5625rem] uppercase tracking-wider text-steel-600">
                              {s.label}
                            </dt>
                            <dd className="mt-0.5 line-clamp-3 text-xs leading-relaxed break-words text-steel-400">
                              {s.value}
                            </dd>
                          </div>
                        ))}
                    </dl>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <ContactCta />
    </>
  );
}
