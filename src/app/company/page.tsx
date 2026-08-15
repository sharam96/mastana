import type { Metadata } from 'next';

import { Story } from '@/components/home/Story';
import { ContactCta } from '@/components/home/ContactCta';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeader } from '@/components/ui/Section';
import { about, company, contact, stats } from '@/content/company';

export const metadata: Metadata = {
  title: 'Company Profile — Manufacturing Since 1957',
  description:
    'Manufacturer, exporter and repairer of hosiery knitting machines, established 1957 in Ludhiana, Punjab. ISO 9001:2008 registered with an in-house R&D wing.',
  alternates: { canonical: '/company' },
};

export default function CompanyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Company Profile"
        title="Manufacturing textile machinery since 1957."
        intro={about.lead}
        crumbs={[{ label: 'Company' }]}
      />

      {/* facts strip */}
      <section className="hairline-b bg-ink-900" aria-label="Company facts">
        <div className="container-x">
          <dl className="grid grid-cols-2 gap-px lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="py-8 lg:py-10">
                <dd className="font-display text-3xl font-extrabold text-white md:text-4xl">
                  {s.display}
                  {'suffix' in s && s.suffix ? (
                    <span className="text-[0.45em] text-amber-500">{s.suffix}</span>
                  ) : null}
                </dd>
                <dt className="mt-2 text-[0.8125rem] font-semibold text-mist">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* profile */}
      <Section>
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <SectionHeader eyebrow="Our profile" title="Only the fittest and finest survive to be among the leaders." />
            </div>
            <div className="lg:col-span-8">
              <div className="space-y-6">
                {about.paragraphs.map((p, i) => (
                  <Reveal key={i} index={i}>
                    <p className="text-[0.975rem] leading-relaxed text-steel-400 md:text-base">{p}</p>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={0.2}>
                <blockquote className="mt-12 border-l-2 border-amber-500 pl-6">
                  <p className="font-display text-xl font-bold text-mist md:text-2xl">
                    &ldquo;{company.motto}&rdquo;
                  </p>
                  <footer className="mt-2 text-sm text-steel-500">
                    {company.legalName} — {company.descriptor}
                  </footer>
                </blockquote>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>

      <Story />

      {/* registered details */}
      <Section className="hairline-t bg-ink-900">
        <div className="container-x">
          <SectionHeader eyebrow="Registered details" title="Where we are." />
          <div className="mt-12 grid gap-px bg-white/8 md:grid-cols-3">
            {contact.addresses.map((a) => (
              <div key={a.label} className="bg-ink-900 p-7 md:p-8">
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
