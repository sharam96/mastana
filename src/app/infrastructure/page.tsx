import type { Metadata } from 'next';

import { ContactCta } from '@/components/home/ContactCta';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeader } from '@/components/ui/Section';
import { contact, infrastructure } from '@/content/company';
import { getCategories } from '@/lib/catalog';
import { countByCategory } from '@/lib/catalog';

export const metadata: Metadata = {
  title: 'Infrastructure',
  description:
    'A state-of-the-art facility spread over a 6,000 sq. ft plot area in Ludhiana, well organised and equipped with all the essential machinery and tools.',
  alternates: { canonical: '/infrastructure' },
};

export default function InfrastructurePage() {
  const categories = getCategories();

  return (
    <>
      <PageHeader
        eyebrow="Infrastructure"
        title="A facility built to adapt."
        intro="Mastana owns a full-fledged infrastructure capable of adapting to all new technological advancement and innovation in the hosiery industry."
        crumbs={[{ label: 'Infrastructure' }]}
      />

      {/* headline figure */}
      <section className="hairline-b relative overflow-hidden bg-ink-900">
        <div className="blueprint pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="container-x relative py-14 md:py-20">
          <div className="grid gap-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-5">
              <p className="font-display text-[clamp(3rem,9vw,6rem)] leading-none font-extrabold text-white">
                6,000
                <span className="text-[0.28em] text-amber-500"> sq ft</span>
              </p>
              <p className="mt-4 text-sm text-steel-400">Plot area of the Mastana facility.</p>
            </div>
            <div className="md:col-span-7">
              <p className="text-[0.975rem] leading-relaxed text-steel-300 md:text-lg">
                &ldquo;We have a state-of-the-art infrastructure facility spread over 6000 sq. feet plot
                area. The facility is well organized and armed with all the essential machinery and
                tools.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* pillars */}
      <Section>
        <div className="container-x">
          <SectionHeader
            eyebrow="Operations"
            title="Four parts of the works."
            intro="Manufacturing, research and development, quality control and the ability to absorb new technology."
          />

          <div className="mt-14 grid gap-px bg-white/8 md:mt-20 md:grid-cols-2">
            {infrastructure.map((item, i) => (
              <Reveal key={item.title} index={i % 2}>
                <div className="bracket h-full bg-ink-950 p-8 md:p-12">
                  <span className="font-mono text-[0.625rem] text-steel-600 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-5 font-display text-xl font-bold text-mist md:text-2xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-steel-400">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* production scope */}
      <Section className="hairline-t bg-ink-900">
        <div className="container-x">
          <SectionHeader
            eyebrow="Production scope"
            title="What the works produces."
            intro="The categories currently manufactured, supplied and serviced by Mastana."
          />

          <ul className="mt-14 grid gap-px bg-white/8 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c, i) => (
              <Reveal key={c.slug} index={i % 4}>
                <li className="h-full bg-ink-900 p-6">
                  <span className="font-mono text-[0.625rem] text-steel-600 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-mist">{c.name}</h3>
                  <p className="mt-1.5 text-xs text-steel-500">
                    {countByCategory(c.slug)} {countByCategory(c.slug) === 1 ? 'machine' : 'machines'}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* locations */}
      <Section>
        <div className="container-x">
          <SectionHeader eyebrow="Locations" title="Head office, works and branches." />

          <div className="mt-14 grid gap-px bg-white/8 md:grid-cols-3">
            {contact.addresses.map((a) => (
              <div key={a.label} className="bg-ink-950 p-8">
                <p className="font-mono text-[0.625rem] uppercase tracking-widest text-amber-400">
                  {a.label}
                </p>
                <address className="mt-3 text-sm leading-relaxed text-steel-300 not-italic">
                  {a.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <p className="eyebrow mb-3">Branches</p>
            <ul className="flex flex-wrap gap-2">
              {contact.branches.map((b) => (
                <li
                  key={b}
                  className="border border-white/10 bg-white/[0.02] px-3.5 py-1.5 text-sm text-steel-300"
                >
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <ContactCta />
    </>
  );
}
