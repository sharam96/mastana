import type { Metadata } from 'next';

import { ContactCta } from '@/components/home/ContactCta';
import { WhyMastana } from '@/components/home/WhyMastana';
import { PageHeader } from '@/components/ui/PageHeader';
import { Reveal } from '@/components/ui/Reveal';
import { Section, SectionHeader } from '@/components/ui/Section';
import { company, stats } from '@/content/company';

export const metadata: Metadata = {
  title: 'Why Mastana',
  description:
    'More than 50 years of experience, an in-house R&D wing, stringent quality control and ISO 9001:2008 registration — why customers choose Mastana Mechanical Works.',
  alternates: { canonical: '/why-mastana' },
};

export default function WhyMastanaPage() {
  return (
    <>
      <PageHeader
        eyebrow="Why Mastana"
        title="Quality is not expensive."
        intro="Mastana Mechanical Works helps you strike a real deal. These are the points that have kept customers coming back since 1957."
        crumbs={[{ label: 'Why Mastana' }]}
      />

      {/* verified figures */}
      <section className="hairline-b bg-ink-900" aria-label="Verified figures">
        <div className="container-x">
          <dl className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="border-white/8 py-9 lg:border-l lg:px-8 lg:first:border-l-0 lg:first:pl-0">
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

      <WhyMastana />

      {/* commitment */}
      <Section className="hairline-t relative overflow-hidden bg-ink-900">
        <div className="blueprint pointer-events-none absolute inset-0 opacity-45" aria-hidden />
        <div className="container-x relative">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHeader eyebrow="Our commitment" title="Client satisfaction." />
            </div>
            <div className="lg:col-span-7">
              <Reveal>
                <p className="text-[0.975rem] leading-relaxed text-steel-300 md:text-lg">
                  This underlines our commitment to provide total customer satisfaction and to
                  over-achieve goals as your trusted partner.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 text-[0.975rem] leading-relaxed text-steel-400">
                  We are committed to satisfying our customers by manufacturing and supplying quality
                  products to their entire satisfaction — first time and every time — with continual
                  upgradation in quality.
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <blockquote className="mt-10 border-l-2 border-amber-500 pl-6">
                  <p className="font-display text-2xl font-bold text-mist">
                    &ldquo;{company.motto}&rdquo;
                  </p>
                  <footer className="mt-2 text-sm text-steel-500">{company.legalName}</footer>
                </blockquote>
              </Reveal>
            </div>
          </div>
        </div>
      </Section>

      <ContactCta />
    </>
  );
}
